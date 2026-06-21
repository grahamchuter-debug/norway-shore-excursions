/**
 * Shared cruise schedule normalisation for import + debug scripts.
 * Keep port/month aliases in sync with src/lib/cruise-schedule-config.ts
 *
 * Sample data must never be used on live production schedule pages.
 * Only files matching *-cruise-schedule-*-YYYY.csv are treated as real imports.
 */

const fs = require("node:fs");
const path = require("node:path");

const PORT_ALIASES = {
  flam: "flam",
  flåm: "flam",
  flaam: "flam",
  aurland: "flam",
  bergen: "bergen",
  olden: "olden",
  nordfjordeid: "nordfjordeid",
  "nordfjordeid eid": "nordfjordeid",
  eid: "nordfjordeid",
  eidfjord: "eidfjord",
  geiranger: "geiranger",
  stavanger: "stavanger",
  alesund: "alesund",
  ålesund: "alesund",
  molde: "molde",
  honningsvag: "honningsvag",
  honningsvåg: "honningsvag",
  kristiansand: "kristiansand",
  hellesylt: "hellesylt",
  trondheim: "trondheim",
  skjolden: "skjolden",
  tromso: "tromso",
  tromsø: "tromso",
};

const MONTH_ALIASES = {
  "1": "01",
  "01": "01",
  jan: "01",
  january: "01",
  "2": "02",
  "02": "02",
  feb: "02",
  february: "02",
  "3": "03",
  "03": "03",
  mar: "03",
  march: "03",
  "4": "04",
  "04": "04",
  apr: "04",
  april: "04",
  "5": "05",
  "05": "05",
  may: "05",
  "6": "06",
  "06": "06",
  jun: "06",
  june: "06",
  "7": "07",
  "07": "07",
  jul: "07",
  july: "07",
  "8": "08",
  "08": "08",
  aug: "08",
  august: "08",
  "9": "09",
  "09": "09",
  sep: "09",
  sept: "09",
  september: "09",
  "10": "10",
  oct: "10",
  october: "10",
  "11": "11",
  nov: "11",
  november: "11",
  "12": "12",
  dec: "12",
  december: "12",
};

function normalizePort(value) {
  const key = String(value ?? "")
    .trim()
    .toLowerCase();
  return PORT_ALIASES[key] ?? key.replace(/\s+/g, "");
}

function normalizeMonth(value) {
  const key = String(value ?? "")
    .trim()
    .toLowerCase();
  if (MONTH_ALIASES[key]) return MONTH_ALIASES[key];

  const numeric = Number(key);
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) {
    return String(numeric).padStart(2, "0");
  }

  return key.padStart(2, "0");
}

function buildMonthPrefix(year, month) {
  return `${String(year).trim()}-${normalizeMonth(month)}`;
}

function dedupeKey(row) {
  return [
    row.port,
    row.ship,
    row.arrival_date,
    row.arrival_time ?? "",
  ].join("|");
}

function inferPortFromFilename(filename) {
  const base = path.basename(filename, ".csv").toLowerCase().replace(/\.+$/, "");

  const cruiseScheduleMatch = /^([a-z]+)-cruise-schedule(?:-[a-z]+)?-(\d{4})$/.exec(
    base,
  );
  if (cruiseScheduleMatch) {
    return normalizePort(cruiseScheduleMatch[1]);
  }

  const portYearMatch = /^([a-z]+)-(\d{4})$/.exec(base);
  if (portYearMatch) {
    return normalizePort(portYearMatch[1]);
  }

  return "";
}

/** Expected Norway schedule ports — keep in sync with cruise-schedule-config.ts */
const EXPECTED_SCHEDULE_PORTS = [
  "flam",
  "bergen",
  "olden",
  "geiranger",
  "eidfjord",
  "nordfjordeid",
  "skjolden",
  "hellesylt",
  "stavanger",
  "alesund",
  "molde",
  "trondheim",
  "honningsvag",
  "tromso",
  "kristiansand",
];

/** Supported import years — keep in sync with src/lib/cruise-schedule-config.ts */
const SCHEDULE_YEARS = ["2026", "2027"];

/** @deprecated Use SCHEDULE_YEARS */
const SCHEDULE_YEAR = SCHEDULE_YEARS[0];

function isAuthoritativeScheduleFile(filename) {
  const base = path.basename(filename, ".csv").toLowerCase().replace(/\.+$/, "");
  return /-cruise-schedule(?:-[a-z]+)?-\d{4}$/i.test(base);
}

/** Alias: real approved schedule CSV (not sample/demo). */
function isRealScheduleFile(filename) {
  return isAuthoritativeScheduleFile(filename);
}

/** Legacy sample naming pattern, e.g. bergen-2026.csv — never imported for production. */
function isLegacySampleScheduleFile(filename) {
  const base = path.basename(filename, ".csv").toLowerCase().replace(/\.+$/, "");
  return /^[a-z]+-\d{4}$/.test(base) && !isRealScheduleFile(filename);
}

function inferYearFromFilename(filename) {
  const match = String(filename).match(/(\d{4})/);
  return match?.[1] ?? "";
}

function listRawCsvFilenames(rawDir) {
  if (!fs.existsSync(rawDir)) return [];
  return fs
    .readdirSync(rawDir)
    .filter((file) => file.toLowerCase().endsWith(".csv"));
}

function inspectRawScheduleSources(
  rawDir,
  expectedPorts = EXPECTED_SCHEDULE_PORTS,
  years = SCHEDULE_YEARS,
) {
  const files = listRawCsvFilenames(rawDir);
  const byPortYear = new Map();

  for (const file of files) {
    const port = inferPortFromFilename(file);
    const year = inferYearFromFilename(file);
    if (!port || !year) continue;

    const key = `${port}|${year}`;
    if (!byPortYear.has(key)) {
      byPortYear.set(key, { realFiles: [], legacyFiles: [] });
    }

    const bucket = byPortYear.get(key);
    if (isRealScheduleFile(file)) {
      bucket.realFiles.push(file);
    } else if (isLegacySampleScheduleFile(file)) {
      bucket.legacyFiles.push(file);
    }
  }

  const statusByPortYear = new Map();

  for (const port of expectedPorts) {
    for (const year of years) {
      const key = `${port}|${year}`;
      const bucket = byPortYear.get(key) ?? { realFiles: [], legacyFiles: [] };
      let dataSource = "none";

      if (bucket.realFiles.length > 0) {
        dataSource = "real";
      } else if (bucket.legacyFiles.length > 0) {
        dataSource = "sample_only";
      }

      statusByPortYear.set(key, {
        port,
        year,
        dataSource,
        realCsvFound: bucket.realFiles.length > 0,
        realFiles: [...bucket.realFiles].sort(),
        legacyFiles: [...bucket.legacyFiles].sort(),
      });
    }
  }

  return statusByPortYear;
}

function countRowsByPortMonth(rows) {
  const counts = new Map();

  for (const row of rows) {
    if (!row.arrival_date || row.arrival_date.length < 7) continue;
    const monthKey = `${row.port}|${row.arrival_date.slice(0, 7)}`;
    counts.set(monthKey, (counts.get(monthKey) ?? 0) + 1);
  }

  return counts;
}

module.exports = {
  PORT_ALIASES,
  MONTH_ALIASES,
  EXPECTED_SCHEDULE_PORTS,
  SCHEDULE_YEARS,
  SCHEDULE_YEAR,
  normalizePort,
  normalizeMonth,
  buildMonthPrefix,
  dedupeKey,
  inferPortFromFilename,
  inferYearFromFilename,
  isAuthoritativeScheduleFile,
  isRealScheduleFile,
  isLegacySampleScheduleFile,
  inspectRawScheduleSources,
  countRowsByPortMonth,
};
