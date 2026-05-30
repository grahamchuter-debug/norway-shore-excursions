/**
 * Debug ship passenger capacity matching for imported schedules.
 *
 * Usage:
 *   npm run debug:ships
 */

const path = require("node:path");

const {
  findShipCapacity,
  formatPassengersLabel,
  loadShipCapacities,
} = require("./ship-capacity-utils");

const GENERATED_JSON = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "cruise-schedules.generated.json",
);

function loadRows() {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(GENERATED_JSON).rows;
}

function main() {
  const rows = loadRows();
  const lookup = loadShipCapacities();

  const shipStats = new Map();

  for (const row of rows) {
    const existing = shipStats.get(row.ship) ?? {
      ship: row.ship,
      scheduleRows: 0,
      rowsWithPassengers: 0,
      rowsMissingPassengers: 0,
      cruiseLines: new Set(),
      samplePassengers: null,
    };

    existing.scheduleRows += 1;
    if (row.passengers != null) {
      existing.rowsWithPassengers += 1;
      if (existing.samplePassengers == null) {
        existing.samplePassengers = row.passengers;
      }
    } else {
      existing.rowsMissingPassengers += 1;
    }
    if (row.cruise_line) {
      existing.cruiseLines.add(row.cruise_line);
    }
    shipStats.set(row.ship, existing);
  }

  console.log(`Unique ships in schedules: ${shipStats.size}\n`);

  const sortedShips = [...shipStats.values()].sort((a, b) =>
    a.ship.localeCompare(b.ship),
  );

  let matchedCount = 0;
  let unmatchedCount = 0;
  let rowsMissing = 0;

  for (const stat of sortedShips) {
    const cruiseLine = [...stat.cruiseLines][0] ?? "";
    const masterMatch = findShipCapacity(stat.ship, cruiseLine, lookup);
    rowsMissing += stat.rowsMissingPassengers;

    if (masterMatch) {
      matchedCount += 1;
    } else {
      unmatchedCount += 1;
    }

    const capacityLabel =
      stat.samplePassengers != null
        ? formatPassengersLabel(stat.samplePassengers)
        : "Not published";

    console.log(
      [
        stat.ship,
        masterMatch ? "capacity matched" : "capacity unmatched",
        capacityLabel,
        `${stat.scheduleRows} schedule row${stat.scheduleRows === 1 ? "" : "s"}`,
      ].join(" · "),
    );
  }

  console.log("\nSummary:");
  console.log(`  Ships with master capacity match: ${matchedCount}`);
  console.log(`  Ships without master capacity match: ${unmatchedCount}`);
  console.log(`  Schedule rows missing passengers: ${rowsMissing}`);
}

main();
