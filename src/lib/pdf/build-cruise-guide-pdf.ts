import type { jsPDF } from "jspdf";

import {
  defaultNorwayCruiseGuidePdfConfig,
  type CruiseGuidePdfConfig,
} from "@/lib/pdf/cruise-guide-pdf-config";
import {
  buildVoyageSubtitle,
  createPdfContext,
  drawBrandedHeader,
  drawCountdownBox,
  drawCruiseFitSummaryPanel,
  drawCtaButton,
  drawHeroBanner,
  drawMatchScoreSideCard,
  drawPageFooter,
  drawReturnConfidenceSideCard,
  drawSectionPanel,
  drawSummaryCard,
  drawYourCruisePanel,
  ensureSpace,
  pdfSetFont,
  resolvePortBookingUrl,
  setDrawRgb,
  setFillRgb,
  setTextRgb,
  shortenText,
  startNewPage,
  type PdfContext,
} from "@/lib/pdf/cruise-guide-pdf-helpers";
import { formatScheduleTime } from "@/lib/cruise-schedule-config";
import { registerPdfFonts } from "@/lib/pdf/pdf-fonts";
import {
  formatPdfReturnConfidenceDisplay,
  logCruiseGuidePdfQualityIssues,
  pdfSafeText,
  type PdfFontSupport,
} from "@/lib/pdf/pdf-text";
import {
  buildCruiseFitSummary,
  buildExcursionFitExplanation,
  calculateDaysUntilSailing,
  collectScheduleStats,
  estimateExcursionDurationLabel,
  findPortScheduleForPdf,
  findPrimaryCruiseScheduleForPdf,
  formatFitnessLabel,
  formatPortTimeFromSchedule,
  formatSailingMonthYear,
  formatThemeRatingsLine,
  getMatchScoreStars,
  getOverallReturnConfidenceDisplay,
  getReturnConfidenceDisplay,
  loadPdfHeroImage,
  type PdfHeroImage,
} from "@/lib/pdf/cruise-guide-pdf-schedule";
import {
  getMatchScoreBand,
  type PlannerResult,
  type PortRecommendation,
} from "@/lib/norway-cruise-planner-engine";
import { portBySlug, type FitnessLevel } from "@/lib/ports-data";

export type CruisePlanPdfInput = {
  result: PlannerResult;
  cruiseLine: string;
  shipName: string;
  sailingMonth: string;
  sailingYear?: string;
  sailingDate?: string;
  fitnessLevel: FitnessLevel;
  sortedRecommendations: readonly PortRecommendation[];
  heroImageUrl?: string;
};

export type CruisePlanPdfAssets = {
  heroImage: PdfHeroImage | null;
};

export async function prepareCruisePlanPdfAssets(
  input: CruisePlanPdfInput,
  config: CruiseGuidePdfConfig = defaultNorwayCruiseGuidePdfConfig,
): Promise<CruisePlanPdfAssets> {
  const heroUrl = input.heroImageUrl ?? config.defaultHeroImage;
  const heroImage = await loadPdfHeroImage(heroUrl);
  return { heroImage };
}

function renderPage1Snapshot(
  ctx: PdfContext,
  input: CruisePlanPdfInput,
  assets: CruisePlanPdfAssets,
): void {
  const { pdf, config, margin, contentWidth } = ctx;
  const { result, cruiseLine, shipName, sailingMonth } = input;
  const sailingYear = input.sailingYear ?? "2026";
  const { summary } = result;
  const band = getMatchScoreBand(summary.overallScore);
  const subtitle = buildVoyageSubtitle(cruiseLine, shipName, sailingMonth, sailingYear);
  const portSlugs = input.sortedRecommendations.map((rec) => rec.portSlug);
  const scheduleStats = collectScheduleStats(
    portSlugs,
    shipName,
    sailingMonth,
    sailingYear,
  );
  const returnConfidence = getOverallReturnConfidenceDisplay({
    greenCount: summary.greenCount,
    amberCount: summary.amberCount,
    redCount: summary.redCount,
    scheduleRowsWithAllAboard: scheduleStats.withAllAboard,
    scheduleRowsTotal: scheduleStats.total,
  });
  const returnDisplay = formatPdfReturnConfidenceDisplay(returnConfidence);
  const primarySchedule = findPrimaryCruiseScheduleForPdf({
    portSlugs,
    shipName,
    sailingMonth,
    sailingYear,
    sailingDate: input.sailingDate,
  });

  ctx.y = 0;
  drawHeroBanner(ctx, assets.heroImage);
  drawBrandedHeader(ctx, subtitle);

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(17);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text(config.guideTitle, margin, ctx.y);
  ctx.y += 7;

  pdfSetFont(ctx, "normal");
  pdf.setFontSize(10);
  setTextRgb(pdf, config.colors.slate);
  pdf.text(
    `${shipName || "Your ship"} · ${cruiseLine || "Your cruise line"} · ${formatSailingMonthYear(sailingMonth, sailingYear)}`,
    margin,
    ctx.y,
  );
  ctx.y += 6;

  if (input.sailingDate) {
    const daysUntil = calculateDaysUntilSailing(input.sailingDate);
    if (daysUntil !== null && daysUntil >= 0) {
      drawCountdownBox(ctx, daysUntil);
    }
  }

  const scoreTop = ctx.y;
  const scoreWidth = contentWidth * 0.56;
  const returnWidth = contentWidth - scoreWidth - 4;
  const cardHeight = 36;

  drawMatchScoreSideCard(
    ctx,
    margin,
    scoreTop,
    scoreWidth,
    summary.overallScore,
    band.label,
    getMatchScoreStars(summary.overallScore),
    input.fitnessLevel,
  );

  drawReturnConfidenceSideCard(
    ctx,
    margin + scoreWidth + 4,
    scoreTop,
    returnWidth,
    returnDisplay.headline,
    returnDisplay.ratingLine,
    returnConfidence.detail,
  );

  ctx.y = scoreTop + cardHeight + 5;

  if (primarySchedule) {
    drawYourCruisePanel(ctx, {
      shipName: primarySchedule.ship,
      arrivalLabel: formatScheduleTime(primarySchedule.arrival_time),
      departureLabel: formatScheduleTime(primarySchedule.departure_time),
      portTimeLabel: formatPortTimeFromSchedule(primarySchedule),
    });
  }

  const hiddenGemLabel = summary.bestHiddenGemLabel;
  const cards = [
    {
      label: "Best Port",
      value: summary.bestPort,
      detail: shortenText(summary.bestPortWhy, 70),
    },
    {
      label: hiddenGemLabel,
      value: summary.bestHiddenGem,
      detail: shortenText(summary.bestHiddenGemWhy, 70),
    },
    { label: "Best Excursion Type", value: summary.bestExcursionType },
  ];

  const cardGap = 4;
  const cardWidth = (contentWidth - cardGap) / 2;
  const summaryCardHeight = 22;
  const gridTop = ctx.y;

  cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    drawSummaryCard(
      ctx,
      margin + col * (cardWidth + cardGap),
      gridTop + row * (summaryCardHeight + cardGap),
      cardWidth,
      summaryCardHeight,
      card.label,
      card.value,
      card.detail,
    );
  });

  ctx.y = gridTop + 2 * (summaryCardHeight + cardGap) + 6;

  setFillRgb(pdf, config.colors.cardBg);
  setDrawRgb(pdf, config.colors.border);
  pdf.setLineWidth(0.2);
  const summaryLines = pdf.splitTextToSize(summary.personalSummary, contentWidth - 8);
  const summaryLineHeight = 4.2;
  const summaryBoxHeight = Math.max(24, 11 + summaryLines.length * summaryLineHeight);
  pdf.roundedRect(margin, ctx.y, contentWidth, summaryBoxHeight, 2, 2, "FD");

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(8);
  setTextRgb(pdf, config.colors.gold);
  pdf.text("YOUR PERSONAL SUMMARY", margin + 4, ctx.y + 6);

  pdfSetFont(ctx, "normal");
  pdf.setFontSize(9);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text(summaryLines, margin + 4, ctx.y + 12);

  ctx.y += summaryBoxHeight + 8;

  drawCtaButton(
    ctx,
    margin,
    ctx.y,
    contentWidth,
    pdfSafeText("View Recommended Excursions", ctx.fonts),
    config.urls.excursions,
    "primary",
  );
  ctx.y += 14;
}

function renderPortRecommendationCard(
  ctx: PdfContext,
  rec: PortRecommendation,
  stopNumber: number,
  input: CruisePlanPdfInput,
): void {
  const { pdf, config, margin, contentWidth } = ctx;
  const returnDisplay = getReturnConfidenceDisplay(rec.returnConfidence);
  const durationLabel = estimateExcursionDurationLabel(rec.portSlug, rec.recommended);
  const bestFor =
    rec.bestForTags[0] ||
    portBySlug[rec.portSlug]?.bestFor.split(",")[0]?.trim() ||
    "Cruise passengers";
  const bookingUrl = resolvePortBookingUrl(rec, config);
  const scheduleRow = findPortScheduleForPdf(
    rec.portSlug,
    input.shipName,
    input.sailingMonth,
    input.sailingYear ?? "2026",
  );
  const fitSummary = buildCruiseFitSummary(rec.portSlug, rec.recommended, scheduleRow);
  const fitExplanation = shortenText(
    buildExcursionFitExplanation(rec, fitSummary),
    160,
  );

  const snapshotHeight = 20;
  const fitSummaryHeight = fitSummary ? 24 : 0;
  const whyBlockHeight = 14;
  const cardHeight =
    7 + 8 + snapshotHeight + fitSummaryHeight + whyBlockHeight + 11;

  ensureSpace(ctx, cardHeight + 3);

  const y = ctx.y;
  setFillRgb(pdf, config.colors.white);
  setDrawRgb(pdf, config.colors.border);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(margin, y, contentWidth, cardHeight, 2.5, 2.5, "FD");

  setFillRgb(pdf, config.colors.softGrey);
  pdf.roundedRect(margin, y, contentWidth, 7, 2.5, 2.5, "F");
  pdf.rect(margin, y + 3.5, contentWidth, 3.5, "F");

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(8);
  setTextRgb(pdf, config.colors.gold);
  pdf.text(`Stop ${stopNumber}`, margin + 3, y + 4.5);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text(`· ${rec.portName}`, margin + 15, y + 4.5);
  const fitLabel = `Fit Score: ${rec.cruiseFitScore}/100`;
  pdf.text(fitLabel, margin + contentWidth - pdf.getTextWidth(fitLabel) - 3, y + 4.5);

  const recommendedTop = y + 9;
  pdf.setFontSize(7.5);
  pdf.text("Recommended:", margin + 3, recommendedTop);
  pdf.setFontSize(9);
  pdf.text(shortenText(rec.recommended, 58), margin + 3, recommendedTop + 4);

  const snapshotTop = recommendedTop + 8;
  setFillRgb(pdf, config.colors.cardBg);
  setDrawRgb(pdf, config.colors.border);
  pdf.setLineWidth(0.15);
  pdf.roundedRect(margin + 3, snapshotTop, contentWidth - 6, snapshotHeight, 1.5, 1.5, "FD");

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(6.8);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text("Quick Snapshot", margin + 5, snapshotTop + 4);

  pdfSetFont(ctx, "normal");
  pdf.setFontSize(6.5);
  setTextRgb(pdf, config.colors.slate);
  pdf.text(`Duration: ${durationLabel}`, margin + 5, snapshotTop + 7.5);
  pdf.text(`Walking: ${formatFitnessLabel(input.fitnessLevel)}`, margin + 45, snapshotTop + 7.5);
  pdf.text(`Type: ${rec.excursionType}`, margin + 80, snapshotTop + 7.5);
  pdf.text(`Best For: ${shortenText(bestFor, 28)}`, margin + 5, snapshotTop + 11);
  pdf.text(formatThemeRatingsLine(rec.excursionType, rec.portSlug), margin + 5, snapshotTop + 14.5);
  pdf.text(
    `Return Confidence: ${returnDisplay.stars}/5 ${returnDisplay.label}`,
    margin + 5,
    snapshotTop + 18,
  );

  let contentBottom = snapshotTop + snapshotHeight + 3;

  if (fitSummary) {
    const panelHeight = drawCruiseFitSummaryPanel(
      ctx,
      margin + 3,
      contentBottom,
      contentWidth - 6,
      fitSummary,
    );
    contentBottom += panelHeight + 3;
  }

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(7);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text("Why this excursion fits your cruise:", margin + 3, contentBottom);
  pdfSetFont(ctx, "normal");
  pdf.setFontSize(6.8);
  setTextRgb(pdf, config.colors.slate);
  const whyLines = pdf.splitTextToSize(fitExplanation, contentWidth - 8);
  pdf.text(whyLines.slice(0, 2), margin + 3, contentBottom + 3.5);

  const buttonY = y + cardHeight - 9;
  drawCtaButton(
    ctx,
    margin + 3,
    buttonY,
    contentWidth - 6,
    pdfSafeText("View Tour and Book Online", ctx.fonts),
    bookingUrl,
    "primary",
  );

  ctx.y = y + cardHeight + 3;
}

function renderPage2PortPlan(
  ctx: PdfContext,
  input: CruisePlanPdfInput,
): void {
  const { pdf, config, margin } = ctx;
  const subtitle = buildVoyageSubtitle(
    input.cruiseLine,
    input.shipName,
    input.sailingMonth,
    input.sailingYear ?? "2026",
  );

  drawBrandedHeader(ctx, subtitle);

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(15);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text("Your Day by Day Norway Shore Excursion Plan", margin, ctx.y);
  ctx.y += 6;

  pdfSetFont(ctx, "normal");
  pdf.setFontSize(8.5);
  setTextRgb(pdf, config.colors.slate);
  pdf.text("Tap a button to view tours and book online for each port day.", margin, ctx.y);
  ctx.y += 6;

  input.sortedRecommendations.forEach((rec, index) => {
    renderPortRecommendationCard(ctx, rec, index + 1, input);
  });
}

function renderPage3TravelGuide(
  ctx: PdfContext,
  input: CruisePlanPdfInput,
): void {
  const { pdf, config, margin, contentWidth } = ctx;
  const subtitle = buildVoyageSubtitle(
    input.cruiseLine,
    input.shipName,
    input.sailingMonth,
    input.sailingYear ?? "2026",
  );

  drawBrandedHeader(ctx, subtitle);

  pdfSetFont(ctx, "bold");
  pdf.setFontSize(15);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text(config.travelGuidePageTitle, margin, ctx.y);
  ctx.y += 8;

  for (const section of config.travelGuideSections) {
    if (section.bullets) {
      drawSectionPanel(
        ctx,
        section.title,
        section.bullets.map((bullet) => `• ${bullet}`),
      );
    } else if (section.body) {
      drawSectionPanel(ctx, section.title, [section.body]);
    }
  }

  drawSectionPanel(
    ctx,
    config.whyBookSection.title,
    config.whyBookSection.bullets.map((bullet) => `• ${bullet}`),
  );

  ctx.y += 2;
  pdfSetFont(ctx, "bold");
  pdf.setFontSize(10);
  setTextRgb(pdf, config.colors.navyDeep);
  pdf.text("Ready to plan your Norway port days?", margin, ctx.y);
  ctx.y += 6;

  drawCtaButton(
    ctx,
    margin,
    ctx.y,
    contentWidth,
    pdfSafeText("Plan & Book Your Norway Shore Excursions", ctx.fonts),
    config.urls.home,
    "primary",
  );
  ctx.y += 14;
}

export function buildCruiseGuidePdfDocument(
  pdf: jsPDF,
  input: CruisePlanPdfInput,
  config: CruiseGuidePdfConfig = defaultNorwayCruiseGuidePdfConfig,
  assets: CruisePlanPdfAssets = { heroImage: null },
  fonts: PdfFontSupport,
): void {
  const ctx = createPdfContext(pdf, config, fonts);

  renderPage1Snapshot(ctx, input, assets);
  startNewPage(ctx);
  renderPage2PortPlan(ctx, input);
  startNewPage(ctx);
  renderPage3TravelGuide(ctx, input);

  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    drawPageFooter(ctx, page, totalPages);
  }
}

export function buildCruisePlanPdfFilename(
  cruiseLine: string,
  shipName: string,
): string {
  const parts = ["your-personal-norway-cruise-guide"];
  const shipPart = shipName.trim() || cruiseLine.trim();
  if (shipPart) {
    parts.push(
      shipPart
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  }
  return `${parts.filter(Boolean).join("-")}.pdf`;
}

export async function exportCruisePlanPdf(
  input: CruisePlanPdfInput,
  filename: string,
  config: CruiseGuidePdfConfig = defaultNorwayCruiseGuidePdfConfig,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const assets = await prepareCruisePlanPdfAssets(input, config);
  const fonts = await registerPdfFonts(pdf);
  buildCruiseGuidePdfDocument(pdf, input, config, assets, fonts);
  const buffer = pdf.output("arraybuffer");
  logCruiseGuidePdfQualityIssues(Buffer.from(buffer).toString("latin1"), {
    personalSummary: input.result.summary.personalSummary,
    expectedLinkCount: 1 + input.sortedRecommendations.length + 1,
  });
  pdf.save(filename);
}

export async function exportCruisePlanPdfToBuffer(
  input: CruisePlanPdfInput,
  config: CruiseGuidePdfConfig = defaultNorwayCruiseGuidePdfConfig,
): Promise<{ buffer: ArrayBuffer; pageCount: number }> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const assets = await prepareCruisePlanPdfAssets(input, config);
  const fonts = await registerPdfFonts(pdf);
  buildCruiseGuidePdfDocument(pdf, input, config, assets, fonts);
  const buffer = pdf.output("arraybuffer");
  const pdfBinary = Buffer.from(buffer).toString("latin1");
  logCruiseGuidePdfQualityIssues(pdfBinary, {
    personalSummary: input.result.summary.personalSummary,
    expectedLinkCount: 1 + input.sortedRecommendations.length + 1,
  });
  return {
    buffer,
    pageCount: pdf.getNumberOfPages(),
  };
}
