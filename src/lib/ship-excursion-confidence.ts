import {
  calculateExcursionFit,
  type FitConfidenceTier,
} from "@/lib/excursion-fit-calculator";
import type { CruiseScheduleRow } from "@/lib/cruiseSchedules";

const DEFAULT_EXCURSION_MINUTES = 240;
const DEFAULT_CHECK_IN_MINUTES = 15;
const DEFAULT_SAFETY_MINUTES = 45;

/** Typical independent tour length for confidence estimates when no specific tour is selected. */
export function estimatePortReturnConfidence(
  row: CruiseScheduleRow,
): FitConfidenceTier | null {
  if (!row.arrival_time || !row.all_aboard_time) return null;

  const fit = calculateExcursionFit({
    arrivalTime: row.arrival_time,
    allAboardTime: row.all_aboard_time,
    excursionDurationMinutes: DEFAULT_EXCURSION_MINUTES,
    checkInBufferMinutes: DEFAULT_CHECK_IN_MINUTES,
    safetyBufferMinutes: DEFAULT_SAFETY_MINUTES,
  });

  return fit?.confidence.tier ?? null;
}

export function getDefaultExcursionConfidenceForPort(): FitConfidenceTier {
  return "moderate";
}
