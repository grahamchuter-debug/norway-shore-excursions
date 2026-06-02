export type PortVisitFrequency = "frequent" | "occasional" | "seasonal";

export type PortVisitFrequencyBadge = {
  frequency: PortVisitFrequency;
  label: "Frequently Visited" | "Occasionally Visited" | "Seasonal";
};

const badgeLabels: Record<PortVisitFrequency, PortVisitFrequencyBadge["label"]> = {
  frequent: "Frequently Visited",
  occasional: "Occasionally Visited",
  seasonal: "Seasonal",
};

/**
 * Classify how often a cruise line calls a Norway port from schedule call counts.
 * Thresholds are relative to that line's busiest port in the dataset.
 */
export function classifyPortVisitFrequency(
  callCount: number,
  maxCallsForLine: number,
): PortVisitFrequency | null {
  if (callCount <= 0) return null;
  if (maxCallsForLine <= 0) {
    if (callCount >= 5) return "frequent";
    if (callCount >= 2) return "occasional";
    return "seasonal";
  }

  const ratio = callCount / maxCallsForLine;
  if (callCount >= 5 || ratio >= 0.45) return "frequent";
  if (callCount >= 2 || ratio >= 0.12) return "occasional";
  return "seasonal";
}

export function portVisitFrequencyBadge(
  callCount: number,
  maxCallsForLine: number,
): PortVisitFrequencyBadge | null {
  const frequency = classifyPortVisitFrequency(callCount, maxCallsForLine);
  if (!frequency) return null;
  return { frequency, label: badgeLabels[frequency] };
}
