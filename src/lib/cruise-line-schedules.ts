import {
  getAllScheduleRows,
  hasRealScheduleData,
  type CruiseScheduleRow,
} from "@/lib/cruiseSchedules";
import { shipScheduleSearchPath } from "@/lib/cruise-schedule-config";
import { portBySlug } from "@/lib/ports-data";
import {
  formatShipCapacityLabel,
  getShipPassengerCapacity,
} from "@/lib/ship-capacities";
import {
  getShipScheduleSummaryByName,
  shipNameToSlug,
  shipPagePath,
} from "@/lib/ship-schedules";

export type CruiseLineScheduleKey =
  | "msc"
  | "p-and-o"
  | "celebrity"
  | "cunard"
  | "viking"
  | "holland-america"
  | "princess"
  | "royal-caribbean"
  | "disney"
  | "norwegian"
  | "aida"
  | "tui"
  | "costa"
  | "fred-olsen"
  | "phoenix-reisen"
  | "silversea"
  | "saga"
  | "regent"
  | "ambassador"
  | "oceania"
  | "hapag-lloyd";

export const cruiseLineScheduleKeys: readonly CruiseLineScheduleKey[] = [
  "msc",
  "p-and-o",
  "celebrity",
  "cunard",
  "viking",
  "holland-america",
  "princess",
  "royal-caribbean",
  "disney",
  "norwegian",
  "aida",
  "tui",
  "costa",
  "fred-olsen",
  "phoenix-reisen",
  "silversea",
  "saga",
  "regent",
  "ambassador",
  "oceania",
  "hapag-lloyd",
] as const;

export const scheduleLineNames: Record<CruiseLineScheduleKey, readonly string[]> = {
  msc: ["MSC Cruises", "MSC"],
  "p-and-o": ["P&O Cruises", "P&O", "P & O"],
  celebrity: ["Celebrity Cruises", "Celebrity"],
  cunard: ["Cunard Line", "Cunard"],
  viking: ["Viking", "Viking Oceans"],
  "holland-america": ["Holland America Line", "Holland America"],
  princess: ["Princess Cruises", "Princess"],
  "royal-caribbean": ["Royal Caribbean Cruises", "Royal Caribbean"],
  disney: ["Disney Cruise Line", "Disney"],
  norwegian: ["Norwegian Cruise Line", "Norwegian"],
  aida: ["AIDA"],
  tui: ["TUI Cruises", "Tui Cruises"],
  costa: ["Costa Cruises", "Costa"],
  "fred-olsen": ["Fred Olsen Cruise Lines"],
  "phoenix-reisen": ["Phoenix Reisen", "Phoenix"],
  silversea: ["Silversea"],
  saga: ["Saga Cruises", "Saga"],
  regent: ["Regent Seven Seas"],
  ambassador: ["Ambassador Cruise Line"],
  oceania: ["Oceania Cruises"],
  "hapag-lloyd": ["Hapag Lloyd"],
};

export type CruiseLineShipSummary = {
  ship: string;
  slug: string;
  callCount: number;
  capacity: number | null;
  capacityLabel: string;
  topPortNames: string;
  topPortDisplayName: string | null;
  cruiseLine: string;
  shipPageHref: string | null;
};

export type CruiseLinePortSummary = {
  portSlug: string;
  portDisplayName: string;
  callCount: number;
};

export type CruiseLineScheduleSummary = {
  key: CruiseLineScheduleKey;
  shipCount: number;
  portCount: number;
  totalCalls: number;
  ships: readonly CruiseLineShipSummary[];
  ports: readonly CruiseLinePortSummary[];
};

function matchesCruiseLine(row: CruiseScheduleRow, key: CruiseLineScheduleKey): boolean {
  return scheduleLineNames[key].includes(row.cruise_line);
}

export function matchCruiseLineScheduleKey(
  cruiseLine: string,
): CruiseLineScheduleKey | null {
  const trimmed = cruiseLine.trim();
  if (!trimmed) return null;
  for (const key of cruiseLineScheduleKeys) {
    if (scheduleLineNames[key].includes(trimmed)) return key;
  }
  return null;
}

function getRowsForCruiseLine(key: CruiseLineScheduleKey): CruiseScheduleRow[] {
  return getAllScheduleRows().filter(
    (row) => hasRealScheduleData(row.port) && matchesCruiseLine(row, key),
  );
}

function pickDisplayShipName(current: string, candidate: string): string {
  const trimmed = candidate.trim();
  if (!current) return trimmed;
  if (trimmed.length > current.length) return trimmed;
  if (trimmed.length === current.length && trimmed < current) return trimmed;
  return current;
}

export function getCruiseLineScheduleSummary(
  key: CruiseLineScheduleKey,
): CruiseLineScheduleSummary {
  const rows = getRowsForCruiseLine(key);

  const shipCounts = new Map<
    string,
    { display: string; count: number; cruiseLine: string; portCounts: Map<string, number> }
  >();
  const portCounts = new Map<string, number>();

  for (const row of rows) {
    const shipKey = row.ship.trim().toLowerCase();
    const existing = shipCounts.get(shipKey);
    if (existing) {
      existing.count += 1;
      existing.display = pickDisplayShipName(existing.display, row.ship);
      existing.portCounts.set(
        row.port,
        (existing.portCounts.get(row.port) ?? 0) + 1,
      );
    } else {
      const portMap = new Map<string, number>();
      portMap.set(row.port, 1);
      shipCounts.set(shipKey, {
        display: row.ship.trim(),
        count: 1,
        cruiseLine: row.cruise_line,
        portCounts: portMap,
      });
    }

    portCounts.set(row.port, (portCounts.get(row.port) ?? 0) + 1);
  }

  const ships = [...shipCounts.values()]
    .map(({ display, count, cruiseLine, portCounts: shipPortCounts }) => {
      const sortedPorts = [...shipPortCounts.entries()].sort(
        (a, b) => b[1] - a[1],
      );
      const topPortNames = sortedPorts
        .slice(0, 3)
        .map(
          ([portSlug]) =>
            portBySlug[portSlug]?.displayName ?? portSlug,
        )
        .join(", ");
      const topPortSlug = sortedPorts[0]?.[0];
      const topPortDisplayName = topPortSlug
        ? (portBySlug[topPortSlug]?.displayName ?? topPortSlug)
        : null;

      const scheduleSummary = getShipScheduleSummaryByName(display);
      const slug = scheduleSummary?.slug ?? shipNameToSlug(display);
      const capacity = getShipPassengerCapacity(display, cruiseLine, null);

      return {
        ship: display,
        slug,
        callCount: count,
        capacity,
        capacityLabel: formatShipCapacityLabel(capacity),
        topPortNames,
        topPortDisplayName,
        cruiseLine,
        shipPageHref: scheduleSummary ? shipPagePath(slug) : null,
      };
    })
    .sort(
      (a, b) =>
        b.callCount - a.callCount || a.ship.localeCompare(b.ship),
    );

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

  return {
    key,
    shipCount: ships.length,
    portCount: ports.length,
    totalCalls: rows.length,
    ships,
    ports,
  };
}

export function getAllCruiseLineScheduleSummaries(): Record<
  CruiseLineScheduleKey,
  CruiseLineScheduleSummary
> {
  return Object.fromEntries(
    cruiseLineScheduleKeys.map((key) => [key, getCruiseLineScheduleSummary(key)]),
  ) as Record<CruiseLineScheduleKey, CruiseLineScheduleSummary>;
}

function slugToDisplayShipName(slug: string): string {
  if (slug.startsWith("msc-")) {
    const name = slug
      .slice(4)
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return `MSC ${name}`;
  }
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Curated featured ships for a cruise line page, merged with schedule call counts. */
export function getFeaturedCruiseLineShips(
  key: CruiseLineScheduleKey,
  featuredSlugs: readonly string[],
): CruiseLineShipSummary[] {
  const summary = getCruiseLineScheduleSummary(key);
  const bySlug = new Map(summary.ships.map((s) => [s.slug, s]));

  return featuredSlugs.map((slug) => {
    const fromLine = bySlug.get(slug);
    if (fromLine) return fromLine;

    const global = getShipScheduleSummaryByName(
      slugToDisplayShipName(slug),
    );
    if (global) {
      const topPortNames = global.topPorts
        .map((p) => p.portDisplayName)
        .join(", ");
      return {
        ship: global.ship,
        slug: global.slug,
        callCount: global.callCount,
        capacity: global.capacity,
        capacityLabel: global.capacityLabel,
        topPortNames,
        topPortDisplayName: global.topPorts[0]?.portDisplayName ?? null,
        cruiseLine: global.cruiseLine,
        shipPageHref: shipPagePath(global.slug),
      };
    }

    const display = slugToDisplayShipName(slug);
    const capacity = getShipPassengerCapacity(display, "", null);
    return {
      ship: display,
      slug,
      callCount: 0,
      capacity,
      capacityLabel: formatShipCapacityLabel(capacity),
      topPortNames: "",
      topPortDisplayName: null,
      cruiseLine: scheduleLineNames[key][0] ?? "",
      shipPageHref: null,
    };
  });
}

export function shipScheduleSearchPathForLine(
  key: CruiseLineScheduleKey,
): string {
  return `${shipScheduleSearchPath}?line=${encodeURIComponent(key)}`;
}

export function isCruiseLineScheduleKey(value: string): value is CruiseLineScheduleKey {
  return (cruiseLineScheduleKeys as readonly string[]).includes(value);
}

export function getCruiseLineCallsByYear(
  key: CruiseLineScheduleKey,
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const row of getRowsForCruiseLine(key)) {
    const year = row.arrival_date.slice(0, 4);
    counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
}

export function getCruiseLineBusiestMonths(
  key: CruiseLineScheduleKey,
  year?: string,
  limit = 3,
): { monthKey: string; monthLabel: string; shipCalls: number }[] {
  const monthCounts = new Map<string, number>();

  for (const row of getRowsForCruiseLine(key)) {
    if (year && !row.arrival_date.startsWith(`${year}-`)) continue;
    const monthKey = row.arrival_date.slice(0, 7);
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);
  }

  return [...monthCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([monthKey, shipCalls]) => {
      const [y, m] = monthKey.split("-");
      const date = new Date(`${y}-${m}-01T12:00:00`);
      return {
        monthKey,
        monthLabel: date.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        }),
        shipCalls,
      };
    });
}
