/**
 * Master ship capacity lookup for cruise schedule import enrichment.
 * Data source: data/cruise-schedules/ship-capacities.csv (manual, not scraped).
 */

const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_CAPACITY_FILE = path.join(
  __dirname,
  "..",
  "data",
  "cruise-schedules",
  "ship-capacities.csv",
);

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(field.trim());
      field = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}

function normalizeShipMatchKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/^msc\s+/, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeCruiseLineKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function parsePassengers(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseAliasList(value) {
  return String(value ?? "")
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function loadShipCapacities(filePath = DEFAULT_CAPACITY_FILE) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ship capacity file: ${filePath}`);
  }

  const table = parseCsv(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  if (table.length <= 1) {
    return { records: [], byShipKey: new Map() };
  }

  const headers = table[0].map((header) =>
    header.trim().toLowerCase().replace(/\s+/g, "_"),
  );
  const records = [];
  const byShipKey = new Map();

  for (const cells of table.slice(1)) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index]?.trim() ?? "";
    });

    const passengers = parsePassengers(row.passengers);
    if (!row.ship || passengers == null) continue;

    const record = {
      ship: row.ship.trim(),
      shipAliases: parseAliasList(row.ship_aliases),
      cruiseLine: row.cruise_line?.trim() ?? "",
      passengers,
      capacityType: row.capacity_type?.trim() ?? "",
      source: row.source?.trim() ?? "",
      sourceUrl: row.source_url?.trim() ?? "",
      sourceChecked: row.source_checked?.trim() ?? "",
      notes: row.notes?.trim() ?? "",
    };

    records.push(record);

    const keys = new Set([
      normalizeShipMatchKey(record.ship),
      ...record.shipAliases.map(normalizeShipMatchKey),
    ]);

    for (const key of keys) {
      if (!key) continue;
      if (!byShipKey.has(key)) {
        byShipKey.set(key, []);
      }
      byShipKey.get(key).push(record);
    }
  }

  return { records, byShipKey };
}

function findShipCapacity(ship, cruiseLine, lookup) {
  const shipKey = normalizeShipMatchKey(ship);
  if (!shipKey) return null;

  const candidates = lookup.byShipKey.get(shipKey) ?? [];
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const lineKey = normalizeCruiseLineKey(cruiseLine);
  if (lineKey) {
    const lineMatch = candidates.find((record) => {
      const recordLine = normalizeCruiseLineKey(record.cruiseLine);
      return recordLine && (lineKey.includes(recordLine) || recordLine.includes(lineKey));
    });
    if (lineMatch) return lineMatch;
  }

  return candidates[0];
}

function enrichSchedulePassengers(rows, lookup) {
  let keptFromSchedule = 0;
  let enrichedFromMaster = 0;
  let stillMissing = 0;
  const unmatchedShips = new Set();

  for (const row of rows) {
    if (row.passengers != null) {
      keptFromSchedule += 1;
      continue;
    }

    const match = findShipCapacity(row.ship, row.cruise_line, lookup);
    if (match) {
      row.passengers = match.passengers;
      enrichedFromMaster += 1;
    } else {
      stillMissing += 1;
      unmatchedShips.add(row.ship);
    }
  }

  return {
    keptFromSchedule,
    enrichedFromMaster,
    stillMissing,
    unmatchedShips: [...unmatchedShips].sort(),
  };
}

function formatPassengersLabel(passengers) {
  if (passengers == null) return "Not published";
  return `${passengers.toLocaleString("en-GB")} passengers`;
}

module.exports = {
  DEFAULT_CAPACITY_FILE,
  normalizeShipMatchKey,
  loadShipCapacities,
  findShipCapacity,
  enrichSchedulePassengers,
  formatPassengersLabel,
};
