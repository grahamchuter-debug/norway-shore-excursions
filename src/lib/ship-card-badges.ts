import type {
  CruiseLineScheduleKey,
  CruiseLineShipSummary,
} from "@/lib/cruise-line-schedules";
import { matchCruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import type { ShipScheduleSummary } from "@/lib/ship-schedules";

export const MOST_ACTIVE_NORWAY_MIN_CALLS = 30;
export const MEGA_SHIP_MIN_CAPACITY = 4000;

export type ShipCardBadgeInput = {
  callCount?: number;
  capacity?: number | null;
  cruiseLine?: string;
  cruiseLineKey?: CruiseLineScheduleKey | null;
  topPortDisplayName?: string | null;
};

export type PrimaryShipBadgeVariant =
  | "most-active"
  | "mega-ship"
  | "viking"
  | "holland-america"
  | "cunard"
  | "celebrity"
  | "p-and-o"
  | "msc"
  | "princess"
  | "royal-caribbean"
  | "disney"
  | "norwegian"
  | "fallback";

export type ResolvedPrimaryShipBadge = {
  label: string;
  variant: PrimaryShipBadgeVariant;
};

export type ShipCardBadgeSet = {
  primary: ResolvedPrimaryShipBadge | null;
  portCallsLabel: string | null;
  mostVisitsLabel: string | null;
  /** True when only the generic Norway Cruise Ship badge should show */
  insufficientData: boolean;
};

const linePrimaryBadges: Partial<
  Record<CruiseLineScheduleKey, { label: string; variant: PrimaryShipBadgeVariant }>
> = {
  viking: { label: "Adults Focused", variant: "viking" },
  "holland-america": {
    label: "Classic Cruise Experience",
    variant: "holland-america",
  },
  cunard: { label: "Luxury Ocean Liner", variant: "cunard" },
  celebrity: { label: "Modern Premium", variant: "celebrity" },
  "p-and-o": { label: "Popular with UK Cruisers", variant: "p-and-o" },
  msc: { label: "Family Favourite", variant: "msc" },
  princess: { label: "Premium Fjord Cruising", variant: "princess" },
  "royal-caribbean": {
    label: "Resort Mega Ship",
    variant: "royal-caribbean",
  },
  disney: { label: "Family Focused", variant: "disney" },
  norwegian: { label: "Freestyle Cruising", variant: "norwegian" },
};

function hasScheduleBadgeData(input: ShipCardBadgeInput): boolean {
  return typeof input.callCount === "number" && input.callCount > 0;
}

function resolvePrimaryBadge(
  input: ShipCardBadgeInput,
): ResolvedPrimaryShipBadge | null {
  const callCount = input.callCount ?? 0;
  const capacity = input.capacity ?? 0;

  if (callCount >= MOST_ACTIVE_NORWAY_MIN_CALLS) {
    return { label: "Most Active Norway Ship", variant: "most-active" };
  }

  if (capacity >= MEGA_SHIP_MIN_CAPACITY) {
    return { label: "Mega Ship", variant: "mega-ship" };
  }

  const lineKey =
    input.cruiseLineKey ?? matchCruiseLineScheduleKey(input.cruiseLine ?? "");
  if (lineKey && linePrimaryBadges[lineKey]) {
    return linePrimaryBadges[lineKey];
  }

  return null;
}

export function resolveShipCardBadges(
  input: ShipCardBadgeInput,
): ShipCardBadgeSet {
  if (!hasScheduleBadgeData(input)) {
    return {
      primary: { label: "Norway Cruise Ship", variant: "fallback" },
      portCallsLabel: null,
      mostVisitsLabel: null,
      insufficientData: true,
    };
  }

  const callCount = input.callCount ?? 0;
  const portCallsLabel = `${callCount} Norway Port Call${callCount === 1 ? "" : "s"}`;
  const topPort = input.topPortDisplayName?.trim();
  const mostVisitsLabel = topPort ? `Most Visits: ${topPort}` : null;

  return {
    primary: resolvePrimaryBadge(input),
    portCallsLabel,
    mostVisitsLabel,
    insufficientData: false,
  };
}

export function shipCardBadgeInputFromSummary(
  summary: Pick<
    ShipScheduleSummary,
    "callCount" | "capacity" | "cruiseLine" | "topPorts"
  >,
): ShipCardBadgeInput {
  return {
    callCount: summary.callCount,
    capacity: summary.capacity,
    cruiseLine: summary.cruiseLine,
    topPortDisplayName: summary.topPorts[0]?.portDisplayName ?? null,
  };
}

export function shipCardBadgeInputFromCruiseLineShip(
  ship: Pick<
    CruiseLineShipSummary,
    "callCount" | "capacity" | "cruiseLine" | "topPortDisplayName"
  >,
): ShipCardBadgeInput {
  return {
    callCount: ship.callCount,
    capacity: ship.capacity,
    cruiseLine: ship.cruiseLine,
    topPortDisplayName: ship.topPortDisplayName,
  };
}
