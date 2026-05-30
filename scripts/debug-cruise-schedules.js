/**
 * Debug cruise schedule rows for a port/month.
 *
 * Usage:
 *   node scripts/debug-cruise-schedules.js flam 2026 6
 *   node scripts/debug-cruise-schedules.js bergen 2026 7
 */

const path = require("node:path");

const {
  buildMonthPrefix,
  normalizeMonth,
  normalizePort,
} = require("./cruise-schedule-utils");

const GENERATED_JSON = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "cruise-schedules.generated.json",
);

function loadPayload() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(GENERATED_JSON);
}

function main() {
  const [portArg, yearArg, monthArg] = process.argv.slice(2);

  if (!portArg || !yearArg || !monthArg) {
    console.error("Usage: node scripts/debug-cruise-schedules.js <port> <year> <month>");
    console.error("Example: node scripts/debug-cruise-schedules.js flam 2026 6");
    process.exit(1);
  }

  const port = normalizePort(portArg);
  const year = String(yearArg).trim();
  const month = normalizeMonth(monthArg);
  const prefix = buildMonthPrefix(year, month);
  const payload = loadPayload();
  const rows = payload.rows ?? [];
  const portStatus = payload.portStatus?.[port];

  if (portStatus) {
    console.log(`Data source: ${portStatus.dataSource}`);
    console.log(`Display status: ${portStatus.displayStatus}`);
    console.log(`Real CSV found: ${portStatus.realCsvFound ? "yes" : "no"}`);
    console.log(`Total rows for port: ${portStatus.rowCount}`);
    console.log("");
  }

  if (portStatus && portStatus.displayStatus !== "real_data_available") {
    console.log("No real schedule data imported for this port.");
    console.log(`Add ${port}-cruise-schedule-${year}.csv to data/cruise-schedules/raw/`);
    process.exit(0);
  }

  const portRows = rows
    .filter((row) => normalizePort(row.port) === port)
    .sort((a, b) => {
      if (a.arrival_date !== b.arrival_date) {
        return a.arrival_date.localeCompare(b.arrival_date);
      }
      const timeA = a.arrival_time ?? "99:99";
      const timeB = b.arrival_time ?? "99:99";
      return timeA.localeCompare(timeB);
    });

  const monthRows = portRows.filter((row) => row.arrival_date.startsWith(prefix));

  console.log(`Port: ${port}`);
  console.log(`Month filter: ${prefix} (${monthArg} normalised to ${month})`);
  console.log(`Total rows for port: ${portRows.length}`);
  console.log(`Matching ship calls: ${monthRows.length}\n`);

  if (monthRows.length === 0) {
    console.log("No matching rows found.");
    process.exit(0);
  }

  for (const row of monthRows) {
    console.log(
      [
        row.arrival_date,
        row.arrival_time ?? "TBC",
        row.ship,
        row.cruise_line || "Cruise line not published",
        row.departure_time ? `departs ${row.departure_time}` : "departure TBC",
        row.all_aboard_time
          ? `all aboard ${row.all_aboard_time}`
          : "all aboard not published",
      ].join(" · "),
    );
  }
}

main();
