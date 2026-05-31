import capacityPayload from "@/data/ship-capacities.generated.json";

export type ShipCapacityRecord = {
  ship: string;
  shipAliases: string[];
  cruiseLine: string;
  passengers: number;
};

type CapacityPayload = {
  generatedAt: string;
  records: ShipCapacityRecord[];
};

const payload = capacityPayload as CapacityPayload;

export function normalizeShipCapacityKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/^msc\s+/, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeCruiseLineKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
}

const byShipKey = new Map<string, ShipCapacityRecord[]>();

for (const record of payload.records) {
  const keys = new Set([
    normalizeShipCapacityKey(record.ship),
    ...record.shipAliases.map(normalizeShipCapacityKey),
  ]);
  for (const key of keys) {
    if (!key) continue;
    const list = byShipKey.get(key) ?? [];
    list.push(record);
    byShipKey.set(key, list);
  }
}

export function findShipCapacity(
  ship: string,
  cruiseLine?: string,
): ShipCapacityRecord | null {
  const shipKey = normalizeShipCapacityKey(ship);
  if (!shipKey) return null;

  const candidates = byShipKey.get(shipKey) ?? [];
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const lineKey = normalizeCruiseLineKey(cruiseLine ?? "");
  if (lineKey) {
    const lineMatch = candidates.find((record) => {
      const recordLine = normalizeCruiseLineKey(record.cruiseLine);
      return (
        recordLine &&
        (lineKey.includes(recordLine) || recordLine.includes(lineKey))
      );
    });
    if (lineMatch) return lineMatch;
  }

  return candidates[0];
}

export function formatShipCapacityLabel(passengers: number | null): string {
  if (passengers == null) return "Not published";
  return `${passengers.toLocaleString("en-GB")} passengers`;
}

export function getShipPassengerCapacity(
  ship: string,
  cruiseLine?: string,
  schedulePassengers?: number | null,
): number | null {
  if (schedulePassengers != null) return schedulePassengers;
  return findShipCapacity(ship, cruiseLine)?.passengers ?? null;
}
