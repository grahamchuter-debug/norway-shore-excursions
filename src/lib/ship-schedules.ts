import {
  getAllScheduleRows,
  hasRealScheduleData,
  normalizeShipSearchKey,
  type CruiseScheduleRow,
} from "@/lib/cruiseSchedules";
import {
  formatShipCapacityLabel,
  getShipPassengerCapacity,
} from "@/lib/ship-capacities";
import { portBySlug } from "@/lib/ports-data";

export function shipNameToSlug(shipName: string): string {
  return String(shipName ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const shipPagePath = (slug: string) => `/ships/${slug}`;

export type ShipPortSummary = {
  portSlug: string;
  portDisplayName: string;
  callCount: number;
};

export type ShipYearVisitSummary = {
  year: string;
  callCount: number;
};

export type ShipScheduleSummary = {
  slug: string;
  ship: string;
  cruiseLine: string;
  capacity: number | null;
  capacityLabel: string;
  callCount: number;
  portCount: number;
  ports: readonly ShipPortSummary[];
  topPorts: readonly ShipPortSummary[];
  visitsByYear: readonly ShipYearVisitSummary[];
  rows: readonly CruiseScheduleRow[];
  shipSearchKey: string;
};

function pickDisplayShipName(current: string, candidate: string): string {
  const trimmed = candidate.trim();
  if (!current) return trimmed;
  if (trimmed.length > current.length) return trimmed;
  if (trimmed.length === current.length && trimmed < current) return trimmed;
  return current;
}

function getRowsForShipKey(shipKey: string): CruiseScheduleRow[] {
  return getAllScheduleRows().filter(
    (row) =>
      hasRealScheduleData(row.port) &&
      normalizeShipSearchKey(row.ship) === shipKey,
  );
}

export type TopNorwayShip2026 = {
  slug: string;
  ship: string;
  callCount: number;
};

let cachedTopNorwayShip2026: TopNorwayShip2026 | null | undefined;

/** Global winner: most Norway port calls across all verified schedule ports. */
export function getTopNorwayShip2026(): TopNorwayShip2026 | null {
  if (cachedTopNorwayShip2026 !== undefined) {
    return cachedTopNorwayShip2026;
  }

  const summaries = buildShipScheduleSummaries();
  const top = summaries[0];
  if (!top || top.callCount <= 0) {
    cachedTopNorwayShip2026 = null;
    return null;
  }

  cachedTopNorwayShip2026 = {
    slug: top.slug,
    ship: top.ship,
    callCount: top.callCount,
  };
  return cachedTopNorwayShip2026;
}

export function isTopNorwayShip2026Slug(slug: string): boolean {
  const top = getTopNorwayShip2026();
  return Boolean(slug && top && top.slug === slug);
}

export function buildShipScheduleSummaries(): ShipScheduleSummary[] {
  const groups = new Map<
    string,
    { display: string; cruiseLine: string; rows: CruiseScheduleRow[] }
  >();

  for (const row of getAllScheduleRows()) {
    if (!hasRealScheduleData(row.port)) continue;
    const key = normalizeShipSearchKey(row.ship);
    const existing = groups.get(key);
    if (existing) {
      existing.rows.push(row);
      existing.display = pickDisplayShipName(existing.display, row.ship);
      if (row.cruise_line && !existing.cruiseLine) {
        existing.cruiseLine = row.cruise_line;
      }
    } else {
      groups.set(key, {
        display: row.ship.trim(),
        cruiseLine: row.cruise_line,
        rows: [row],
      });
    }
  }

  return [...groups.entries()]
    .map(([shipSearchKey, group]) =>
      buildShipScheduleSummaryFromRows(
        shipSearchKey,
        group.display,
        group.cruiseLine,
        group.rows,
      ),
    )
    .sort(
      (a, b) =>
        b.callCount - a.callCount || a.ship.localeCompare(b.ship),
    );
}

function buildShipScheduleSummaryFromRows(
  shipSearchKey: string,
  ship: string,
  cruiseLine: string,
  rows: CruiseScheduleRow[],
): ShipScheduleSummary {
  const portCounts = new Map<string, number>();
  for (const row of rows) {
    portCounts.set(row.port, (portCounts.get(row.port) ?? 0) + 1);
  }

  const ports = [...portCounts.entries()]
    .map(([portSlug, callCount]) => ({
      portSlug,
      portDisplayName: portBySlug[portSlug]?.displayName ?? portSlug,
      callCount,
    }))
    .sort(
      (a, b) =>
        b.callCount - a.callCount ||
        a.portDisplayName.localeCompare(b.portDisplayName),
    );

  const schedulePassengers = rows.find((r) => r.passengers != null)?.passengers;
  const capacity = getShipPassengerCapacity(
    ship,
    cruiseLine,
    schedulePassengers ?? null,
  );

  const slug = shipNameToSlug(ship);

  const yearCounts = new Map<string, number>();
  for (const row of rows) {
    const year = row.arrival_date.slice(0, 4);
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  }
  const visitsByYear = [...yearCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, callCount]) => ({ year, callCount }));

  return {
    slug,
    ship,
    cruiseLine,
    capacity,
    capacityLabel: formatShipCapacityLabel(capacity),
    callCount: rows.length,
    portCount: ports.length,
    ports,
    topPorts: ports.slice(0, 5),
    visitsByYear,
    rows: [...rows].sort((a, b) => {
      if (a.arrival_date !== b.arrival_date) {
        return a.arrival_date.localeCompare(b.arrival_date);
      }
      const timeA = a.arrival_time ?? "99:99";
      const timeB = b.arrival_time ?? "99:99";
      return timeA.localeCompare(timeB) || a.port.localeCompare(b.port);
    }),
    shipSearchKey,
  };
}

const summaryBySlug = new Map<string, ShipScheduleSummary>();
const summaryBySearchKey = new Map<string, ShipScheduleSummary>();

function ensureIndex(): void {
  if (summaryBySlug.size > 0) return;
  for (const summary of buildShipScheduleSummaries()) {
    summaryBySlug.set(summary.slug, summary);
    summaryBySearchKey.set(summary.shipSearchKey, summary);
  }
}

export function getShipScheduleSummaryBySlug(
  slug: string,
): ShipScheduleSummary | undefined {
  ensureIndex();
  return summaryBySlug.get(slug);
}

export function getShipScheduleSummaryByName(
  shipName: string,
): ShipScheduleSummary | undefined {
  ensureIndex();
  const key = normalizeShipSearchKey(shipName);
  return summaryBySearchKey.get(key);
}

export function getAllShipSlugs(): string[] {
  ensureIndex();
  return [...summaryBySlug.keys()].sort();
}

export type ShipSearchResultSummary = {
  ship: string;
  cruiseLine: string;
  capacity: number | null;
  capacityLabel: string;
  callCount: number;
  topPorts: readonly ShipPortSummary[];
  shipPageHref: string | null;
  scheduleSearchHref: string;
  plannerHref: string;
  excursionsHref: string;
};

export function buildShipSearchResultSummaries(
  shipSearchKey: string,
): ShipSearchResultSummary | null {
  ensureIndex();
  const summary = summaryBySearchKey.get(shipSearchKey);
  if (!summary) return null;

  return {
    ship: summary.ship,
    cruiseLine: summary.cruiseLine,
    capacity: summary.capacity,
    capacityLabel: summary.capacityLabel,
    callCount: summary.callCount,
    topPorts: summary.topPorts,
    shipPageHref: shipPagePath(summary.slug),
    scheduleSearchHref: `/ship-schedules/search?q=${encodeURIComponent(summary.ship)}`,
    plannerHref: "/norway-cruise-planner",
    excursionsHref: "/norway-shore-excursions",
  };
}
