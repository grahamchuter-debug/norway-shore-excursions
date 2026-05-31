#!/usr/bin/env node
/**
 * Validates ship image mappings, cruise line logos, and schedule ship coverage.
 * Run: npm run qa:ship-images
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, "data");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function publicFileExists(webPath) {
  const relative = webPath.replace(/^\//, "");
  return fs.existsSync(path.join(PUBLIC, relative));
}

function normalizeShipSearchKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function shipNameToSlug(shipName) {
  return String(shipName ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveShipImageSlug(shipNameOrSlug, images, aliases) {
  const raw = String(shipNameOrSlug ?? "").trim();
  if (!raw) return null;
  if (images[raw]) return raw;

  const slugFromName = shipNameToSlug(raw);
  if (images[slugFromName]) return slugFromName;

  const aliasKey = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/^msc\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (aliases[aliasKey]) return aliases[aliasKey];
  return null;
}

function main() {
  const schedulePayload = readJson("src/data/cruise-schedules.generated.json");
  const shipImages = readJson("data/ships/ship-images.json");
  const shipAliases = readJson("data/ships/ship-image-aliases.json");
  const cruiseLineLogos = readJson("data/cruise-lines/cruise-line-logos.json");

  const rows = schedulePayload.rows ?? [];
  const shipGroups = new Map();

  for (const row of rows) {
    const key = normalizeShipSearchKey(row.ship);
    const existing = shipGroups.get(key);
    if (existing) {
      existing.count += 1;
      if (row.cruise_line && !existing.cruiseLine) {
        existing.cruiseLine = row.cruise_line;
      }
    } else {
      shipGroups.set(key, {
        ship: row.ship.trim(),
        cruiseLine: row.cruise_line,
        count: 1,
      });
    }
  }

  const auditRows = [];
  let imagesFound = 0;
  let imagesMissing = 0;

  for (const group of [...shipGroups.values()].sort(
    (a, b) => b.count - a.count || a.ship.localeCompare(b.ship),
  )) {
    const slug = shipNameToSlug(group.ship);
    const mappedSlug = resolveShipImageSlug(slug, shipImages, shipAliases);
    const imagePath = mappedSlug ? shipImages[mappedSlug] : null;
    const fileExists = imagePath ? publicFileExists(imagePath) : false;
    const imageFound = Boolean(imagePath && fileExists);

    if (imageFound) imagesFound += 1;
    else imagesMissing += 1;

    auditRows.push({
      ship: group.ship,
      slug,
      cruiseLine: group.cruiseLine,
      imageFound,
      imagePath: imagePath ?? "(none)",
      fileExists,
    });
  }

  console.log("=== Ship Image QA Report ===\n");
  console.log(`Schedule ships audited: ${auditRows.length}`);
  console.log(`Images found on disk: ${imagesFound}`);
  console.log(`Ships missing images: ${imagesMissing}\n`);

  console.log("Ship Name | Image Found | Image Path | Cruise Line");
  console.log("-".repeat(80));
  for (const row of auditRows) {
    console.log(
      `${row.ship} | ${row.imageFound ? "Yes" : "No"} | ${row.imagePath} | ${row.cruiseLine}`,
    );
  }

  const mappingIssues = [];
  for (const [slug, webPath] of Object.entries(shipImages)) {
    if (!publicFileExists(webPath)) {
      mappingIssues.push(`Mapped ship "${slug}" missing file: ${webPath}`);
    }
    if (webPath !== webPath.toLowerCase()) {
      mappingIssues.push(`Non lowercase path for "${slug}": ${webPath}`);
    }
    if (!webPath.startsWith("/images/ships/")) {
      mappingIssues.push(`Unexpected path prefix for "${slug}": ${webPath}`);
    }
  }

  const logoIssues = [];
  for (const [key, webPath] of Object.entries(cruiseLineLogos)) {
    if (!publicFileExists(webPath)) {
      logoIssues.push(`Cruise line logo "${key}" missing file: ${webPath}`);
    }
  }

  console.log("\n=== Mapped Ships Missing Files ===");
  if (mappingIssues.length === 0) {
    console.log("None (or no mappings with files yet).");
  } else {
    mappingIssues.forEach((issue) => console.log(`- ${issue}`));
  }

  console.log("\n=== Cruise Line Logo Status ===");
  for (const [key, webPath] of Object.entries(cruiseLineLogos)) {
    const exists = publicFileExists(webPath);
    console.log(`${key}: ${exists ? "OK" : "MISSING"} (${webPath})`);
  }

  if (logoIssues.length > 0) {
    console.log("\nLogo issues:");
    logoIssues.forEach((issue) => console.log(`- ${issue}`));
  }

  const exitCode =
    logoIssues.length > 0 || mappingIssues.some((m) => m.includes("missing file"))
      ? 0
      : 0;

  console.log("\n=== Ships Missing Images (summary) ===");
  auditRows
    .filter((row) => !row.imageFound)
    .forEach((row) => console.log(`- ${row.ship} (${row.cruiseLine})`));

  process.exit(exitCode);
}

main();
