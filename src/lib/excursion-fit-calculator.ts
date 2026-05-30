export type ExcursionFitInput = {
  arrivalTime: string;
  allAboardTime: string;
  excursionDurationMinutes: number;
  checkInBufferMinutes: number;
  safetyBufferMinutes: number;
};

export type FitConfidenceTier =
  | "very-high"
  | "high"
  | "moderate"
  | "tight"
  | "not-recommended";

export type ExcursionFitResult = {
  availablePortMinutes: number;
  requiredMinutes: number;
  remainingMinutes: number;
  excursionDurationMinutes: number;
  checkInBufferMinutes: number;
  safetyBufferMinutes: number;
  confidence: {
    tier: FitConfidenceTier;
    label: string;
    emoji: string;
  };
};

export function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

export function formatMinutes(totalMinutes: number): string {
  const rounded = Math.round(Math.abs(totalMinutes));
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;

  if (hours === 0) return `${minutes} mins`;
  if (minutes === 0) return `${hours} hr${hours === 1 ? "" : "s"}`;
  return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} mins`;
}

export function getAvailablePortMinutes(
  arrivalTime: string,
  allAboardTime: string,
): number | null {
  const arrival = parseTimeToMinutes(arrivalTime);
  const allAboard = parseTimeToMinutes(allAboardTime);

  if (arrival === null || allAboard === null) return null;
  if (arrival === allAboard) return 0;

  let end = allAboard;
  if (end <= arrival) {
    end += 24 * 60;
  }

  return end - arrival;
}

export function getFitConfidence(remainingMinutes: number): ExcursionFitResult["confidence"] {
  if (remainingMinutes > 180) {
    return { tier: "very-high", label: "Very High Confidence", emoji: "🟢" };
  }
  if (remainingMinutes >= 120) {
    return { tier: "high", label: "High Confidence", emoji: "🟢" };
  }
  if (remainingMinutes >= 60) {
    return { tier: "moderate", label: "Moderate Confidence", emoji: "🟡" };
  }
  if (remainingMinutes >= 0) {
    return { tier: "tight", label: "Tight Schedule", emoji: "🟠" };
  }
  return { tier: "not-recommended", label: "Not Recommended", emoji: "🔴" };
}

export function calculateExcursionFit(
  input: ExcursionFitInput,
): ExcursionFitResult | null {
  const availablePortMinutes = getAvailablePortMinutes(
    input.arrivalTime,
    input.allAboardTime,
  );

  if (availablePortMinutes === null) return null;
  if (input.excursionDurationMinutes < 0) return null;
  if (input.checkInBufferMinutes < 0 || input.safetyBufferMinutes < 0) return null;

  const requiredMinutes =
    input.excursionDurationMinutes +
    input.checkInBufferMinutes +
    input.safetyBufferMinutes;
  const remainingMinutes = availablePortMinutes - requiredMinutes;

  return {
    availablePortMinutes,
    requiredMinutes,
    remainingMinutes,
    excursionDurationMinutes: input.excursionDurationMinutes,
    checkInBufferMinutes: input.checkInBufferMinutes,
    safetyBufferMinutes: input.safetyBufferMinutes,
    confidence: getFitConfidence(remainingMinutes),
  };
}

export function formatReturnMargin(remainingMinutes: number): string {
  if (remainingMinutes < 0) {
    return `Short by ${formatMinutes(Math.abs(remainingMinutes))}`;
  }
  return `${formatMinutes(remainingMinutes)} remaining`;
}

export function getFitConfidenceClass(tier: FitConfidenceTier): string {
  switch (tier) {
    case "very-high":
    case "high":
      return "confidence-green";
    case "moderate":
      return "confidence-amber";
    case "tight":
      return "confidence-tight";
    case "not-recommended":
      return "confidence-red";
  }
}
