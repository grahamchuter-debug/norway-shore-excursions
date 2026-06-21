import {
  getAllScheduleRows,
  hasRealScheduleData,
  normalizeShipSearchKey,
  type CruiseScheduleRow,
} from "@/lib/cruiseSchedules";
import {
  matchCruiseLineScheduleKey,
  type CruiseLineScheduleKey,
} from "@/lib/cruise-line-schedules";
import { cruiseLineBySlug, cruiseLinePagePath } from "@/lib/cruise-lines-data";
import { portBySlug } from "@/lib/ports-data";
import { shipNameToSlug, shipPagePath } from "@/lib/ship-schedules";

/** Minimum Norway port calls to treat a cruise line as "regular" in hub pages. */
export const REGULAR_CRUISE_LINE_MIN_CALLS = 10;

/** Minimum calls to generate a dedicated ship page (matches ship-schedules builder). */
export const MIN_SHIP_PAGE_CALLS = 1;

export type RankedCount = {
  label: string;
  count: number;
  slug?: string;
  href?: string;
};

export type MonthlyCallStats = {
  monthKey: string;
  monthLabel: string;
  shipCalls: number;
};

export type PortScheduleInsights = {
  portSlug: string;
  portDisplayName: string;
  totalCalls: number;
  busiestMonths: readonly MonthlyCallStats[];
  topCruiseLines: readonly RankedCount[];
  topShips: readonly RankedCount[];
  yearsAvailable: readonly string[];
  callsByYear: Readonly<Record<string, number>>;
};

export type CalendarDayStats = {
  date: string;
  dateLabel: string;
  shipCalls: number;
  ports: readonly string[];
};

export type GlobalScheduleInsights = {
  totalCalls: number;
  portCount: number;
  yearsAvailable: readonly string[];
  monthlyTotals: readonly MonthlyCallStats[];
  peakMonths: readonly MonthlyCallStats[];
  busiestDays: readonly CalendarDayStats[];
  topCruiseLines: readonly RankedCount[];
  topPorts: readonly RankedCount[];
  topShips: readonly RankedCount[];
};

export type ShipScheduleInsights = {
  shipSlug: string;
  shipName: string;
  cruiseLine: string;
  totalCalls: number;
  portCount: number;
  busiestMonths: readonly MonthlyCallStats[];
  peakMonths: readonly MonthlyCallStats[];
  topPorts: readonly RankedCount[];
  yearsAvailable: readonly string[];
  callsByYear: Readonly<Record<string, number>>;
};

export function buildGlobalScheduleInsights(): GlobalScheduleInsights {
  const rows = getVerifiedScheduleRows();
  const portSlugs = new Set(rows.map((r) => r.port));

  return {
    totalCalls: rows.length,
    portCount: portSlugs.size,
    yearsAvailable: getScheduleYearsAvailable(),
    monthlyTotals: getMonthlyCallTotals(),
    peakMonths: getPeakMonths(5),
    busiestDays: getBusiestDays(12),
    topCruiseLines: getRegularCruiseLineRankings(),
    topPorts: getPortCallRankings().slice(0, 10),
    topShips: getShipActivityRankings(10),
  };
}

function rowsForPort(portSlug: string): CruiseScheduleRow[] {
  return getAllScheduleRows().filter(
    (row) => row.port === portSlug && hasRealScheduleData(row.port),
  );
}

function monthLabelFromKey(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(`${year}-${month}-01T12:00:00`);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function formatDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getVerifiedScheduleRows(): CruiseScheduleRow[] {
  return getAllScheduleRows().filter((row) => hasRealScheduleData(row.port));
}

export function getPortScheduleInsights(portSlug: string): PortScheduleInsights | null {
  const rows = rowsForPort(portSlug);
  if (rows.length === 0) return null;

  const portDisplayName = portBySlug[portSlug]?.displayName ?? portSlug;

  const monthCounts = new Map<string, number>();
  const lineCounts = new Map<string, number>();
  const shipCounts = new Map<string, { ship: string; count: number }>();
  const callsByYear: Record<string, number> = {};

  for (const row of rows) {
    const monthKey = row.arrival_date.slice(0, 7);
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);

    const year = row.arrival_date.slice(0, 4);
    callsByYear[year] = (callsByYear[year] ?? 0) + 1;

    lineCounts.set(row.cruise_line, (lineCounts.get(row.cruise_line) ?? 0) + 1);

    const shipKey = normalizeShipSearchKey(row.ship);
    const existing = shipCounts.get(shipKey);
    if (existing) {
      existing.count += 1;
    } else {
      shipCounts.set(shipKey, { ship: row.ship.trim(), count: 1 });
    }
  }

  const busiestMonths = [...monthCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, shipCalls]) => ({
      monthKey,
      monthLabel: monthLabelFromKey(monthKey),
      shipCalls,
    }));

  const topCruiseLines = [...lineCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([label, count]) => {
      const key = matchCruiseLineScheduleKey(label);
      const slug = key
        ? Object.values(cruiseLineBySlug).find((line) => line.scheduleKey === key)?.slug
        : undefined;
      return {
        label,
        count,
        slug,
        href: slug ? cruiseLinePagePath(slug) : undefined,
      };
    });

  const topShips = [...shipCounts.values()]
    .sort((a, b) => b.count - a.count || a.ship.localeCompare(b.ship))
    .slice(0, 8)
    .map(({ ship, count }) => ({
      label: ship,
      count,
      slug: shipNameToSlug(ship),
      href: shipPagePath(shipNameToSlug(ship)),
    }));

  return {
    portSlug,
    portDisplayName,
    totalCalls: rows.length,
    busiestMonths,
    topCruiseLines,
    topShips,
    yearsAvailable: Object.keys(callsByYear).sort(),
    callsByYear,
  };
}

export function getMonthlyCallTotals(year?: string): MonthlyCallStats[] {
  const totals = new Map<string, number>();

  for (const row of getVerifiedScheduleRows()) {
    if (year && !row.arrival_date.startsWith(`${year}-`)) continue;
    const monthKey = row.arrival_date.slice(0, 7);
    totals.set(monthKey, (totals.get(monthKey) ?? 0) + 1);
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, shipCalls]) => ({
      monthKey,
      monthLabel: monthLabelFromKey(monthKey),
      shipCalls,
    }));
}

export function getPeakMonths(limit = 5, year?: string): MonthlyCallStats[] {
  return [...getMonthlyCallTotals(year)]
    .sort((a, b) => b.shipCalls - a.shipCalls)
    .slice(0, limit);
}

export function getBusiestDays(limit = 10, year?: string): CalendarDayStats[] {
  const dayCounts = new Map<string, { count: number; ports: Set<string> }>();

  for (const row of getVerifiedScheduleRows()) {
    if (year && !row.arrival_date.startsWith(`${year}-`)) continue;
    const existing = dayCounts.get(row.arrival_date);
    if (existing) {
      existing.count += 1;
      existing.ports.add(row.port);
    } else {
      dayCounts.set(row.arrival_date, { count: 1, ports: new Set([row.port]) });
    }
  }

  return [...dayCounts.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([date, { count, ports }]) => ({
      date,
      dateLabel: formatDateLabel(date),
      shipCalls: count,
      ports: [...ports].map((p) => portBySlug[p]?.displayName ?? p),
    }));
}

export function getCruiseLineActivityRankings(): RankedCount[] {
  const counts = new Map<string, number>();

  for (const row of getVerifiedScheduleRows()) {
    counts.set(row.cruise_line, (counts.get(row.cruise_line) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => {
      const key = matchCruiseLineScheduleKey(label);
      const slug = key
        ? Object.values(cruiseLineBySlug).find((line) => line.scheduleKey === key)?.slug
        : undefined;
      return {
        label,
        count,
        slug,
        href: slug ? cruiseLinePagePath(slug) : undefined,
      };
    });
}

export function getRegularCruiseLineRankings(): RankedCount[] {
  return getCruiseLineActivityRankings().filter(
    (line) => line.count >= REGULAR_CRUISE_LINE_MIN_CALLS,
  );
}

export function getPortCallRankings(): RankedCount[] {
  const counts = new Map<string, number>();

  for (const row of getVerifiedScheduleRows()) {
    counts.set(row.port, (counts.get(row.port) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([portSlug, count]) => ({
      label: portBySlug[portSlug]?.displayName ?? portSlug,
      count,
      slug: portSlug,
      href: `/ship-schedules/${portSlug}`,
    }));
}

export function getShipActivityRankings(limit = 15): RankedCount[] {
  const counts = new Map<string, { ship: string; count: number }>();

  for (const row of getVerifiedScheduleRows()) {
    const key = normalizeShipSearchKey(row.ship);
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { ship: row.ship.trim(), count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.ship.localeCompare(b.ship))
    .slice(0, limit)
    .map(({ ship, count }) => ({
      label: ship,
      count,
      slug: shipNameToSlug(ship),
      href: shipPagePath(shipNameToSlug(ship)),
    }));
}

export function getScheduleYearsAvailable(): string[] {
  const years = new Set<string>();
  for (const row of getVerifiedScheduleRows()) {
    years.add(row.arrival_date.slice(0, 4));
  }
  return [...years].sort();
}

export function getShipScheduleInsights(
  shipSlug: string,
): ShipScheduleInsights | null {
  const rows = getVerifiedScheduleRows().filter(
    (row) => shipNameToSlug(row.ship) === shipSlug,
  );
  if (rows.length === 0) return null;

  const shipName = rows[0]?.ship.trim() ?? shipSlug;
  const cruiseLine = rows[0]?.cruise_line ?? "";
  const monthCounts = new Map<string, number>();
  const portCounts = new Map<string, number>();
  const callsByYear: Record<string, number> = {};

  for (const row of rows) {
    const monthKey = row.arrival_date.slice(0, 7);
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);

    const year = row.arrival_date.slice(0, 4);
    callsByYear[year] = (callsByYear[year] ?? 0) + 1;

    portCounts.set(row.port, (portCounts.get(row.port) ?? 0) + 1);
  }

  const busiestMonths = [...monthCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, shipCalls]) => ({
      monthKey,
      monthLabel: monthLabelFromKey(monthKey),
      shipCalls,
    }));

  const peakMonths = [...busiestMonths]
    .sort((a, b) => b.shipCalls - a.shipCalls)
    .slice(0, 5);

  const topPorts = [...portCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([portSlug, count]) => ({
      label: portBySlug[portSlug]?.displayName ?? portSlug,
      count,
      slug: portSlug,
      href: `/ports/${portSlug}`,
    }));

  return {
    shipSlug,
    shipName,
    cruiseLine,
    totalCalls: rows.length,
    portCount: portCounts.size,
    busiestMonths,
    peakMonths,
    topPorts,
    yearsAvailable: Object.keys(callsByYear).sort(),
    callsByYear,
  };
}

export function getShipCallsByYear(shipSlug: string): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const row of getVerifiedScheduleRows()) {
    if (shipNameToSlug(row.ship) !== shipSlug) continue;
    const year = row.arrival_date.slice(0, 4);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
}

export function getUpcomingShipCalls(
  shipSlug: string,
  limit = 8,
): readonly CruiseScheduleRow[] {
  const today = new Date().toISOString().slice(0, 10);
  return getVerifiedScheduleRows()
    .filter((row) => shipNameToSlug(row.ship) === shipSlug && row.arrival_date >= today)
    .sort((a, b) => a.arrival_date.localeCompare(b.arrival_date))
    .slice(0, limit);
}

export function filterRowsByCruiseLineKey(
  key: CruiseLineScheduleKey,
): CruiseScheduleRow[] {
  return getVerifiedScheduleRows().filter(
    (row) => matchCruiseLineScheduleKey(row.cruise_line) === key,
  );
}

export const norwayCalendarFaqs = [
  {
    question: "Which month is busiest for Norway cruise ships?",
    answer:
      "In our verified schedule data, July typically has the most combined port calls across all Norway ports, followed by June and August. Use the year filter to compare 2026 and 2027 patterns.",
  },
  {
    question: "Where does this Norway cruise calendar data come from?",
    answer:
      "All figures come from approved CSV imports of published Norway cruise timetables for ports with verified data. We do not estimate or invent visit counts.",
  },
  {
    question: "Does this calendar include 2027 schedules?",
    answer:
      "Yes. Both 2026 and 2027 verified port calls appear when monthly CSV data has been imported. Filter by year, month, port, cruise line or ship to narrow results.",
  },
  {
    question: "How should I use busiest day data when booking excursions?",
    answer:
      "Heavy multi ship days mean longer tender queues and fuller coaches. Book independent tours with clear return times and allow extra buffer on peak summer dates.",
  },
] as const;
