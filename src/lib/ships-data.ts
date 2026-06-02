import {
  shipCardBadgeInputFromCruiseLineShip,
  shipCardBadgeInputFromSummary,
} from "@/lib/ship-card-badges";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import {
  cruiseLineBySlug,
  cruiseLinePagePath,
  cruiseLinePopularShipsAnchor,
} from "@/lib/cruise-lines-data";
import {
  formatShipCapacityLabel,
  getShipPassengerCapacity,
} from "@/lib/ship-capacities";
import type { ShipScheduleSummary } from "@/lib/ship-schedules";
import {
  buildShipScheduleSummaries,
  getShipScheduleSummaryBySlug,
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

/**
 * Hub spotlight ships on /cruise-lines.
 * Links target cruise line guides until dedicated ship hubs are promoted site wide.
 */
export const popularNorwayHubShips = [
  { slug: "iona", cruiseLineSlug: "p-and-o-cruises-norway", label: "Iona" },
  {
    slug: "msc-euribia",
    cruiseLineSlug: "msc-cruises-norway",
    label: "MSC Euribia",
  },
  {
    slug: "sky-princess",
    cruiseLineSlug: "princess-cruises-norway",
    label: "Sky Princess",
  },
  { slug: "queen-anne", cruiseLineSlug: "cunard-norway", label: "Queen Anne" },
  {
    slug: "celebrity-apex",
    cruiseLineSlug: "celebrity-cruises-norway",
    label: "Celebrity Apex",
  },
] as const;

export type PopularNorwayHubShip = (typeof popularNorwayHubShips)[number];

export type PopularShipCard = {
  slug: string;
  ship: string;
  cruiseLine: string;
  capacityLabel: string;
  callCount: number;
  topPortsLabel: string;
  typicalCruiseLengthLabel: string;
  badgeInput: ShipCardBadgeInput;
  href: string;
};

function formatTopPorts(summary: ShipScheduleSummary): string {
  return summary.topPorts.map((p) => p.portDisplayName).join(", ");
}

function cruiseLineGuideHref(cruiseLineSlug: string): string {
  return `${cruiseLinePagePath(cruiseLineSlug)}#${cruiseLinePopularShipsAnchor}`;
}

export function getPopularNorwayShipCards(): PopularShipCard[] {
  const cards: PopularShipCard[] = [];
  for (const entry of popularNorwayHubShips) {
    const line = cruiseLineBySlug[entry.cruiseLineSlug];
    const summary = getShipScheduleSummaryBySlug(entry.slug);
    const lineShip = line
      ? getCruiseLineScheduleSummary(line.scheduleKey).ships.find(
          (s) => s.slug === entry.slug,
        )
      : undefined;

    if (summary) {
      cards.push({
        slug: entry.slug,
        ship: summary.ship,
        cruiseLine: summary.cruiseLine,
        capacityLabel: summary.capacityLabel,
        callCount: summary.callCount,
        topPortsLabel: formatTopPorts(summary),
        typicalCruiseLengthLabel:
          line?.passengerSnapshot.typicalCruiseLength ?? "",
        badgeInput: shipCardBadgeInputFromSummary(summary),
        href: cruiseLineGuideHref(entry.cruiseLineSlug),
      });
      continue;
    }

    if (lineShip) {
      cards.push({
        slug: entry.slug,
        ship: lineShip.ship,
        cruiseLine: lineShip.cruiseLine,
        capacityLabel: lineShip.capacityLabel,
        callCount: lineShip.callCount,
        topPortsLabel: lineShip.topPortNames,
        typicalCruiseLengthLabel:
          line?.passengerSnapshot.typicalCruiseLength ?? "",
        badgeInput: shipCardBadgeInputFromCruiseLineShip(lineShip),
        href: cruiseLineGuideHref(entry.cruiseLineSlug),
      });
      continue;
    }

    const capacity = getShipPassengerCapacity(entry.label, line?.name ?? "", null);
    cards.push({
      slug: entry.slug,
      ship: entry.label,
      cruiseLine: line?.name ?? "Norway cruise",
      capacityLabel: formatShipCapacityLabel(capacity),
      callCount: 0,
      topPortsLabel: "",
      typicalCruiseLengthLabel: line?.passengerSnapshot.typicalCruiseLength ?? "",
      badgeInput: { callCount: 0 },
      href: cruiseLineGuideHref(entry.cruiseLineSlug),
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
