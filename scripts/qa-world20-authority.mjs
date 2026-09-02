#!/usr/bin/env node
/**
 * World 2.0 authority QA checks — schedule integrity, URL families, CTA honesty.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};
const pass = (msg) => console.log(`PASS: ${msg}`);
const info = (msg) => console.log(`INFO: ${msg}`);

const payload = JSON.parse(
  readFileSync(join(ROOT, "src/data/cruise-schedules.generated.json"), "utf8"),
);
const rows = payload.rows;
const years = rows.reduce((acc, r) => {
  const y = r.arrival_date.slice(0, 4);
  acc[y] = (acc[y] || 0) + 1;
  return acc;
}, {});
const dates = rows.map((r) => r.arrival_date).sort();
const ports = new Set(rows.map((r) => r.port));
const ships = new Set(rows.map((r) => r.ship));

const expected = {
  total: 1848,
  y2026: 1128,
  y2027: 720,
  earliest: "2026-06-01",
  latest: "2027-12-30",
  ports: 15,
  ships: 91,
};

if (rows.length !== expected.total) fail(`total calls ${rows.length} != ${expected.total}`);
else pass(`total calls ${rows.length}`);
if ((years["2026"] || 0) !== expected.y2026) fail(`2026 ${years["2026"]}`);
else pass(`2026 calls ${years["2026"]}`);
if ((years["2027"] || 0) !== expected.y2027) fail(`2027 ${years["2027"]}`);
else pass(`2027 calls ${years["2027"]}`);
if (years["2028"]) fail("2028 schedule data present");
else pass("no 2028 schedule data");
if (dates[0] !== expected.earliest || dates.at(-1) !== expected.latest)
  fail(`date range ${dates[0]}..${dates.at(-1)}`);
else pass(`date range ${dates[0]} .. ${dates.at(-1)}`);
if (ports.size !== expected.ports) fail(`ports ${ports.size}`);
else pass(`ports ${ports.size}`);
if (ships.size !== expected.ships) fail(`ships ${ships.size}`);
else pass(`unique ships ${ships.size}`);

const requiredPaths = [
  "src/app/about/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/lib/image-provenance.ts",
];
for (const p of requiredPaths) {
  if (!existsSync(join(ROOT, p))) fail(`missing ${p}`);
  else pass(`exists ${p}`);
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name === ".next" || name === "out") continue;
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(name)) files.push(p);
  }
  return files;
}

const srcFiles = walk(join(ROOT, "src"));
const fakeBook = [];
const stripeHits = [];
for (const file of srcFiles) {
  const text = readFileSync(file, "utf8");
  if (/\bBOOK NOW\b|\bBook Now\b|Book a Tour|Start Cruise Planner/.test(text)) {
    // allow PDF helper historical strings only under pdf/
    if (!file.includes(`${join("src", "lib", "pdf")}`)) {
      fakeBook.push(file.replace(ROOT + "/", ""));
    }
  }
  if (/stripe|Stripe|checkout\.sessions|workers\/payments/i.test(text)) {
    stripeHits.push(file.replace(ROOT + "/", ""));
  }
}
if (fakeBook.length) fail(`misleading CTA language in:\n  ${fakeBook.join("\n  ")}`);
else pass("no BOOK NOW / Book a Tour / Start Cruise Planner in non-PDF src");
if (stripeHits.length) fail(`payment refs:\n  ${stripeHits.join("\n  ")}`);
else pass("no Stripe/payment infrastructure refs in src");

info(`canonical domain expected: https://norwayshoreexcursions.com`);
info(`schedule generatedAt: ${payload.generatedAt}`);
info(`schedule source: ${payload.source}`);

if (process.exitCode) {
  console.error("\nQA FAILED");
  process.exit(1);
}
console.log("\nQA PASSED");
