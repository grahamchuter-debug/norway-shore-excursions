import {
  getAllScheduleRows,
  hasRealScheduleData,
  type CruiseScheduleRow,
} from "@/lib/cruiseSchedules";
import { portBySlug } from "@/lib/ports-data";

export type CruiseLineScheduleKey =
  | "msc"
  | "p-and-o"
  | "celebrity"
  | "cunard"
  | "viking"
  | "holland-america";

export const cruiseLineScheduleKeys: readonly CruiseLineScheduleKey[] = [
  "msc",
  "p-and-o",
  "celebrity",
  "cunard",
  "viking",
  "holland-america",
] as const;

const scheduleLineNames: Record<CruiseLineScheduleKey, readonly string[]> = {
  msc: ["MSC Cruises", "MSC"],
  "p-and-o": ["P&O Cruises", "P&O", "P & O"],
  celebrity: ["Celebrity Cruises", "Celebrity"],
  cunard: ["Cunard Line", "Cunard"],
  viking: ["Viking", "Viking Oceans"],
  "holland-america": ["Holland America Line"],
};

export type CruiseLineShipSummary = {
  ship: string;
  callCount: number;
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

  const shipCounts = new Map<string, { display: string; count: number }>();
  const portCounts = new Map<string, number>();

  for (const row of rows) {
    const shipKey = row.ship.trim().toLowerCase();
    const existing = shipCounts.get(shipKey);
    if (existing) {
      existing.count += 1;
      existing.display = pickDisplayShipName(existing.display, row.ship);
    } else {
      shipCounts.set(shipKey, { display: row.ship.trim(), count: 1 });
    }

    portCounts.set(row.port, (portCounts.get(row.port) ?? 0) + 1);
  }

  const ships = [...shipCounts.values()]
    .map(({ display, count }) => ({ ship: display, callCount: count }))
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
