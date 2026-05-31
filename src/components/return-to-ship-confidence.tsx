import Link from "next/link";

import type { FitConfidenceTier } from "@/lib/excursion-fit-calculator";

export type ReturnToShipConfidenceLevel =
  | "very-high"
  | "high"
  | "moderate"
  | "tight"
  | "not-recommended";

export type ReturnToShipConfidenceProps = {
  level: ReturnToShipConfidenceLevel;
  /** Short label override, e.g. for compact cards */
  compact?: boolean;
  showLink?: boolean;
  className?: string;
};

const levelConfig: Record<
  ReturnToShipConfidenceLevel,
  { label: string; shortLabel: string; className: string }
> = {
  "very-high": {
    label: "Very High",
    shortLabel: "Very High",
    className: "bg-emerald-100 text-emerald-900 border-emerald-200",
  },
  high: {
    label: "High",
    shortLabel: "High",
    className: "bg-emerald-50 text-emerald-800 border-emerald-100",
  },
  moderate: {
    label: "Moderate",
    shortLabel: "Moderate",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  tight: {
    label: "Tight",
    shortLabel: "Tight",
    className: "bg-orange-50 text-orange-900 border-orange-200",
  },
  "not-recommended": {
    label: "Not Recommended",
    shortLabel: "Not Recommended",
    className: "bg-red-50 text-red-900 border-red-200",
  },
};

export function fitTierToReturnLevel(
  tier: FitConfidenceTier,
): ReturnToShipConfidenceLevel {
  return tier;
}

export function plannerConfidenceToReturnLevel(
  confidence: "green" | "amber" | "red",
): ReturnToShipConfidenceLevel {
  switch (confidence) {
    case "green":
      return "high";
    case "amber":
      return "moderate";
    case "red":
      return "tight";
  }
}

export function ReturnToShipConfidence({
  level,
  compact = false,
  showLink = false,
  className = "",
}: ReturnToShipConfidenceProps) {
  const config = levelConfig[level];
  const text = compact ? config.shortLabel : config.label;

  return (
    <span
      className={`inline-flex flex-wrap items-center gap-2 ${className}`.trim()}
    >
      <span
        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
      >
        Return to Ship Confidence: {text}
      </span>
      {showLink ? (
        <Link
          href="/return-to-ship-confidence"
          className="text-xs font-semibold text-[var(--glacier-blue)]"
        >
          How we calculate this
        </Link>
      ) : null}
    </span>
  );
}
