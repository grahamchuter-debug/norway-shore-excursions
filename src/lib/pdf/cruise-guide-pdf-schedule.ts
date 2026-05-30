import {
  calculateExcursionFit,
  formatMinutes,
  formatReturnMargin,
  getAvailablePortMinutes,
  type FitConfidenceTier,
} from "@/lib/excursion-fit-calculator";
import { buildScheduleMonthPrefix } from "@/lib/cruise-schedule-config";
import type { CruiseScheduleRow } from "@/lib/cruiseSchedules";
import { getScheduleForShip, getSchedulesByPort } from "@/lib/cruiseSchedules";
import type { ReturnConfidence, PortRecommendation } from "@/lib/norway-cruise-planner-engine";
import { portBySlug } from "@/lib/ports-data";
import type { FitnessLevel } from "@/lib/ports-data";

import type { PdfFontSupport } from "@/lib/pdf/pdf-text";
import { renderPlainRating } from "@/lib/pdf/pdf-text";

const EXCURSION_THEME_RATINGS: Record<
  string,
  { scenic: number; wildlife: number; history: number }
> = {
  "Fjord cruising": { scenic: 5, wildlife: 2, history: 2 },
  "UNESCO fjord sightseeing": { scenic: 5, wildlife: 2, history: 2 },
  "Waterfall viewpoints": { scenic: 5, wildlife: 2, history: 2 },
  "Fjord viewpoints": { scenic: 5, wildlife: 2, history: 2 },
  "Glacier touring": { scenic: 5, wildlife: 2, history: 2 },
  "Wildlife safari": { scenic: 4, wildlife: 5, history: 2 },
  "Scenic coastal drives": { scenic: 5, wildlife: 2, history: 3 },
  "City walking tours": { scenic: 3, wildlife: 1, history: 5 },
  "Historic city walks": { scenic: 3, wildlife: 1, history: 5 },
  "Cultural experiences": { scenic: 3, wildlife: 1, history: 5 },
};

function inferThemeScoresFromExcursionType(excursionType: string): {
  scenic: number;
  wildlife: number;
  history: number;
} {
  if (EXCURSION_THEME_RATINGS[excursionType]) {
    return EXCURSION_THEME_RATINGS[excursionType];
  }

  const normalized = excursionType.toLowerCase();

  if (/wildlife|safari|arctic|northern lights/.test(normalized)) {
    return { scenic: 4, wildlife: 5, history: 2 };
  }
  if (/walk|heritage|history|city|viking|culture/.test(normalized)) {
    return { scenic: 3, wildlife: 1, history: 5 };
  }
  if (/drive|coastal|scenic/.test(normalized)) {
    return { scenic: 5, wildlife: 2, history: 3 };
  }
  if (/waterfall|fjord|viewpoint|glacier/.test(normalized)) {
    return { scenic: 5, wildlife: 2, history: 2 };
  }

  return { scenic: 4, wildlife: 2, history: 3 };
}

export type PdfHeroImage = {
  data: string;
  format: "JPEG" | "PNG";
};

export type ReturnConfidenceDisplay = {
  stars: number;
  label: string;
  detail: string;
};

export type PortScheduleContext = {
  row: CruiseScheduleRow;
  hasAllAboard: boolean;
  portTimeLabel: string | null;
  fitSummary: {
    durationLabel: string;
    marginLabel: string;
    confidenceLabel: string;
    confidenceTier: FitConfidenceTier;
  } | null;
};

export function renderStarRating(
  filled: number,
  total = 5,
  _fonts?: PdfFontSupport,
): string {
  return renderPlainRating(filled, total);
}

export function formatSailingMonthYear(
  sailingMonth: string,
  sailingYear = "2026",
): string {
  const trimmed = sailingMonth.trim();
  if (!trimmed) return sailingYear;
  if (/^\d{4}$/.test(trimmed)) return trimmed;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)} / ${sailingYear}`;
}

export function calculateDaysUntilSailing(sailingDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(sailingDate.trim());
  if (!match) return null;

  const target = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getMatchScoreStars(score: number): number {
  if (score >= 90) return 5;
  if (score >= 80) return 4;
  if (score >= 70) return 3;
  if (score >= 60) return 2;
  return 1;
}

export function getReturnConfidenceDisplay(
  confidence: ReturnConfidence,
): ReturnConfidenceDisplay {
  switch (confidence) {
    case "green":
      return {
        stars: 5,
        label: "Very High",
        detail:
          "Recommended excursions have comfortable timing based on the available port schedule.",
      };
    case "amber":
      return {
        stars: 3,
        label: "Moderate",
        detail:
          "Timing confidence is based on estimated excursion duration. Always confirm all aboard times with your cruise line.",
      };
    case "red":
      return {
        stars: 2,
        label: "Check Carefully",
        detail:
          "This port day is tight for longer tours. Confirm all aboard times with your cruise line before booking.",
      };
  }
}

export function getOverallReturnConfidenceDisplay(input: {
  greenCount: number;
  amberCount: number;
  redCount: number;
  scheduleRowsWithAllAboard: number;
  scheduleRowsTotal: number;
}): ReturnConfidenceDisplay {
  const { greenCount, amberCount, redCount, scheduleRowsWithAllAboard, scheduleRowsTotal } =
    input;

  const hasFullSchedule =
    scheduleRowsTotal > 0 && scheduleRowsWithAllAboard === scheduleRowsTotal;
  const hasPartialSchedule =
    scheduleRowsTotal > 0 && scheduleRowsWithAllAboard < scheduleRowsTotal;

  if (redCount > 0) {
    return {
      stars: 2,
      label: "Check Carefully",
      detail:
        "Some port days need tighter timing. Always confirm all aboard times with your cruise line.",
    };
  }

  if (amberCount > 0 || hasPartialSchedule) {
    return {
      stars: 3,
      label: "Moderate",
      detail:
        "Timing confidence is based on estimated excursion duration. Always confirm all aboard times with your cruise line.",
    };
  }

  if (greenCount > 0 && hasFullSchedule) {
    return {
      stars: 5,
      label: "Very High",
      detail:
        "Recommended excursions have comfortable timing based on the available port schedule.",
    };
  }

  if (greenCount > 0) {
    return {
      stars: 4,
      label: "High",
      detail:
        "Recommended excursions fit typical port windows. Confirm all aboard times with your cruise line.",
    };
  }

  return {
    stars: 3,
    label: "Moderate",
    detail:
      "Timing confidence is based on estimated excursion duration. Always confirm all aboard times with your cruise line.",
  };
}

export function findPortScheduleForPdf(
  portSlug: string,
  shipName: string,
  sailingMonth: string,
  sailingYear = "2026",
): CruiseScheduleRow | undefined {
  const prefix = buildScheduleMonthPrefix(sailingYear, sailingMonth);
  const shipKey = shipName.trim().toLowerCase();

  return getSchedulesByPort(portSlug).find(
    (row) =>
      row.arrival_date.startsWith(prefix) &&
      row.ship.trim().toLowerCase() === shipKey,
  );
}

export function findPrimaryCruiseScheduleForPdf(input: {
  portSlugs: readonly string[];
  shipName: string;
  sailingMonth: string;
  sailingYear?: string;
  sailingDate?: string;
}): CruiseScheduleRow | undefined {
  const { portSlugs, shipName, sailingMonth, sailingYear = "2026", sailingDate } =
    input;

  if (sailingDate) {
    for (const portSlug of portSlugs) {
      const match = getScheduleForShip(portSlug, shipName, sailingDate);
      if (match) return match;
    }
  }

  for (const portSlug of portSlugs) {
    const match = findPortScheduleForPdf(
      portSlug,
      shipName,
      sailingMonth,
      sailingYear,
    );
    if (match) return match;
  }

  return undefined;
}

export function formatPortTimeFromSchedule(row: CruiseScheduleRow): string | null {
  if (!row.arrival_time || !row.departure_time) return null;
  const minutes = getAvailablePortMinutes(row.arrival_time, row.departure_time);
  if (minutes === null) return null;
  return formatPortTimeHours(minutes / 60);
}

function formatPortTimeHours(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  if (rounded === 1) return "1 Hour";
  if (Number.isInteger(rounded)) return `${rounded} Hours`;
  return `${rounded} Hours`;
}

export type CruiseFitSummary = {
  portTimeLabel: string;
  excursionDurationLabel: string;
  returnMarginLabel: string;
  returnMarginHours: number;
  confidenceStars: number;
  confidenceLabel: string;
};

function getReturnMarginConfidence(returnMarginHours: number): {
  stars: number;
  label: string;
} {
  if (returnMarginHours < 0) {
    return { stars: 1, label: "Not Recommended" };
  }
  if (returnMarginHours < 1) {
    return { stars: 2, label: "Tight" };
  }
  if (returnMarginHours < 2) {
    return { stars: 3, label: "Moderate" };
  }
  if (returnMarginHours <= 3) {
    return { stars: 4, label: "High" };
  }
  return { stars: 5, label: "Very High" };
}

export function buildCruiseFitSummary(
  portSlug: string,
  recommendedTour: string,
  scheduleRow: CruiseScheduleRow | undefined,
): CruiseFitSummary | null {
  if (!scheduleRow?.arrival_time || !scheduleRow.departure_time) return null;

  const portMinutes = getAvailablePortMinutes(
    scheduleRow.arrival_time,
    scheduleRow.departure_time,
  );
  if (portMinutes === null) return null;

  const excursionMinutes = estimateExcursionDurationMinutes(
    portSlug,
    recommendedTour,
  );
  const returnMarginMinutes = portMinutes - excursionMinutes;
  const returnMarginHours = returnMarginMinutes / 60;
  const confidence = getReturnMarginConfidence(returnMarginHours);

  return {
    portTimeLabel: formatPortTimeHours(portMinutes / 60),
    excursionDurationLabel: estimateExcursionDurationLabel(portSlug, recommendedTour),
    returnMarginLabel: formatReturnMarginHours(returnMarginHours),
    returnMarginHours,
    confidenceStars: confidence.stars,
    confidenceLabel: confidence.label,
  };
}

function formatReturnMarginHours(hours: number): string {
  if (hours < 0) {
    const abs = Math.abs(hours);
    const rounded = Math.round(abs * 10) / 10;
    return `Short by ${rounded} Hour${rounded === 1 ? "" : "s"}`;
  }
  const rounded = Math.round(hours * 10) / 10;
  if (rounded === 1) return "1 Hour";
  return `${rounded} Hours`;
}

export function buildExcursionFitExplanation(
  rec: PortRecommendation,
  fitSummary: CruiseFitSummary | null,
): string {
  if (fitSummary && fitSummary.returnMarginHours >= 1) {
    return `With a ${fitSummary.portTimeLabel.toLowerCase()} port call, this ${fitSummary.excursionDurationLabel} excursion leaves a comfortable return margin and aligns strongly with your interest in ${rec.excursionType.toLowerCase()}.`;
  }

  if (fitSummary && fitSummary.returnMarginHours >= 0) {
    return `This ${fitSummary.excursionDurationLabel} excursion fits within your ${fitSummary.portTimeLabel.toLowerCase()} port window, but timing is tighter. Confirm departure and all aboard times with your cruise line.`;
  }

  return rec.why;
}

function parseDurationHours(text: string): number {
  const hourMatch = /(\d+(?:\.\d+)?)\s*(?:to\s*(\d+(?:\.\d+)?))?\s*hours?/i.exec(
    text,
  );
  if (hourMatch) {
    const upper = hourMatch[2] ? Number(hourMatch[2]) : Number(hourMatch[1]);
    return upper;
  }

  const shortHourMatch = /(\d+)\s*hrs?/i.exec(text);
  if (shortHourMatch) return Number(shortHourMatch[1]);

  return 3;
}

export function estimateExcursionDurationLabel(
  portSlug: string,
  recommendedTour: string,
): string {
  const port = portBySlug[portSlug];
  const source = port?.typicalTimeNeeded ?? port?.minimumPortTime ?? "3 hours";
  const hours = parseDurationHours(source);

  if (/walking|city|village/i.test(recommendedTour) && hours > 4) {
    return "3 hrs";
  }

  return hours === 1 ? "1 hr" : `${Math.round(hours)} hrs`;
}

export function estimateExcursionDurationMinutes(
  portSlug: string,
  recommendedTour: string,
): number {
  const label = estimateExcursionDurationLabel(portSlug, recommendedTour);
  const hours = parseDurationHours(label);
  return Math.round(hours * 60);
}

export function getThemeRatings(
  excursionType: string,
  portSlug?: string,
): {
  scenic: string;
  wildlife: string;
  history: string;
} {
  let scores = { ...inferThemeScoresFromExcursionType(excursionType) };

  if (portSlug && scores.scenic === 4 && scores.wildlife === 2 && scores.history === 3) {
    const port = portBySlug[portSlug];
    const themes = new Set(port?.themes ?? []);
    if (themes.has("history") || themes.has("viking")) {
      scores.history = 5;
      scores.scenic = 3;
      scores.wildlife = 1;
    }
  }

  return {
    scenic: renderPlainRating(scores.scenic, 5),
    wildlife: renderPlainRating(scores.wildlife, 5),
    history: renderPlainRating(scores.history, 5),
  };
}

export function formatThemeRatingsLine(excursionType: string, portSlug?: string): string {
  const ratings = getThemeRatings(excursionType, portSlug);
  return `Scenic: ${ratings.scenic} · Wildlife: ${ratings.wildlife} · History: ${ratings.history}`;
}

export function formatFitnessLabel(fitnessLevel: FitnessLevel): string {
  return fitnessLevel;
}

export function buildPortScheduleContext(
  portSlug: string,
  recommendedTour: string,
  scheduleRow: CruiseScheduleRow | undefined,
): PortScheduleContext | null {
  if (!scheduleRow) return null;

  const hasAllAboard = Boolean(scheduleRow.all_aboard_time);
  let portTimeLabel: string | null = null;
  let fitSummary: PortScheduleContext["fitSummary"] = null;

  if (hasAllAboard && scheduleRow.all_aboard_time && scheduleRow.arrival_time) {
    const durationMinutes = estimateExcursionDurationMinutes(portSlug, recommendedTour);
    const fit = calculateExcursionFit({
      arrivalTime: scheduleRow.arrival_time,
      allAboardTime: scheduleRow.all_aboard_time,
      excursionDurationMinutes: durationMinutes,
      checkInBufferMinutes: 15,
      safetyBufferMinutes: 60,
    });

    if (fit) {
      portTimeLabel = formatMinutes(fit.availablePortMinutes);
      fitSummary = {
        durationLabel: estimateExcursionDurationLabel(portSlug, recommendedTour),
        marginLabel: formatReturnMargin(fit.remainingMinutes),
        confidenceLabel: simplifyFitLabel(fit.confidence.label),
        confidenceTier: fit.confidence.tier,
      };
    }
  }

  return {
    row: scheduleRow,
    hasAllAboard,
    portTimeLabel,
    fitSummary,
  };
}

function simplifyFitLabel(label: string): string {
  return label
    .replace(" Confidence", "")
    .replace(" Schedule", "")
    .trim();
}

export async function loadPdfHeroImage(
  url: string,
): Promise<PdfHeroImage | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }

    const base64 =
      typeof btoa === "function"
        ? btoa(binary)
        : Buffer.from(buffer).toString("base64");

    const format: PdfHeroImage["format"] = contentType.includes("png")
      ? "PNG"
      : "JPEG";

    return {
      data: `data:image/${format.toLowerCase()};base64,${base64}`,
      format,
    };
  } catch {
    return null;
  }
}

export function collectScheduleStats(
  portSlugs: readonly string[],
  shipName: string,
  sailingMonth: string,
  sailingYear = "2026",
): { total: number; withAllAboard: number } {
  let total = 0;
  let withAllAboard = 0;

  for (const portSlug of portSlugs) {
    const row = findPortScheduleForPdf(portSlug, shipName, sailingMonth, sailingYear);
    if (!row) continue;
    total += 1;
    if (row.all_aboard_time) withAllAboard += 1;
  }

  return { total, withAllAboard };
}
