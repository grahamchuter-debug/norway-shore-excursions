import { shipCardBadgeInputFromSummary } from "@/lib/ship-card-badges";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";
import type { ShipScheduleSummary } from "@/lib/ship-schedules";
import {
  buildShipScheduleSummaries,
  getShipScheduleSummaryBySlug,
  shipPagePath,
} from "@/lib/ship-schedules";

export {
  getShipImagePath,
  getShipImageSlugsOnDisk,
  resolveShipImageSlug,
  shipHasListedImage,
  shipImageFileExists,
  shipPlaceholderImagePath,
} from "@/lib/ship-images";

/** Featured ship pages promoted across the site. */
export const featuredShipSlugs = [
  "msc-euribia",
  "iona",
  "arvia",
  "celebrity-apex",
  "viking-vela",
  "aidaprima",
  "msc-magnifica",
  "rotterdam",
  "ambience",
] as const;

export type FeaturedShipSlug = (typeof featuredShipSlugs)[number];

/** Hub section on /cruise-lines */
export const popularNorwayShipSlugs = [
  "msc-euribia",
  "iona",
  "arvia",
  "celebrity-apex",
  "viking-vela",
  "rotterdam",
] as const;

export type PopularNorwayShipSlug = (typeof popularNorwayShipSlugs)[number];

export type PopularShipCard = {
  slug: string;
  ship: string;
  cruiseLine: string;
  capacityLabel: string;
  callCount: number;
  topPortsLabel: string;
  badgeInput: ShipCardBadgeInput;
  href: string;
};

function formatTopPorts(summary: ShipScheduleSummary): string {
  return summary.topPorts.map((p) => p.portDisplayName).join(", ");
}

export function getPopularNorwayShipCards(): PopularShipCard[] {
  const cards: PopularShipCard[] = [];
  for (const slug of popularNorwayShipSlugs) {
    const summary = getShipScheduleSummaryBySlug(slug);
    if (!summary) continue;
    cards.push({
      slug,
      ship: summary.ship,
      cruiseLine: summary.cruiseLine,
      capacityLabel: summary.capacityLabel,
      callCount: summary.callCount,
      topPortsLabel: formatTopPorts(summary),
      badgeInput: shipCardBadgeInputFromSummary(summary),
      href: shipPagePath(slug),
    });
  }
  return cards;
}

export function getFeaturedShipSummaries(): ShipScheduleSummary[] {
  return featuredShipSlugs
    .map((slug) => getShipScheduleSummaryBySlug(slug))
    .filter((s): s is ShipScheduleSummary => s != null);
}

export function getShipsHubSummaries(): ShipScheduleSummary[] {
  const featured = new Set<string>(featuredShipSlugs);
  const all = buildShipScheduleSummaries();
  const featuredSummaries = all.filter((s) => featured.has(s.slug));
  const rest = all.filter((s) => !featured.has(s.slug));
  return [...featuredSummaries, ...rest];
}

export const shipPageFaqs = [
  {
    question: "Where does this Norway cruise schedule data come from?",
    answer:
      "Port calls are imported from published 2026 Norway cruise timetable sources for ports with verified data. Always confirm arrival, departure and all aboard times with your cruise line before booking excursions.",
  },
  {
    question: "What does Return to Ship Confidence mean on excursion cards?",
    answer:
      "Confidence labels estimate how comfortably a typical independent tour fits your port window, using arrival and all aboard times when published, plus standard check in and safety buffers. See our Return to Ship Confidence page for the full methodology.",
  },
  {
    question: "Can I book excursions through this ship page?",
    answer:
      "No. This page is an independent planning guide. Excursion links point to local port specialists or our Norway Cruise Planner. We are not affiliated with your cruise line.",
  },
] as const;
