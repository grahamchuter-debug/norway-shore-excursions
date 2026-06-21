/**
 * Cruise schedule CSV import pipeline (Norway Shore Excursions).
 *
 * Reusable pattern for other destination sites (Caribbean, Alaska, Canada,
 * Mediterranean): keep raw CSV in data/cruise-schedules/raw/, adjust
 * REGION_SLUG + PORT_ALIASES + SHIP_ALIASES, then run this script.
 *
 * Supported raw CSV formats:
 * 1. Full format with port, ship, cruise_line, passengers, arrival_date, etc.
 * 2. Manual port schedule format inferred from filename, e.g.
 *    flam-cruise-schedule-2026.csv with columns:
 *    date, ship, arrival, departure, cruiseline
 *
 * Sample CSV files live in data/cruise-schedules/raw/samples/ and are ignored.
 * Legacy {port}-2026.csv files are also ignored — they must never appear on live pages.
 *
 * Real schedule files use:
 *   {port}-cruise-schedule-2026.csv
 *   {port}-cruise-schedule-july-2026.csv
 *
 * Sample data must never be used on live production schedule pages.
 *
 * Passenger counts: if a schedule row has no passengers value, the import fills
 * it from data/cruise-schedules/ship-capacities.csv (manual master lookup).
 *
 * Do NOT scrape third party sites automatically. Paste or export approved
 * schedule data into CSV files manually.
 */

const fs = require("node:fs");
const path = require("node:path");

const {
  countRowsByPortMonth,
  dedupeKey,
  EXPECTED_SCHEDULE_PORTS,
  inferPortFromFilename,
  inspectRawScheduleSources,
  isLegacySampleScheduleFile,
  isRealScheduleFile,
  normalizePort,
  SCHEDULE_YEARS,
} = require("./cruise-schedule-utils");
const {
  enrichSchedulePassengers,
  loadShipCapacities,
} = require("./ship-capacity-utils");

const ROOT = path.join(__dirname, "..");
const RAW_DIR = path.join(ROOT, "data", "cruise-schedules", "raw");
const SAMPLES_DIR = path.join(RAW_DIR, "samples");
const CLEAN_CSV_DIR = path.join(ROOT, "data", "cruise-schedules");
const PUBLIC_JSON_DIR = path.join(ROOT, "public", "data", "cruise-schedules");
const GENERATED_JSON = path.join(ROOT, "src", "data", "cruise-schedules.generated.json");

const REGION_SLUG = "norway";

const EXPECTED_COLUMNS = [
  "port",
  "ship",
  "cruise_line",
  "passengers",
  "arrival_date",
  "arrival_time",
  "departure_time",
  "all_aboard_time",
  "source",
  "source_url",
  "source_checked",
  "notes",
];

const HEADER_ALIASES = {
  date: "arrival_date",
  arrival: "arrival_time",
  departure: "departure_time",
  cruiseline: "cruise_line",
  cruise_line: "cruise_line",
  port: "port",
  ship: "ship",
  passengers: "passengers",
  all_aboard: "all_aboard_time",
  all_aboard_time: "all_aboard_time",
  source: "source",
  source_url: "source_url",
  source_checked: "source_checked",
  notes: "notes",
};

const SHIP_ALIASES = {
  iona: "Iona",
  "p&o iona": "Iona",
  "ms iona": "Iona",
  arvia: "Arvia",
  "p&o arvia": "Arvia",
  "ms arvia": "Arvia",
  "norwegian prima": "Norwegian Prima",
  prima: "Norwegian Prima",
  "msc euribia": "MSC Euribia",
  euribia: "MSC Euribia",
  "msc magnifica": "MSC Magnifica",
  magnifica: "MSC Magnifica",
  "celebrity apex": "Celebrity Apex",
  apex: "Celebrity Apex",
  aidanova: "AIDAnova",
  aidaprima: "AIDAprima",
  aidaluna: "AIDAluna",
  "ms rotterdam": "Rotterdam",
  rotterdam: "Rotterdam",
};

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

function normalizeHeader(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function normalizeShip(value) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";

  const key = trimmed.toLowerCase();
  if (SHIP_ALIASES[key]) return SHIP_ALIASES[key];

  return trimmed;
}

function normalizeDate(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const ukMatch = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(trimmed);
  if (ukMatch) {
    const day = ukMatch[1].padStart(2, "0");
    const month = ukMatch[2].padStart(2, "0");
    return `${ukMatch[3]}-${month}-${day}`;
  }

  return trimmed;
}

function isTbcValue(value) {
  const trimmed = String(value ?? "").trim().toLowerCase();
  return trimmed === "" || trimmed === "tbc" || trimmed === "tb" || trimmed === "tba";
}

function normalizeTimeField(value) {
  if (isTbcValue(value)) return null;

  const trimmed = String(value ?? "").trim();
  const match = /^(\d{1,2})[:.](\d{2})$/.exec(trimmed);
  if (!match) return null;

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function parsePassengers(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function rowToObject(headers, cells) {
  const record = {};
  headers.forEach((header, index) => {
    const mappedHeader = HEADER_ALIASES[header] ?? header;
    record[mappedHeader] = cells[index]?.trim() ?? "";
  });
  return record;
}

function buildTbcNotes(raw) {
  const notes = [];
  if (isTbcValue(raw.arrival_time)) notes.push("Arrival time TBC");
  if (isTbcValue(raw.departure_time)) notes.push("Departure time TBC");
  if (isTbcValue(raw.all_aboard_time)) notes.push("All aboard time TBC");
  return notes;
}

function normalizeRow(raw, fileMeta) {
  const port =
    normalizePort(raw.port ?? "") || inferPortFromFilename(fileMeta.file);
  const ship = normalizeShip(raw.ship ?? "");
  const cruiseLine = (raw.cruise_line ?? "").trim();
  const arrivalDate = normalizeDate(raw.arrival_date ?? "");
  const arrivalTime = normalizeTimeField(raw.arrival_time ?? "");
  const departureTime = normalizeTimeField(raw.departure_time ?? "");
  const allAboardTime = normalizeTimeField(raw.all_aboard_time ?? "");
  const sourceChecked = normalizeDate(raw.source_checked ?? "");
  const tbcNotes = buildTbcNotes(raw);
  const manualNotes = (raw.notes ?? "").trim();
  const notes = [manualNotes, ...tbcNotes].filter(Boolean).join("; ");

  if (!port || !ship || !arrivalDate) {
    return null;
  }

  return {
    port,
    ship,
    cruise_line: cruiseLine,
    passengers: parsePassengers(raw.passengers ?? ""),
    arrival_date: arrivalDate,
    arrival_time: arrivalTime,
    departure_time: departureTime,
    all_aboard_time: allAboardTime,
    source: (raw.source ?? "").trim() || "Manual CSV import",
    source_url: (raw.source_url ?? "").trim(),
    source_checked: sourceChecked || null,
    notes,
  };
}

function escapeCsv(value) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function rowsToCsv(rows) {
  const headerLine = EXPECTED_COLUMNS.join(",");
  const lines = rows.map((row) =>
    EXPECTED_COLUMNS.map((column) => escapeCsv(row[column])).join(","),
  );
  return `${headerLine}\n${lines.join("\n")}\n`;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readRawCsvFiles() {
  if (!fs.existsSync(RAW_DIR)) {
    throw new Error(`Missing raw directory: ${RAW_DIR}`);
  }

  const sourceStatus = inspectRawScheduleSources(RAW_DIR);
  const selectedFiles = [];

  console.log("Raw schedule source status:");
  for (const port of EXPECTED_SCHEDULE_PORTS) {
    for (const year of SCHEDULE_YEARS) {
      const key = `${port}|${year}`;
      const status = sourceStatus.get(key);
      if (!status) continue;

      const realLabel = status.realCsvFound ? "yes" : "no";
      const dataSourceLabel =
        status.dataSource === "real"
          ? "Real schedule imported"
          : status.dataSource === "sample_only"
            ? "Sample data only (skipped)"
            : "No schedule imported";

      console.log(`  ${port} ${year}: real CSV found: ${realLabel} — ${dataSourceLabel}`);

      if (status.legacyFiles.length > 0) {
        for (const legacyFile of status.legacyFiles) {
          console.log(
            `    Skipping legacy sample file ${legacyFile} (use ${port}-cruise-schedule-${year}.csv instead)`,
          );
        }
      }

      for (const realFile of status.realFiles) {
        selectedFiles.push({
          file: realFile,
          content: fs.readFileSync(path.join(RAW_DIR, realFile), "utf8"),
        });
      }
    }
  }

  const ignoredFiles = fs
    .readdirSync(RAW_DIR)
    .filter(
      (file) =>
        file.toLowerCase().endsWith(".csv") &&
        !isRealScheduleFile(file) &&
        !isLegacySampleScheduleFile(file),
    );

  for (const ignoredFile of ignoredFiles) {
    console.log(`  Skipping unrecognised CSV: ${ignoredFile}`);
  }

  return { selectedFiles, sourceStatus };
}

function buildPortStatusMeta(rows, sourceStatus) {
  const portStatus = {};

  for (const port of EXPECTED_SCHEDULE_PORTS) {
    const portRows = rows.filter((row) => row.port === port);
    const hasRealSource = SCHEDULE_YEARS.some((year) => {
      const source = sourceStatus.get(`${port}|${year}`);
      return source?.dataSource === "real";
    });
    const monthsAvailable = [
      ...new Set(
        portRows
          .map((row) => row.arrival_date.slice(0, 7))
          .filter(Boolean),
      ),
    ].sort();
    const dataSource =
      hasRealSource && portRows.length > 0
        ? "real"
        : SCHEDULE_YEARS.some(
              (year) => sourceStatus.get(`${port}|${year}`)?.dataSource === "sample_only",
            )
          ? "sample_only"
          : "none";

    portStatus[port] = {
      dataSource,
      realCsvFound: hasRealSource,
      rowCount: portRows.length,
      monthsAvailable,
      pagesGenerated: monthsAvailable.length,
      displayStatus:
        dataSource === "real"
          ? "real_data_available"
          : dataSource === "sample_only"
            ? "coming_soon"
            : "no_data",
    };
  }

  return portStatus;
}

function removeStalePortOutputs(activePortYearKeys) {
  for (const port of EXPECTED_SCHEDULE_PORTS) {
    for (const year of SCHEDULE_YEARS) {
      const key = `${port}-${year}`;
      if (activePortYearKeys.has(key)) continue;

      const csvPath = path.join(CLEAN_CSV_DIR, `${key}.csv`);
      const jsonPath = path.join(PUBLIC_JSON_DIR, `${key}.json`);

      if (fs.existsSync(csvPath)) {
        fs.unlinkSync(csvPath);
        console.log(`Removed stale clean CSV: ${key}.csv`);
      }
      if (fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath);
        console.log(`Removed stale public JSON: ${key}.json`);
      }
    }
  }
}

function parseRawFile(content) {
  const sanitized = content.replace(/^\uFEFF/, "");
  const table = parseCsv(sanitized);
  if (table.length === 0) return [];

  const headers = table[0].map(normalizeHeader);
  return table.slice(1).map((cells) => rowToObject(headers, cells));
}

function logPortMonthBreakdown(rows, portFilter) {
  const monthCounts = countRowsByPortMonth(rows);
  for (const [monthKey, count] of [...monthCounts.entries()].sort()) {
    const [port, yearMonth] = monthKey.split("|");
    if (portFilter && port !== portFilter) continue;
    console.log(`  ${port} ${yearMonth}: ${count} ship call${count === 1 ? "" : "s"}`);
  }
}

function main() {
  console.log("Cruise schedule import starting...\n");

  const { selectedFiles: rawFiles, sourceStatus } = readRawCsvFiles();
  const normalizedRows = [];
  const seen = new Set();
  let totalRawRows = 0;
  let totalSkipped = 0;
  let totalDupes = 0;

  console.log("");

  for (const fileMeta of rawFiles) {
    const rawRows = parseRawFile(fileMeta.content);
    totalRawRows += rawRows.length;
    let fileImported = 0;
    let fileSkipped = 0;
    let fileDupes = 0;

    const fileImportedRows = [];

    for (const rawRow of rawRows) {
      const row = normalizeRow(rawRow, fileMeta);
      if (!row) {
        fileSkipped += 1;
        totalSkipped += 1;
        console.warn(`Skipped invalid row in ${fileMeta.file}`);
        continue;
      }

      const key = dedupeKey(row);
      if (seen.has(key)) {
        fileDupes += 1;
        totalDupes += 1;
        continue;
      }
      seen.add(key);
      normalizedRows.push(row);
      fileImportedRows.push(row);
      fileImported += 1;
    }

    console.log(
      `Raw ${fileMeta.file}: ${rawRows.length} rows read, ${fileImported} imported, ${fileSkipped} skipped, ${fileDupes} duplicate rows dropped`,
    );

    if (fileImportedRows.length > 0) {
      const port = fileImportedRows[0].port;
      console.log(`  ${port} rows from ${fileMeta.file}:`);
      logPortMonthBreakdown(fileImportedRows, port);
    }
  }

  console.log(
    `\nImport totals: ${totalRawRows} raw rows, ${normalizedRows.length} cleaned rows, ${totalSkipped} skipped, ${totalDupes} duplicates dropped`,
  );

  const capacityLookup = loadShipCapacities();
  const capacityStats = enrichSchedulePassengers(normalizedRows, capacityLookup);

  console.log("\nShip capacity enrichment:");
  console.log(`  Rows with passengers from schedule CSV: ${capacityStats.keptFromSchedule}`);
  console.log(`  Rows enriched from ship-capacities.csv: ${capacityStats.enrichedFromMaster}`);
  console.log(`  Rows still missing capacity (Not published): ${capacityStats.stillMissing}`);
  if (capacityStats.unmatchedShips.length > 0) {
    console.log("  Unmatched ship names:");
    for (const ship of capacityStats.unmatchedShips) {
      console.log(`    - ${ship}`);
    }
  }

  normalizedRows.sort((a, b) => {
    if (a.port !== b.port) return a.port.localeCompare(b.port);
    if (a.arrival_date !== b.arrival_date) return a.arrival_date.localeCompare(b.arrival_date);
    const timeA = a.arrival_time ?? "99:99";
    const timeB = b.arrival_time ?? "99:99";
    if (timeA !== timeB) return timeA.localeCompare(timeB);
    return a.ship.localeCompare(b.ship);
  });

  ensureDir(CLEAN_CSV_DIR);
  ensureDir(PUBLIC_JSON_DIR);
  ensureDir(SAMPLES_DIR);
  ensureDir(path.dirname(GENERATED_JSON));

  const byPortYear = new Map();
  for (const row of normalizedRows) {
    const year = row.arrival_date.slice(0, 4);
    const key = `${row.port}-${year}`;
    if (!byPortYear.has(key)) byPortYear.set(key, []);
    byPortYear.get(key).push(row);
  }

  const activePortYearKeys = new Set(byPortYear.keys());
  removeStalePortOutputs(activePortYearKeys);

  for (const [key, rows] of byPortYear.entries()) {
    const csvPath = path.join(CLEAN_CSV_DIR, `${key}.csv`);
    const jsonPath = path.join(PUBLIC_JSON_DIR, `${key}.json`);
    fs.writeFileSync(csvPath, rowsToCsv(rows), "utf8");
    fs.writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
    console.log(`Clean rows for ${key}: ${rows.length}`);
  }

  const portStatus = buildPortStatusMeta(normalizedRows, sourceStatus);

  console.log("\nImport summary by port:");
  for (const port of EXPECTED_SCHEDULE_PORTS) {
    const status = portStatus[port];
    const sourceLabel =
      status.dataSource === "real"
        ? "Real schedule imported"
        : status.dataSource === "sample_only"
          ? "Sample data only"
          : "No schedule imported";
    console.log(`  ${port}:`);
    console.log(`    real CSV found: ${status.realCsvFound ? "yes" : "no"}`);
    console.log(`    status: ${sourceLabel}`);
    console.log(`    rows imported: ${status.rowCount}`);
    console.log(
      `    months available: ${status.monthsAvailable.length > 0 ? status.monthsAvailable.join(", ") : "none"}`,
    );
    console.log(`    pages generated: ${status.pagesGenerated}`);
  }

  const yearTotals = Object.fromEntries(
    SCHEDULE_YEARS.map((year) => [
      year,
      normalizedRows.filter((row) => row.arrival_date.startsWith(`${year}-`)).length,
    ]),
  );
  console.log("\nImport totals by year:");
  for (const [year, count] of Object.entries(yearTotals)) {
    console.log(`  ${year}: ${count} visits`);
  }

  console.log("\nRows per port and month (real data only):");
  logPortMonthBreakdown(normalizedRows);

  const payload = {
    region: REGION_SLUG,
    generatedAt: new Date().toISOString(),
    source: "CSV import pipeline",
    rowCount: normalizedRows.length,
    ports: [...new Set(normalizedRows.map((row) => row.port))].sort(),
    portStatus,
    rows: normalizedRows,
  };

  fs.writeFileSync(GENERATED_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    path.join(PUBLIC_JSON_DIR, "index.json"),
    `${JSON.stringify(
      {
        region: payload.region,
        generatedAt: payload.generatedAt,
        rowCount: payload.rowCount,
        ports: payload.ports,
        portStatus: payload.portStatus,
        files: [...byPortYear.keys()].map((key) => `${key}.json`),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const capacityJsonPath = path.join(ROOT, "src", "data", "ship-capacities.generated.json");
  const capacityRecords = capacityLookup.records.map((record) => ({
    ship: record.ship,
    shipAliases: record.shipAliases,
    cruiseLine: record.cruiseLine,
    passengers: record.passengers,
  }));
  fs.writeFileSync(
    capacityJsonPath,
    `${JSON.stringify(
      { generatedAt: new Date().toISOString(), records: capacityRecords },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`\nImported ${normalizedRows.length} schedule rows`);
  console.log(`Clean CSV: ${CLEAN_CSV_DIR}`);
  console.log(`Public JSON: ${PUBLIC_JSON_DIR}`);
  console.log(`App JSON: ${GENERATED_JSON}`);
  console.log(`Ship capacities JSON: ${capacityJsonPath}`);
  console.log(`Sample CSV (ignored): ${SAMPLES_DIR}`);
}

main();
