#!/usr/bin/env node
/**
 * Writes data/ships/ship-images-on-disk.json from JPG files in public/images/ships/.
 * Run: npm run sync:ship-images
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SHIPS_DIR = path.join(ROOT, "public", "images", "ships");
const OUT = path.join(ROOT, "data", "ships", "ship-images-on-disk.json");

function main() {
  const slugs = [];

  if (fs.existsSync(SHIPS_DIR)) {
    for (const entry of fs.readdirSync(SHIPS_DIR)) {
      if (!/\.jpe?g$/i.test(entry)) continue;
      slugs.push(entry.replace(/\.jpe?g$/i, "").toLowerCase());
    }
  }

  slugs.sort();
  fs.writeFileSync(OUT, `${JSON.stringify(slugs, null, 2)}\n`);
  console.log(`Synced ${slugs.length} ship image(s) on disk → data/ships/ship-images-on-disk.json`);
}

main();
