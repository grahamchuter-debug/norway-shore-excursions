/**
 * Fetch approved CruiseTimetables schedule pages listed in Norway Ship Schedule.xlsx
 * and write raw CSV files for npm run import:schedules.
 *
 * Usage:
 *   node scripts/batch-fetch-schedules-from-excel.js [--year 2027] [--first-page-only] [--delay-ms 3000]
 *
 * Manual workflow only — review CSV output before production import.
 */

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const DEFAULT_EXCEL = path.join(
  process.env.HOME ?? "",
  "Downloads",
  "Norway Ship Schedule.xlsx",
);
const RAW_DIR = path.join(ROOT, "data", "cruise-schedules", "raw");
const PARSE_SCRIPT = path.join(__dirname, "parse-cruisetimetables-schedule.js");

const PORT_ALIASES = {
  flam: "flam",
  bergen: "bergen",
  olden: "olden",
  geiranger: "geiranger",
  eidfjord: "eidfjord",
  nordfjordeid: "nordfjordeid",
  skjolden: "skjolden",
  hellesylt: "hellesylt",
  stavanger: "stavanger",
  alesund: "alesund",
  molde: "molde",
  trondheim: "trondheim",
  honningsvag: "honningsvag",
  tromso: "tromso",
  kristiansand: "kristiansand",
};

const MONTH_TOKEN_TO_NAME = {
  jan: "january",
  feb: "february",
  mar: "march",
  apr: "april",
  may: "may",
  jun: "june",
  jul: "july",
  aug: "august",
  sep: "september",
  oct: "october",
  nov: "november",
  dec: "december",
};

function parseArgs(argv) {
  const options = {
    year: "2027",
    excelPath: DEFAULT_EXCEL,
    firstPageOnly: true,
    delayMs: 8000,
    force: false,
    continueOnError: true,
    failureCooldownMs: 600000,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--year") {
      options.year = argv[i + 1] ?? options.year;
      i += 1;
    } else if (arg === "--excel") {
      options.excelPath = path.resolve(argv[i + 1] ?? options.excelPath);
      i += 1;
    } else if (arg === "--first-page-only") {
      options.firstPageOnly = true;
    } else if (arg === "--all-pages") {
      options.firstPageOnly = false;
    } else if (arg === "--delay-ms") {
      options.delayMs = Number(argv[i + 1] ?? options.delayMs);
      i += 1;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--fail-fast") {
      options.continueOnError = false;
    } else if (arg === "--failure-cooldown-ms") {
      options.failureCooldownMs = Number(argv[i + 1] ?? options.failureCooldownMs);
      i += 1;
    }
  }

  return options;
}

function readExcelSharedStrings(excelPath) {
  const AdmZip = null;
  // Use built-in zlib via child python for portability (no extra deps)
  const result = spawnSync(
    "python3",
    [
      "-c",
      `
import zipfile, xml.etree.ElementTree as ET, json, sys
path = sys.argv[1]
with zipfile.ZipFile(path) as z:
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    strings = []
    for si in root.findall('.//m:si', ns):
        texts = [t.text or '' for t in si.findall('.//m:t', ns)]
        strings.append(''.join(texts))
print(json.dumps(strings))
`,
      excelPath,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || "Failed to read Excel shared strings");
  }

  return JSON.parse(result.stdout.trim());
}

function inferMonthName(monthToken) {
  const token = String(monthToken).toLowerCase();
  const embedded = /(\d{2})?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.exec(
    token,
  );
  if (!embedded) return null;
  return MONTH_TOKEN_TO_NAME[embedded[2]] ?? null;
}

function extractUrls(strings, targetYear) {
  const urls = [];
  const pattern =
    /^https:\/\/www\.cruisetimetables\.com\/visiting([a-z]+)norway-([a-z0-9]+)(\d{4})\.html$/i;

  for (const value of strings) {
    const match = pattern.exec(String(value).trim());
    if (!match) continue;

    const [, portRaw, monthToken, year] = match;
    if (year !== targetYear) continue;

    const port = PORT_ALIASES[portRaw.toLowerCase()] ?? portRaw.toLowerCase();
    const monthName = inferMonthName(monthToken);
    if (!monthName) {
      console.warn(`Skipping unrecognised month token "${monthToken}" in ${value}`);
      continue;
    }

    urls.push({
      url: value.trim(),
      port,
      monthName,
      year,
      outputFile: `${port}-cruise-schedule-${monthName}-${year}.csv`,
    });
  }

  return urls.sort(
    (a, b) =>
      a.port.localeCompare(b.port) ||
      a.monthName.localeCompare(b.monthName) ||
      a.url.localeCompare(b.url),
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOne(entry, options) {
  const outputPath = path.join(RAW_DIR, entry.outputFile);
  if (!options.force && fs.existsSync(outputPath)) {
    const existing = fs.readFileSync(outputPath, "utf8").trim().split("\n");
    if (existing.length > 1) {
      console.log(`Skip existing ${entry.outputFile} (${existing.length - 1} rows)`);
      return { skipped: true, rows: existing.length - 1, failed: false };
    }
  }

  const args = [PARSE_SCRIPT];
  if (options.firstPageOnly) args.push("--first-page-only");
  args.push(entry.url, outputPath);

  const result = spawnSync("node", args, { encoding: "utf8", cwd: ROOT });
  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    if (!options.continueOnError) {
      throw new Error(`Failed to fetch ${entry.url}`);
    }
    console.warn(`Warning: failed to fetch ${entry.url}; continuing batch.`);
    return { skipped: false, rows: 0, failed: true };
  }

  const lines = fs.readFileSync(outputPath, "utf8").trim().split("\n");
  const rows = Math.max(0, lines.length - 1);
  console.log(`Wrote ${entry.outputFile}: ${rows} rows`);
  return { skipped: false, rows, failed: false };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(options.excelPath)) {
    throw new Error(`Excel file not found: ${options.excelPath}`);
  }

  fs.mkdirSync(RAW_DIR, { recursive: true });

  const strings = readExcelSharedStrings(options.excelPath);
  const entries = extractUrls(strings, options.year);

  console.log(
    `Batch fetch for ${options.year}: ${entries.length} schedule pages from ${options.excelPath}`,
  );
  console.log(
    `Mode: ${options.firstPageOnly ? "first page only" : "all pages"}, delay ${options.delayMs}ms\n`,
  );

  let fetched = 0;
  let skipped = 0;
  let failed = 0;
  let totalRows = 0;
  const failedEntries = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    console.log(`[${index + 1}/${entries.length}] ${entry.port} ${entry.monthName} ${entry.year}`);
    const result = await fetchOne(entry, options);
    if (result.failed) {
      failed += 1;
      failedEntries.push(entry);
      if (options.failureCooldownMs > 0) {
        console.log(
          `Cooling down ${options.failureCooldownMs / 1000}s after fetch failure before next page...`,
        );
        await sleep(options.failureCooldownMs);
      }
    } else if (result.skipped) {
      skipped += 1;
    } else {
      fetched += 1;
    }
    totalRows += result.rows;

    if (index < entries.length - 1 && options.delayMs > 0) {
      await sleep(options.delayMs);
    }
  }

  console.log(
    `\nDone. fetched=${fetched}, skipped=${skipped}, failed=${failed}, totalRows=${totalRows}, year=${options.year}`,
  );

  if (failedEntries.length > 0) {
    console.log("\nFailed URLs (re-run batch to retry):");
    for (const entry of failedEntries) {
      console.log(`  ${entry.outputFile} -> ${entry.url}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
