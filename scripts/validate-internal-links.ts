/**
 * Validates internal hrefs in src against known site routes.
 * Run: npx tsx scripts/validate-internal-links.ts
 */
import fs from "node:fs";
import path from "node:path";

import { allPagePaths } from "../src/lib/site-routes";
import { portExcursionLinks, getPortExcursionLink } from "../src/lib/cruise-schedule-config";
import { scheduledPortSlugs } from "../src/lib/cruise-schedule-config";
import { defaultNorwayCruiseGuidePdfConfig } from "../src/lib/pdf/cruise-guide-pdf-config";
import { getPortRecommendedExcursions } from "../src/lib/port-recommended-excursions";
import { getPortCategorizedExcursions } from "../src/lib/port-recommended-excursions";
import { portsWithMappedExcursions } from "../src/lib/port-recommended-excursions";
import { portSlugs } from "../src/lib/ports-data";

const SRC_ROOT = path.join(process.cwd(), "src");
const SITE_ORIGIN = "https://norwayshoreexcursions.com";

const validPaths = new Set<string>([
  ...allPagePaths,
  "/cruise-schedules", // legacy redirect target source
]);

function normalizeInternalPath(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return null;
  }
  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.origin === SITE_ORIGIN) {
        return `${url.pathname}${url.hash}`;
      }
    } catch {
      return null;
    }
    return null;
  }
  if (trimmed.startsWith("/")) {
    const hashIndex = trimmed.indexOf("#");
    if (hashIndex === -1) return trimmed;
    return trimmed.slice(0, hashIndex);
  }
  return null;
}

function isValidPath(pathname: string): boolean {
  if (pathname.startsWith("#")) return true;
  if (validPaths.has(pathname)) return true;

  // Dynamic ship pages validated separately via slug list
  if (pathname.startsWith("/ships/")) return true;
  if (pathname.startsWith("/cruise-lines/")) return true;
  if (pathname.startsWith("/ports/")) {
    const slug = pathname.replace("/ports/", "");
    return portSlugs.includes(slug);
  }
  if (pathname.startsWith("/ship-schedules/")) return true;

  return false;
}

function walkDir(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules") walkDir(full, files);
    } else if (/\.(tsx?|jsx?|mdx?)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

type BrokenLink = {
  file: string;
  href: string;
  source: string;
};

function scanSourceFiles(): BrokenLink[] {
  const broken: BrokenLink[] = [];
  const hrefPattern =
    /(?:href\s*=\s*["'{`]|href:\s*["'`])([^"'`}#]+(?:#[^"'`}]*)?)/g;

  for (const file of walkDir(SRC_ROOT)) {
    const content = fs.readFileSync(file, "utf8");
    let match: RegExpExecArray | null;
    while ((match = hrefPattern.exec(content)) !== null) {
      const raw = match[1];
      if (raw.includes("${")) continue;
      const internal = normalizeInternalPath(raw);
      if (!internal) continue;
      const pathname = internal.startsWith("#") ? internal : internal.split("#")[0];
      if (!isValidPath(pathname)) {
        broken.push({
          file: path.relative(process.cwd(), file),
          href: raw,
          source: "source-scan",
        });
      }
    }
  }
  return broken;
}

function checkProgrammaticLinks(): BrokenLink[] {
  const broken: BrokenLink[] = [];

  for (const portSlug of scheduledPortSlugs) {
    const href = getPortExcursionLink(portSlug);
    const internal = normalizeInternalPath(href);
    if (internal && !isValidPath(internal.split("#")[0])) {
      broken.push({
        file: "src/lib/cruise-schedule-config.ts",
        href,
        source: `getPortExcursionLink(${portSlug})`,
      });
    }
  }

  for (const [port, href] of Object.entries(portExcursionLinks)) {
    const internal = normalizeInternalPath(href);
    if (internal && !isValidPath(internal.split("#")[0])) {
      broken.push({
        file: "src/lib/cruise-schedule-config.ts",
        href,
        source: `portExcursionLinks.${port}`,
      });
    }
  }

  const pdf = defaultNorwayCruiseGuidePdfConfig;
  for (const [port, href] of Object.entries(pdf.portBookingUrls)) {
    const internal = normalizeInternalPath(href);
    if (internal && !isValidPath(internal.split("#")[0])) {
      broken.push({
        file: "src/lib/pdf/cruise-guide-pdf-config.ts",
        href,
        source: `portBookingUrls.${port}`,
      });
    }
  }
  for (const pattern of pdf.tourBookingPatterns) {
    const internal = normalizeInternalPath(pattern.url);
    if (internal && !isValidPath(internal.split("#")[0])) {
      broken.push({
        file: "src/lib/pdf/cruise-guide-pdf-config.ts",
        href: pattern.url,
        source: `tourBookingPatterns ${pattern.match}`,
      });
    }
  }
  for (const key of ["excursions", "defaultBooking"] as const) {
    const internal = normalizeInternalPath(pdf.urls[key]);
    if (internal && !isValidPath(internal.split("#")[0])) {
      broken.push({
        file: "src/lib/pdf/cruise-guide-pdf-config.ts",
        href: pdf.urls[key],
        source: `urls.${key}`,
      });
    }
  }

  for (const portSlug of portsWithMappedExcursions) {
    for (const card of getPortRecommendedExcursions(portSlug)) {
      if (card.external) continue;
      const internal = normalizeInternalPath(card.url);
      if (internal && !isValidPath(internal.split("#")[0])) {
        broken.push({
          file: "src/lib/port-recommended-excursions.ts",
          href: card.url,
          source: `recommended ${portSlug}: ${card.title}`,
        });
      }
    }
    const categorized = getPortCategorizedExcursions(portSlug);
    if (!categorized) continue;
    for (const pick of Object.values(categorized)) {
      if (pick.external) continue;
      const internal = normalizeInternalPath(pick.url);
      if (internal && !isValidPath(internal.split("#")[0])) {
        broken.push({
          file: "src/lib/port-recommended-excursions.ts",
          href: pick.url,
          source: `categorized ${portSlug}: ${pick.title}`,
        });
      }
    }
  }

  return broken;
}

function dedupe(broken: BrokenLink[]): BrokenLink[] {
  const seen = new Set<string>();
  return broken.filter((b) => {
    const key = `${b.file}|${b.href}|${b.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const broken = dedupe([...scanSourceFiles(), ...checkProgrammaticLinks()]);

console.log(JSON.stringify({ brokenCount: broken.length, broken }, null, 2));
process.exit(broken.length > 0 ? 1 : 0);
