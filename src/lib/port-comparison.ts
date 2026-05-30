import { portBySlug, ports } from "@/lib/ports-data";

export type PortComparisonRow = {
  slug: string;
  port: string;
  bestFor: string;
  topExcursion: string;
  timeNeeded: string;
  activityLevel: string;
  localSiteUrl: string;
};

export const portComparisonRows: readonly PortComparisonRow[] = ports.map(
  (p) => ({
    slug: p.slug,
    port: p.displayName,
    bestFor: p.bestFor.split(".")[0] ?? p.bestFor,
    topExcursion: p.heroTour,
    timeNeeded: p.minimumPortTime,
    activityLevel:
      p.difficulty === "easy"
        ? "Easy"
        : p.difficulty === "moderate"
          ? "Moderate"
          : "Active",
    localSiteUrl: p.localSiteUrl,
  }),
);

export const featuredComparisonSlugs = [
  "flam",
  "olden",
  "geiranger",
  "stavanger",
  "tromso",
  "bergen",
  "eidfjord",
  "honningsvag",
  "skjolden",
] as const;

export function getComparisonRow(slug: string): PortComparisonRow | undefined {
  return portComparisonRows.find((r) => r.slug === slug);
}

export function formatComparisonSummary(slug: string): string {
  const row = portBySlug[slug];
  if (!row) return "";
  const level =
    row.difficulty === "easy"
      ? "Easy"
      : row.difficulty === "moderate"
        ? "Moderate"
        : "Active";
  return `${row.displayName}, ${row.bestFor.split(".")[0]}, ${row.heroTour}, ${row.minimumPortTime}, ${level}`;
}
