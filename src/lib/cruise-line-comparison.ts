import {
  cruiseLineBySlug,
  type CruiseLineData,
} from "@/lib/cruise-lines-data";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import { portBySlug } from "@/lib/ports-data";

export type CruiseLineComparisonRow = {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  bestFor: string;
  familyFriendly: string;
  premiumFeel: string;
  popularNorwayPorts: string;
  typicalCruiseLength: string;
};

/** Primary trio compared on hub and mainstream line pages. */
export const primaryNorwayComparisonSlugs = [
  "p-and-o-cruises-norway",
  "msc-cruises-norway",
  "princess-cruises-norway",
] as const;

/** Premium and in depth lines shown on extended comparison views. */
export const extendedNorwayComparisonSlugs = [
  ...primaryNorwayComparisonSlugs,
  "cunard-norway",
  "holland-america-norway",
  "celebrity-cruises-norway",
] as const;

export const comparisonFeatureRows = [
  { key: "bestFor" as const, label: "Best For" },
  { key: "familyFriendly" as const, label: "Family Friendly" },
  { key: "premiumFeel" as const, label: "Premium Feel" },
  { key: "popularNorwayPorts" as const, label: "Popular Norway Ports" },
  { key: "typicalCruiseLength" as const, label: "Typical Cruise Length" },
] as const;

function popularPortsLabel(line: CruiseLineData): string {
  const stats = getCruiseLineScheduleSummary(line.scheduleKey);
  if (stats.ports.length > 0) {
    return stats.ports
      .slice(0, 4)
      .map((p) => p.portDisplayName)
      .join(", ");
  }
  return line.recommendedPortSlugs
    .slice(0, 4)
    .map((slug) => portBySlug[slug].displayName)
    .join(", ");
}

export function buildCruiseLineComparisonRow(
  slug: string,
): CruiseLineComparisonRow | undefined {
  const line = cruiseLineBySlug[slug];
  if (!line) return undefined;

  return {
    slug: line.slug,
    name: line.name,
    shortName: line.shortName,
    headline: line.headline,
    bestFor: line.passengerSnapshot.bestFor,
    familyFriendly: line.passengerSnapshot.familyFriendly,
    premiumFeel: line.passengerSnapshot.luxuryLevel,
    popularNorwayPorts: popularPortsLabel(line),
    typicalCruiseLength: line.passengerSnapshot.typicalCruiseLength,
  };
}

export function getCruiseLineComparisonRows(
  slugs: readonly string[],
): CruiseLineComparisonRow[] {
  return slugs
    .map((slug) => buildCruiseLineComparisonRow(slug))
    .filter((row): row is CruiseLineComparisonRow => row != null);
}

/** Slugs to show on a given cruise line detail page. */
export function comparisonSlugsForLinePage(currentSlug: string): readonly string[] {
  if (
    (extendedNorwayComparisonSlugs as readonly string[]).includes(currentSlug)
  ) {
    return extendedNorwayComparisonSlugs;
  }
  if (
    (primaryNorwayComparisonSlugs as readonly string[]).includes(currentSlug)
  ) {
    return primaryNorwayComparisonSlugs;
  }
  return primaryNorwayComparisonSlugs;
}
