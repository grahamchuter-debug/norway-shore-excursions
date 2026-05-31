/**
 * Convert an approved CruiseTimetables port schedule HTML page into raw CSV.
 *
 * Manual workflow (not part of automatic import):
 *   node scripts/parse-cruisetimetables-schedule.js <url> <output.csv>
 *
 * Supports:
 * - Bergen-style pages: bergennorwayschedule-jun2026.html (psovde-listing)
 * - Stavanger-style pages: visitingstavangernorway-jun2026.html (cd-listing + pagination)
 *
 * Paste or export approved schedule pages only. Review CSV before import.
 */

const fs = require("node:fs");
const path = require("node:path");

const DAY_ABBREVS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_MAP = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const MONTH_NAME_MAP = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function buildDayMap(year, month) {
  const dayMap = new Map();
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekday = new Date(year, month - 1, day).getDay();
    const label = `${DAY_ABBREVS[weekday]} ${day}`;
    const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dayMap.set(label, isoDate);
  }

  return dayMap;
}

function inferMonthYearFromUrl(url) {
  const match = /-([a-z]{3})(\d{4})\.html/i.exec(url);
  if (!match) return null;

  const monthToken = match[1].toLowerCase();
  const year = Number(match[2]);
  const month = MONTH_MAP[monthToken];
  if (!month || !Number.isFinite(year)) return null;
  return { year, month };
}

function inferPortItineraryLabel(url) {
  if (/stavanger/i.test(url)) return "Stavanger, Norway";
  if (/bergen/i.test(url)) return "Bergen, Norway";
  if (/flam|fl[aå]m/i.test(url)) return "Flam, Norway";
  if (/geiranger/i.test(url)) return "Geiranger, Norway";
  if (/eidfjord/i.test(url)) return "Eidfjord, Norway";
  if (/olden/i.test(url)) return "Olden, Norway";
  if (/nordfjordeid/i.test(url)) return "Nordfjordeid, Norway";
  if (/alesund|[aå]lesund/i.test(url)) return "Alesund, Norway";
  if (/molde/i.test(url)) return "Molde, Norway";
  if (/honningsvag|honningsv[aå]g/i.test(url)) return "Honningsvag, Norway";
  if (/kristiansand/i.test(url)) return "Kristiansand, Norway";
  if (/hellesylt/i.test(url)) return "Hellesylt, Norway";
  if (/trondheim/i.test(url)) return "Trondheim, Norway";
  if (/skjolden/i.test(url)) return "Skjolden, Norway";
  if (/tromso|troms[oø]/i.test(url)) return "Tromso, Norway";
  return null;
}

function normalizeCruiseLine(raw) {
  const value = raw.trim();
  if (!value) return "";

  const replacements = {
    "Fred Olsen": "Fred Olsen Cruise Lines",
    "P & O": "P&O Cruises",
    "P&O": "P&O Cruises",
    TUI: "TUI Cruises",
    Saga: "Saga Cruises",
    Viking: "Viking",
    MSC: "MSC Cruises",
    Celebrity: "Celebrity Cruises",
    Norwegian: "Norwegian Cruise Line",
    Costa: "Costa Cruises",
    Silversea: "Silversea",
    Seabourn: "Seabourn",
    Phoenix: "Phoenix Reisen",
    Ambassador: "Ambassador Cruise Line",
    Regent: "Regent Seven Seas",
    SeaDream: "SeaDream Yacht Club",
  };

  for (const [prefix, label] of Object.entries(replacements)) {
    if (value.startsWith(prefix)) return label;
  }

  return value;
}

function parseTimes(text) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return { arrival: "tbc", departure: "tbc" };

  if (
    /early|late|morning|afternoon|evening/.test(normalized) &&
    !/\d{3,4}/.test(normalized)
  ) {
    return { arrival: "tbc", departure: "tbc" };
  }

  const range = /(\d{3,4})-(\d{3,4})/.exec(normalized.replace(/\s+/g, ""));
  if (range) {
    return {
      arrival: formatClock(range[1]),
      departure: formatClock(range[2]),
    };
  }

  const both = /a\s*(\d{3,4})\s*d\s*(\d{3,4})/i.exec(normalized);
  if (both) {
    return {
      arrival: formatClock(both[1]),
      departure: formatClock(both[2]),
    };
  }

  const arrivalOnly = /a\s*(\d{3,4})/i.exec(normalized);
  if (arrivalOnly) {
    return { arrival: formatClock(arrivalOnly[1]), departure: "tbc" };
  }

  const lone = /\b(\d{4})\b/.exec(normalized);
  if (lone && !/morning|afternoon|evening/.test(normalized)) {
    return { arrival: formatClock(lone[1]), departure: "tbc" };
  }

  return { arrival: "tbc", departure: "tbc" };
}

function formatClock(value) {
  const digits = String(value).padStart(4, "0");
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function decodeHtml(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseHumanDate(text) {
  const match = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i.exec(
    text,
  );
  if (!match) return null;

  const monthIndex = MONTH_NAME_MAP[match[2].toLowerCase().slice(0, 3)];
  if (monthIndex === undefined) return null;

  const day = Number(match[1]);
  const year = Number(match[3]);
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parsePsovdeFormat(html, year, month) {
  const dayMap = buildDayMap(year, month);
  const chunks = html.split("<div class='psovde-listing'");
  const rows = [];
  let currentDate = null;

  for (const chunk of chunks.slice(1)) {
    const dayMatch = /<div class='psovde-day'>\s*([^<]+?)</i.exec(chunk);
    if (dayMatch) {
      const dayLabel = decodeHtml(dayMatch[1])
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "")
        .trim();
      if (dayMap.has(dayLabel)) {
        currentDate = dayMap.get(dayLabel);
      }
    }

    const shipMatch = /<div class='psovde-ship'>\s*<a[^>]*>([^<]+)<\/a>/i.exec(
      chunk,
    );
    if (!shipMatch || !currentDate) continue;

    const ship = decodeHtml(shipMatch[1]);
    const lineMatch = /alt='([^']+?) logo'/i.exec(chunk);
    const cruiseLine = lineMatch
      ? normalizeCruiseLine(
          lineMatch[1].replace(/ Cruise Lines$/, "").replace(/ Cruises$/, ""),
        )
      : "";

    const timesMatch = /<div class='psovde-times'>\s*([^<]*)<\/div>/i.exec(chunk);
    const { arrival, departure } = parseTimes(timesMatch?.[1] ?? "");

    rows.push({
      date: currentDate,
      ship,
      arrival,
      departure,
      cruiseline: cruiseLine,
    });
  }

  return rows;
}

function parseCdListingFormat(html, portItineraryLabel) {
  const chunks = html.split(/<div class=['"]cd-listing['"]>/);
  const rows = [];
  const escapedPort = portItineraryLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const portTimesPattern = new RegExp(
    `${escapedPort}<\\/a>\\s*\\(([^)]+)\\)`,
    "i",
  );

  for (const chunk of chunks.slice(1)) {
    const arrivingMatch = /Arriving\s*<b>([^<]+)<\/b>/i.exec(chunk);
    if (!arrivingMatch) continue;

    const date = parseHumanDate(decodeHtml(arrivingMatch[1]));
    if (!date) continue;

    const shipMatch = /Ship\s*<a[^>]*>([^<]+)<\/a>/i.exec(chunk);
    if (!shipMatch) continue;

    const ship = decodeHtml(shipMatch[1]);

    const lineMatch =
      /\salt="[^"]*\sat\s([^"]+)"/i.exec(chunk) ||
      /\sat\s([^'"]+)['"]/i.exec(chunk);
    const cruiseLine = lineMatch ? normalizeCruiseLine(decodeHtml(lineMatch[1])) : "";

    const timesMatch = portTimesPattern.exec(chunk);
    const { arrival, departure } = parseTimes(timesMatch?.[1] ?? "");

    rows.push({
      date,
      ship,
      arrival,
      departure,
      cruiseline: cruiseLine,
    });
  }

  return rows;
}

function parseScheduleHtml(html, year, month, url) {
  if (html.includes("psovde-listing")) {
    return parsePsovdeFormat(html, year, month);
  }

  if (html.includes("cd-listing")) {
    const portLabel = inferPortItineraryLabel(url);
    if (!portLabel) {
      throw new Error(
        "Could not infer port name for cd-listing page. Add URL pattern support.",
      );
    }
    return parseCdListingFormat(html, portLabel);
  }

  return [];
}

function dedupeRows(rows) {
  const seen = new Set();
  const output = [];

  for (const row of rows) {
    const key = [row.date, row.ship, row.arrival, row.departure].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(row);
  }

  return output;
}

function rowsToCsv(rows) {
  const lines = ["date,ship,arrival,departure,cruiseline"];
  for (const row of rows) {
    lines.push(
      [row.date, row.ship, row.arrival, row.departure, row.cruiseline].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

async function fetchHtml(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (response.status === 429 && attempt < 4) {
    console.log(`Rate limited (${url}); waiting 60s (attempt ${attempt}/3)...`);
    await new Promise((resolve) => setTimeout(resolve, 60000));
    return fetchHtml(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  }

  return response.text();
}

function collectPaginationUrls(baseUrl, html) {
  const urls = new Set([baseUrl]);
  const pageitPattern = /pageit\('([^']+)'\)/g;

  for (const match of html.matchAll(pageitPattern)) {
    urls.add(new URL(match[1], baseUrl).href);
  }

  return [...urls];
}

async function fetchAllScheduleHtml(baseUrl, options = {}) {
  const { firstPageOnly = false } = options;
  console.log(`Fetching: ${baseUrl}`);
  const firstPage = await fetchHtml(baseUrl);
  const pageUrls = collectPaginationUrls(baseUrl, firstPage);
  const htmlParts = [firstPage];

  if (firstPageOnly) {
    console.log("First page only (--first-page-only); skipping pagination.");
    return { html: htmlParts.join("\n"), pageCount: 1 };
  }

  for (const pageUrl of pageUrls) {
    if (pageUrl === baseUrl) continue;
    console.log(`Waiting 90s before pagination fetch...`);
    await new Promise((resolve) => setTimeout(resolve, 90000));
    console.log(`Fetching: ${pageUrl}`);
    try {
      htmlParts.push(await fetchHtml(pageUrl));
    } catch (error) {
      console.warn(
        `Warning: pagination fetch failed (${pageUrl}). Continuing with ${htmlParts.length} page(s).`,
      );
      console.warn(error instanceof Error ? error.message : String(error));
      break;
    }
  }

  return { html: htmlParts.join("\n"), pageCount: pageUrls.length };
}

async function main() {
  const args = process.argv.slice(2);
  const firstPageOnly = args.includes("--first-page-only");
  const fromHtmlIndex = args.indexOf("--from-html");
  const fromHtmlPath =
    fromHtmlIndex >= 0 ? path.resolve(args[fromHtmlIndex + 1] ?? "") : "";
  const positional = args.filter(
    (arg, index) => !arg.startsWith("--") && index !== fromHtmlIndex + 1,
  );
  const [urlArg, outputArg] = positional;

  if (!urlArg || !outputArg) {
    console.error(
      "Usage: node scripts/parse-cruisetimetables-schedule.js [--first-page-only] [--from-html page.html] <url> <output.csv>",
    );
    process.exit(1);
  }

  const inferred = inferMonthYearFromUrl(urlArg);
  if (!inferred) {
    console.error("Could not infer month/year from URL. Use a URL like ...-jul2026.html");
    process.exit(1);
  }

  let html;
  let pageCount;
  if (fromHtmlPath) {
    html = fs.readFileSync(fromHtmlPath, "utf8");
    pageCount = 1;
    console.log(`Loaded HTML: ${fromHtmlPath}`);
  } else {
    ({ html, pageCount } = await fetchAllScheduleHtml(urlArg, { firstPageOnly }));
  }
  const rows = dedupeRows(parseScheduleHtml(html, inferred.year, inferred.month, urlArg));
  const outputPath = path.resolve(outputArg);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rowsToCsv(rows), "utf8");

  console.log(`Fetched: ${urlArg}`);
  console.log(`Pages fetched: ${pageCount}`);
  console.log(`Month: ${inferred.year}-${String(inferred.month).padStart(2, "0")}`);
  console.log(`Rows written: ${rows.length}`);
  console.log(`Output: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
