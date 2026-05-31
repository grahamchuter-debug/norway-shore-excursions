/**
 * Cruise schedule query helpers for Norway Shore Excursions.
 *
 * Data is generated from approved CSV imports via:
 *   npm run import:schedules
 *
 * Reuse this module on other destination sites by swapping the generated JSON
 * payload and cruise-schedule-config.ts port lists.
 */

import schedulePayload from "@/data/cruise-schedules.generated.json";
import {
  buildScheduleMonthPrefix,
  formatScheduleDateLabel,
  monthLabels,
  normalizeSchedulePortSlug,
  parseScheduleMonthSlug,
  scheduleMonthSlugs2026,
  schedulePortRegions,
  scheduleYear,
  scheduledPortSlugs,
  type ScheduleMonthSlug2026,
} from "@/lib/cruise-schedule-config";

export type CruiseScheduleRow = {
  port: string;
  ship: string;
  cruise_line: string;
  passengers: number | null;
  arrival_date: string;
  arrival_time: string | null;
  departure_time: string | null;
  all_aboard_time: string | null;
  source: string;
  source_url: string;
  source_checked: string | null;
  notes: string;
};

export type ScheduleDataSource = "real" | "sample_only" | "none";

export type ScheduleDisplayStatus =
  | "real_data_available"
  | "coming_soon"
  | "no_data";

export type SchedulePortMeta = {
  dataSource: ScheduleDataSource;
  realCsvFound: boolean;
  rowCount: number;
  monthsAvailable: string[];
  pagesGenerated: number;
  displayStatus: ScheduleDisplayStatus;
};

/**
 * Sample schedule data must never be used on live production schedule pages.
 */
const BLOCK_SAMPLE_DATA_IN_PRODUCTION =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PHASE === "phase-production-build";

type SchedulePayload = {
  region: string;
  generatedAt: string;
  source: string;
  rowCount: number;
  ports: string[];
  portStatus?: Record<string, SchedulePortMeta>;
  rows: CruiseScheduleRow[];
};

const payload = schedulePayload as SchedulePayload;
const allRows: readonly CruiseScheduleRow[] = payload.rows;

const defaultPortStatus = (): SchedulePortMeta => ({
  dataSource: "none",
  realCsvFound: false,
  rowCount: 0,
  monthsAvailable: [],
  pagesGenerated: 0,
  displayStatus: "no_data",
});

function normalizePortStatus(meta: SchedulePortMeta): SchedulePortMeta {
  if (BLOCK_SAMPLE_DATA_IN_PRODUCTION && meta.dataSource !== "real") {
    return {
      ...meta,
      rowCount: 0,
      monthsAvailable: [],
      pagesGenerated: 0,
      displayStatus:
        meta.dataSource === "sample_only" ? "coming_soon" : "no_data",
    };
  }

  return meta;
}

export function getPortScheduleMeta(port: string): SchedulePortMeta {
  const slug = normalizeSchedulePortSlug(port);
  const raw = payload.portStatus?.[slug] ?? defaultPortStatus();
  return normalizePortStatus(raw);
}

export function hasRealScheduleData(port: string): boolean {
  return getPortScheduleMeta(port).displayStatus === "real_data_available";
}

export function getSchedulePortStatusLabel(port: string): string {
  return hasRealScheduleData(port)
    ? "Available"
    : "Coming Soon";
}

export function getScheduleHubStatusLabel(port: string): string {
  return getSchedulePortStatusLabel(port);
}

export function getScheduleComingSoonMessage(_portName?: string): string {
  return "2026 cruise schedule data for this port is currently being prepared.\n\nPlease check back soon or confirm your ship's latest timings with your cruise line.";
}

export type ScheduleHubMonthSummary = {
  slug: ScheduleMonthSlug2026;
  label: string;
  shipCallCount: number | null;
};

export type ScheduleHubPortSummary = {
  portSlug: string;
  scheduleStatus: "Available" | "Coming Soon";
  months: ScheduleHubMonthSummary[];
  totalShipCalls: number | null;
};

export function getMonthShipCallCount(port: string, monthSlug: ScheduleMonthSlug2026): number {
  const parsed = parseScheduleMonthSlug(monthSlug);
  if (!parsed || !hasRealScheduleData(port)) return 0;
  return getSchedulesByMonth(port, parsed.year, parsed.month).length;
}

export function getScheduleHubPortSummary(portSlug: string): ScheduleHubPortSummary {
  const slug = normalizeSchedulePortSlug(portSlug);
  const available = hasRealScheduleData(slug);
  const meta = getPortScheduleMeta(slug);

  const months = scheduleMonthSlugs2026.map((monthSlug) => ({
    slug: monthSlug,
    label: monthLabels[parseScheduleMonthSlug(monthSlug)?.month ?? "06"] ?? monthSlug,
    shipCallCount: available ? getMonthShipCallCount(slug, monthSlug) : null,
  }));

  return {
    portSlug: slug,
    scheduleStatus: available ? "Available" : "Coming Soon",
    months,
    totalShipCalls: available ? meta.rowCount : null,
  };
}

export function getAllScheduleHubSummaries(): ScheduleHubPortSummary[] {
  return scheduledPortSlugs.map((portSlug) => getScheduleHubPortSummary(portSlug));
}

export type ScheduleHubRegionGroup = {
  region: string;
  ports: ScheduleHubPortSummary[];
};

export function getScheduleHubSummariesByRegion(): ScheduleHubRegionGroup[] {
  return schedulePortRegions.map(({ label, portSlugs }) => ({
    region: label,
    ports: portSlugs.map((portSlug) => getScheduleHubPortSummary(portSlug)),
  }));
}

function normalizeShipMatch(value: string): string {
  return value.trim().toLowerCase();
}

export function getAllScheduleRows(): readonly CruiseScheduleRow[] {
  return allRows;
}

export function getSchedulesByPort(port: string): CruiseScheduleRow[] {
  const slug = normalizeSchedulePortSlug(port);
  if (!hasRealScheduleData(slug)) {
    return [];
  }

  return allRows
    .filter((row) => normalizeSchedulePortSlug(row.port) === slug)
    .sort((a, b) => {
      if (a.arrival_date !== b.arrival_date) {
        return a.arrival_date.localeCompare(b.arrival_date);
      }
      const timeA = a.arrival_time ?? "99:99";
      const timeB = b.arrival_time ?? "99:99";
      if (timeA !== timeB) {
        return timeA.localeCompare(timeB);
      }
      return a.ship.localeCompare(b.ship);
    });
}

export function getSchedulesByMonth(
  port: string,
  year: number | string,
  month: number | string,
): CruiseScheduleRow[] {
  const prefix = buildScheduleMonthPrefix(year, month);
  return getSchedulesByPort(port).filter((row) =>
    row.arrival_date.startsWith(prefix),
  );
}

export function getSchedulesByMonthSlug(
  port: string,
  monthSlug: ScheduleMonthSlug2026 | string,
): CruiseScheduleRow[] {
  const parsed = parseScheduleMonthSlug(monthSlug);
  if (!parsed) return [];
  return getSchedulesByMonth(port, parsed.year, parsed.month);
}

export type GetSchedulesByShipOptions = {
  port?: string;
  year?: number | string;
  month?: number | string;
  monthSlug?: ScheduleMonthSlug2026 | string;
};

/**
 * Reusable across Norway Shore Excursions and future port sites
 * (flamshoreexcursions.com, bergenshoreexcursions.com, etc.).
 */
export function getSchedulesByShip(
  ship: string,
  options: GetSchedulesByShipOptions = {},
): CruiseScheduleRow[] {
  const shipKey = normalizeShipMatch(ship);
  let rows = [...allRows].filter(
    (row) => normalizeShipMatch(row.ship) === shipKey,
  );

  if (options.port) {
    const slug = normalizeSchedulePortSlug(options.port);
    if (!hasRealScheduleData(slug)) return [];
    rows = rows.filter((row) => normalizeSchedulePortSlug(row.port) === slug);
  } else {
    rows = rows.filter((row) => hasRealScheduleData(row.port));
  }

  if (options.monthSlug) {
    const parsed = parseScheduleMonthSlug(options.monthSlug);
    if (!parsed) return [];
    const prefix = buildScheduleMonthPrefix(parsed.year, parsed.month);
    rows = rows.filter((row) => row.arrival_date.startsWith(prefix));
  } else if (options.year && options.month) {
    const prefix = buildScheduleMonthPrefix(options.year, options.month);
    rows = rows.filter((row) => row.arrival_date.startsWith(prefix));
  }

  return rows.sort((a, b) => {
    if (a.arrival_date !== b.arrival_date) {
      return a.arrival_date.localeCompare(b.arrival_date);
    }
    const timeA = a.arrival_time ?? "99:99";
    const timeB = b.arrival_time ?? "99:99";
    if (timeA !== timeB) {
      return timeA.localeCompare(timeB);
    }
    return a.port.localeCompare(b.port);
  });
}

export function getScheduleForShip(
  port: string,
  ship: string,
  date: string,
): CruiseScheduleRow | undefined {
  const shipKey = normalizeShipMatch(ship);
  return getSchedulesByPort(port).find(
    (row) =>
      row.arrival_date === date && normalizeShipMatch(row.ship) === shipKey,
  );
}

export function getShipsForPort(port: string): string[] {
  return [
    ...new Set(getSchedulesByPort(port).map((row) => row.ship)),
  ].sort();
}

export function getDatesForShipAtPort(port: string, ship: string): string[] {
  const shipKey = normalizeShipMatch(ship);
  return [
    ...new Set(
      getSchedulesByPort(port)
        .filter((row) => normalizeShipMatch(row.ship) === shipKey)
        .map((row) => row.arrival_date),
    ),
  ].sort();
}

export function findMatchingCruise(input: {
  port: string;
  ship: string;
  date: string;
}): CruiseScheduleRow | undefined {
  return getScheduleForShip(input.port, input.ship, input.date);
}

export function getSchedulePortsWithData(): string[] {
  return scheduledPortSlugs.filter((port) => hasRealScheduleData(port));
}

export function getScheduleRegion(): string {
  return payload.region;
}

export function getScheduleGeneratedAt(): string {
  return payload.generatedAt;
}

export { formatScheduleDateLabel };

/** @deprecated Use getSchedulesByPort + findMatchingCruise instead */
export type LegacyScheduleEntry = {
  id: string;
  shipName: string;
  cruiseLine: string;
  sailingDate: string;
  portSlug: string;
  portName: string;
  arrivalTime: string | null;
  allAboardTime: string | null;
  hasAllAboardTime: boolean;
};

export function toLegacyScheduleEntries(
  rows: readonly CruiseScheduleRow[],
  portNameBySlug: Record<string, string>,
): LegacyScheduleEntry[] {
  return rows.map((row) => ({
    id: `${row.port}-${row.arrival_date}-${row.ship}`.toLowerCase().replace(/\s+/g, "-"),
    shipName: row.ship,
    cruiseLine: row.cruise_line,
    sailingDate: row.arrival_date,
    portSlug: row.port,
    portName: portNameBySlug[row.port] ?? row.port,
    arrivalTime: row.arrival_time,
    allAboardTime: row.all_aboard_time,
    hasAllAboardTime: Boolean(row.all_aboard_time),
  }));
}
