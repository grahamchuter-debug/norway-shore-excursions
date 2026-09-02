import { schedulePortRegions } from "@/lib/cruise-schedule-config";
import type { ShipScheduleSummary } from "@/lib/ship-schedules";
import {
  buildShipScheduleSummaries,
  getShipScheduleSummaryBySlug,
} from "@/lib/ship-schedules";
import type { ShipScheduleInsights } from "@/lib/schedule-insights";

/** Top ships by combined 2026–2027 Norway port calls receive enhanced authority pages. */
export const AUTHORITY_SHIP_LIMIT = 20;

let cachedAuthoritySlugs: readonly string[] | undefined;

export function getAuthorityShipSlugs(): readonly string[] {
  if (cachedAuthoritySlugs) return cachedAuthoritySlugs;
  cachedAuthoritySlugs = buildShipScheduleSummaries()
    .slice(0, AUTHORITY_SHIP_LIMIT)
    .map((s) => s.slug);
  return cachedAuthoritySlugs;
}

export function isAuthorityShip(slug: string): boolean {
  return getAuthorityShipSlugs().includes(slug);
}

export type ShipItineraryPattern = {
  label: string;
  count: number;
  description: string;
};

function regionForPort(portSlug: string): string | undefined {
  for (const region of schedulePortRegions) {
    if ((region.portSlugs as readonly string[]).includes(portSlug)) {
      return region.label;
    }
  }
  return undefined;
}

function capacityTierLabel(capacity: number | null): string {
  if (capacity == null) return "Norway regular";
  if (capacity >= 4500) return "mega-ship";
  if (capacity >= 3000) return "large resort-style vessel";
  if (capacity >= 2000) return "mainstream cruise ship";
  if (capacity >= 1200) return "mid-size cruise ship";
  return "small-ship or expedition-style vessel";
}

function monthSeason(monthKey: string): "peak summer" | "shoulder season" | "off-season" {
  const month = Number(monthKey.slice(5, 7));
  if (month >= 6 && month <= 8) return "peak summer";
  if (month >= 4 && month <= 5) return "shoulder season";
  if (month >= 9 && month <= 10) return "shoulder season";
  return "off-season";
}

export function detectRegionFocus(summary: ShipScheduleSummary): string[] {
  const regionCounts = new Map<string, number>();
  for (const port of summary.ports) {
    const region = regionForPort(port.portSlug);
    if (!region) continue;
    regionCounts.set(region, (regionCounts.get(region) ?? 0) + port.callCount);
  }
  return [...regionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([label]) => label);
}

function groupRowsIntoVoyages(summary: ShipScheduleSummary): string[][] {
  const voyages: string[][] = [];
  let current: string[] = [];
  let lastDate = "";

  for (const row of summary.rows) {
    if (lastDate) {
      const gapDays =
        (new Date(`${row.arrival_date}T12:00:00`).getTime() -
          new Date(`${lastDate}T12:00:00`).getTime()) /
        86_400_000;
      if (gapDays > 4) {
        if (current.length > 0) voyages.push(current);
        current = [];
      }
    }
    current.push(row.port);
    lastDate = row.arrival_date;
  }
  if (current.length > 0) voyages.push(current);
  return voyages;
}

export function detectItineraryPatterns(
  summary: ShipScheduleSummary,
): ShipItineraryPattern[] {
  const voyages = groupRowsIntoVoyages(summary);
  const chainCounts = new Map<string, { ports: string[]; count: number }>();

  for (const voyage of voyages) {
    const uniquePorts = [...new Set(voyage)];
    if (uniquePorts.length < 2) continue;

    for (let len = 2; len <= Math.min(3, uniquePorts.length); len++) {
      for (let i = 0; i <= uniquePorts.length - len; i++) {
        const slice = uniquePorts.slice(i, i + len);
        const key = slice.join("→");
        const existing = chainCounts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          chainCounts.set(key, { ports: slice, count: 1 });
        }
      }
    }
  }

  const portName = (slug: string) =>
    summary.ports.find((p) => p.portSlug === slug)?.portDisplayName ?? slug;

  const patterns = [...chainCounts.values()]
    .sort((a, b) => b.count - a.count || b.ports.length - a.ports.length)
    .slice(0, 4)
    .map(({ ports, count }) => {
      const label = ports.map(portName).join(" → ");
      return {
        label,
        count,
        description: `${label} appears on ${count} ${count === 1 ? "sailing" : "sailings"} in our ${summary.visitsByYear.map((v) => v.year).join("–")} Norway data.`,
      };
    });

  if (patterns.length === 0 && summary.topPorts.length >= 2) {
    const [a, b] = summary.topPorts;
    patterns.push({
      label: `${a.portDisplayName} & ${b.portDisplayName}`,
      count: Math.min(a.callCount, b.callCount),
      description: `${summary.ship} alternates between ${a.portDisplayName} (${a.callCount} calls) and ${b.portDisplayName} (${b.callCount} calls) rather than repeating one fixed loop every week.`,
    });
  }

  return patterns;
}

export function buildShipOverviewNarrative(
  summary: ShipScheduleSummary,
  insights: ShipScheduleInsights,
): string {
  const parts: string[] = [];
  const tier = capacityTierLabel(summary.capacity);
  const years =
    insights.yearsAvailable.length > 0
      ? insights.yearsAvailable.join(" and ")
      : "2026 and 2027";

  parts.push(
    `${summary.ship} on ${summary.cruiseLine} ranks among Norway's busiest cruise ships in our verified database: a ${tier} with ${summary.callCount} published port calls across ${years}.`,
  );

  const [top, second, third] = summary.topPorts;
  if (top && second) {
    const topShare = Math.round((top.callCount / summary.callCount) * 100);
    parts.push(
      `The programme leans heavily on ${top.portDisplayName} (${top.callCount} calls, ${topShare}% of visits) and ${second.portDisplayName} (${second.callCount})${third ? `, with ${third.portDisplayName} (${third.callCount}) rounding out the core rotation` : ""}.`,
    );
  }

  const regions = detectRegionFocus(summary);
  if (regions.length > 0) {
    parts.push(
      `Geographically, ${summary.ship} concentrates on ${regions.join(" and ")}, across ${summary.portCount} distinct Norwegian ports in total.`,
    );
  }

  const peak = insights.peakMonths[0];
  if (peak) {
    const season = monthSeason(peak.monthKey);
    parts.push(
      `Busiest month: ${peak.monthLabel} (${peak.shipCalls} calls), typical of ${season} Norway cruising for this class of ship.`,
    );
  }

  const y2026 = insights.callsByYear["2026"] ?? 0;
  const y2027 = insights.callsByYear["2027"] ?? 0;
  if (y2026 > 0 && y2027 > 0) {
    if (y2026 > y2027 * 1.5) {
      parts.push(
        `2026 carries the heavier published programme (${y2026} calls vs ${y2027} in 2027), which helps when comparing early planning windows.`,
      );
    } else if (y2027 > y2026 * 1.5) {
      parts.push(
        `2027 shows stronger coverage (${y2027} calls vs ${y2026} in 2026) as more timetables are confirmed.`,
      );
    } else {
      parts.push(
        `Activity is spread across both years (${y2026} calls in 2026, ${y2027} in 2027).`,
      );
    }
  }

  return parts.join(" ");
}

export function buildShipAuthorityFaqs(
  summary: ShipScheduleSummary,
  insights: ShipScheduleInsights,
): readonly { question: string; answer: string }[] {
  const years =
    insights.yearsAvailable.length > 0
      ? insights.yearsAvailable.join(" and ")
      : "2026 and 2027";
  const topPortsLabel = summary.topPorts
    .slice(0, 3)
    .map((p) => `${p.portDisplayName} (${p.callCount})`)
    .join(", ");
  const peak = insights.peakMonths[0];
  const y2026 = insights.callsByYear["2026"] ?? 0;
  const y2027 = insights.callsByYear["2027"] ?? 0;

  return [
    {
      question: `How many Norway port calls does ${summary.ship} have?`,
      answer: `${summary.ship} has ${summary.callCount} verified Norway port calls in our ${years} schedule data${y2026 && y2027 ? ` (${y2026} in 2026 and ${y2027} in 2027)` : ""}. Always confirm timings with ${summary.cruiseLine} before finalising excursion plans.`,
    },
    {
      question: `Which ports does ${summary.ship} visit most in Norway?`,
      answer: `Top ports in our data: ${topPortsLabel}. See the ports section below for call counts and links to port guides and excursions.`,
    },
    {
      question: `When is ${summary.ship} busiest in Norway?`,
      answer: peak
        ? `${peak.monthLabel} is the busiest month with ${peak.shipCalls} scheduled calls. Use the monthly breakdown below to spot quieter weeks.`
        : `Check the schedule insights section for monthly call patterns across ${years}.`,
    },
    {
      question: `What is ${summary.ship}'s passenger capacity?`,
      answer:
        summary.capacity != null
          ? `${summary.ship} carries approximately ${summary.capacity.toLocaleString("en-GB")} passengers at full capacity. Larger ships mean longer tender queues and fuller coaches on peak summer days, so favour independent tours with clear return times.`
          : `Passenger capacity for ${summary.ship} is not published in our lookup. Check ${summary.cruiseLine} for official figures before estimating onboard demand at each port.`,
    },
    {
      question: "Where does this schedule data come from?",
      answer:
        "Port calls are imported from published Norway cruise timetables for verified ports. We do not estimate or invent visit counts. Confirm arrival, departure and all-aboard times with your cruise line.",
    },
  ];
}

export function getAuthorityShipSummaries(): ShipScheduleSummary[] {
  const slugs = new Set(getAuthorityShipSlugs());
  return buildShipScheduleSummaries().filter((s) => slugs.has(s.slug));
}

export function getAuthorityShipRank(slug: string): number | null {
  const index = getAuthorityShipSlugs().indexOf(slug);
  return index >= 0 ? index + 1 : null;
}

export function getAuthorityShipSummaryBySlug(
  slug: string,
): ShipScheduleSummary | undefined {
  if (!isAuthorityShip(slug)) return undefined;
  return getShipScheduleSummaryBySlug(slug);
}
