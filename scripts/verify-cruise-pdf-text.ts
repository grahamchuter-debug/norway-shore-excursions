import {
  buildCruisePlanPdfFilename,
  exportCruisePlanPdfToBuffer,
} from "../src/lib/export-cruise-plan-pdf";
import { verifyPdfFontRegistration } from "../src/lib/pdf/pdf-fonts";
import {
  assertPdfDocumentTextIsSafe,
  extractDecodedPdfVisibleText,
  formatPdfReturnConfidenceDisplay,
  renderPlainRating,
  renderPlainRatingWithLabel,
  scanPdfForBrokenCharacters,
  validateCruiseGuidePdfQuality,
} from "../src/lib/pdf/pdf-text";
import {
  buildCruiseFitSummary,
  findPortScheduleForPdf,
} from "../src/lib/pdf/cruise-guide-pdf-schedule";
import { generatePlannerRecommendations } from "../src/lib/norway-cruise-planner-engine";

async function main() {
  const result = generatePlannerRecommendations({
    cruiseLine: "P&O Cruises",
    shipName: "Iona",
    sailingMonth: "June",
    selectedPortSlugs: ["flam", "bergen", "olden", "stavanger", "geiranger"],
    interests: ["Fjords", "Scenic Drives"],
    travellerIds: ["couples"],
    fitnessLevel: "Easy",
    portTime: "6 to 8 hours",
  });

  const flamSchedule = findPortScheduleForPdf("flam", "Iona", "June", "2026");

  const input = {
    result,
    cruiseLine: "P&O Cruises",
    shipName: "Iona",
    sailingMonth: "June",
    sailingYear: "2026",
    sailingDate: flamSchedule?.arrival_date ?? "2026-06-12",
    fitnessLevel: "Easy" as const,
    sortedRecommendations: result.recommendations,
  };

  const { buffer, pageCount } = await exportCruisePlanPdfToBuffer(input);
  const pdfText = Buffer.from(buffer).toString("latin1");
  const visibleText = extractDecodedPdfVisibleText(pdfText);
  const issues: string[] = [];

  issues.push(...verifyPdfFontRegistration(pdfText));
  issues.push(...assertPdfDocumentTextIsSafe(pdfText));
  issues.push(...scanPdfForBrokenCharacters(pdfText));
  issues.push(
    ...validateCruiseGuidePdfQuality(pdfText, {
      personalSummary: result.summary.personalSummary,
      expectedLinkCount: 1 + input.sortedRecommendations.length + 1,
    }),
  );

  const plainRating = renderPlainRating(5, 5);
  if (plainRating !== "5/5") {
    issues.push(`renderPlainRating output is invalid: ${plainRating}`);
  }

  const plainRatingLabel = renderPlainRatingWithLabel(5, "Very High");
  if (plainRatingLabel !== "5/5 Very High") {
    issues.push("renderPlainRatingWithLabel output is invalid");
  }

  const returnDisplay = formatPdfReturnConfidenceDisplay({ stars: 4, label: "High" });
  if (returnDisplay.headline !== "High Confidence") {
    issues.push("formatPdfReturnConfidenceDisplay headline is invalid");
  }
  if (returnDisplay.ratingLine !== "Confidence Rating: 4/5") {
    issues.push("formatPdfReturnConfidenceDisplay rating line is invalid");
  }

  const flamRec = result.recommendations.find((rec) => rec.portSlug === "flam");
  const timedSchedule = {
    port: "flam",
    ship: "Spirit Of Adventure",
    cruise_line: "Saga",
    passengers: 999,
    arrival_date: "2026-06-01",
    arrival_time: "10:00",
    departure_time: "19:00",
    all_aboard_time: null,
    source: "test",
    source_url: "",
    source_checked: null,
    notes: "",
  };
  const fitSummary = flamRec
    ? buildCruiseFitSummary("flam", flamRec.recommended, timedSchedule)
    : null;
  if (!fitSummary) {
    issues.push("buildCruiseFitSummary failed for timed schedule fixture");
  }

  if (!visibleText.includes("CRUISE MATCH SCORE")) {
    issues.push("Cruise Match Score card label missing from PDF");
  }

  if (!/Rating:\s*\d\/5/.test(visibleText)) {
    issues.push("Match score rating line missing from PDF");
  }

  if (!visibleText.includes("RETURN") || !visibleText.includes("SHIP CONFIDENCE")) {
    issues.push("Return-to-ship confidence card label missing from PDF");
  }

  if (!visibleText.includes("Confidence Rating:")) {
    issues.push("Return confidence rating line missing from PDF");
  }

  if (flamSchedule && !visibleText.includes("YOUR CRUISE")) {
    issues.push("YOUR CRUISE panel missing despite Flam schedule data");
  }

  if (!visibleText.includes("Why this excursion fits your cruise:")) {
    issues.push("Excursion fit explanation missing from page 2 cards");
  }

  if (!visibleText.includes("View Recommended Excursions")) {
    issues.push("Page 1 CTA missing from PDF");
  }

  if (!visibleText.includes("View Tour and Book Online")) {
    issues.push("Page 2 CTA missing from PDF");
  }

  if (!/Plan\s*&\s*Book Your Norway Shore Excursions/.test(visibleText)) {
    issues.push("Page 3 CTA missing from PDF");
  }

  if (result.summary.bestPort.toLowerCase() === result.summary.bestHiddenGem.toLowerCase()) {
    issues.push("Best Port and Hidden Gem must not be identical");
  }

  const linkCount = (pdfText.match(/\/URI \(/g) ?? []).length;
  const filename = buildCruisePlanPdfFilename("P&O Cruises", "Iona");
  console.log(`Verified PDF: ${filename}`);
  console.log(`Pages: ${pageCount}`);
  console.log(`Size: ${Buffer.from(buffer).byteLength} bytes`);
  console.log(`Best Port: ${result.summary.bestPort}`);
  console.log(`Hidden Gem: ${result.summary.bestHiddenGem} (${result.summary.bestHiddenGemLabel})`);
  console.log(`Personal summary: ${result.summary.personalSummary}`);
  console.log(`Rating preview: ${plainRatingLabel}`);
  console.log(`Return confidence preview: ${returnDisplay.headline} · ${returnDisplay.ratingLine}`);
  if (fitSummary) {
    console.log(
      `Cruise fit fixture: ${fitSummary.portTimeLabel} port · ${fitSummary.returnMarginLabel} margin · ${fitSummary.confidenceStars}/5 ${fitSummary.confidenceLabel}`,
    );
  }

  if (issues.length > 0) {
    console.error("\nPDF verification failed:");
    for (const issue of issues) {
      console.error(`  - ${issue}`);
    }
    process.exit(1);
  }

  console.log("\nPDF verification passed:");
  console.log("  - NotoSans embedded");
  console.log("  - Plain-text ratings verified");
  console.log("  - No broken encoding or merged score values");
  console.log(`  - ${linkCount} clickable links found`);
  console.log("  - Score and confidence cards formatted correctly");
  console.log("  - Schedule panel and excursion fit copy present");
  console.log("  - Best Port and Hidden Gem are distinct");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
