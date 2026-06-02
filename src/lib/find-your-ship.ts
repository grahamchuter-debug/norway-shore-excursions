import { shipScheduleSearchPath } from "@/lib/cruise-schedule-config";
import {
  cruiseLineBySlug,
  cruiseLinePagePath,
  cruiseLineShipPagePath,
  type CruiseLineData,
} from "@/lib/cruise-lines-data";
import { getFeaturedShipSummary } from "@/lib/cruise-line-ship-summaries";
import {
  shipCardBadgeInputFromCruiseLineShip,
  shipCardBadgeInputFromSummary,
} from "@/lib/ship-card-badges";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import { normalizeShipSearchKey } from "@/lib/cruiseSchedules";
import { portBySlug } from "@/lib/ports-data";
import {
  formatShipCapacityLabel,
  getShipPassengerCapacity,
} from "@/lib/ship-capacities";
import { getShipScheduleSummaryBySlug, shipPagePath } from "@/lib/ship-schedules";
import { siteConfig } from "@/lib/site-config";

/** Curated ships for the Find Your Ship hub search. Extend this list to add more vessels. */
export const findYourShipCatalog = [
  { slug: "iona", cruiseLineSlug: "p-and-o-cruises-norway", shipName: "Iona" },
  {
    slug: "britannia",
    cruiseLineSlug: "p-and-o-cruises-norway",
    shipName: "Britannia",
  },
  {
    slug: "arcadia",
    cruiseLineSlug: "p-and-o-cruises-norway",
    shipName: "Arcadia",
  },
  {
    slug: "aurora",
    cruiseLineSlug: "p-and-o-cruises-norway",
    shipName: "Aurora",
  },
  {
    slug: "queen-anne",
    cruiseLineSlug: "cunard-norway",
    shipName: "Queen Anne",
  },
  {
    slug: "queen-mary-2",
    cruiseLineSlug: "cunard-norway",
    shipName: "Queen Mary 2",
  },
  {
    slug: "queen-victoria",
    cruiseLineSlug: "cunard-norway",
    shipName: "Queen Victoria",
  },
  {
    slug: "queen-elizabeth",
    cruiseLineSlug: "cunard-norway",
    shipName: "Queen Elizabeth",
  },
  {
    slug: "msc-euribia",
    cruiseLineSlug: "msc-cruises-norway",
    shipName: "MSC Euribia",
  },
  {
    slug: "msc-virtuosa",
    cruiseLineSlug: "msc-cruises-norway",
    shipName: "MSC Virtuosa",
  },
  {
    slug: "msc-preziosa",
    cruiseLineSlug: "msc-cruises-norway",
    shipName: "MSC Preziosa",
  },
  {
    slug: "sky-princess",
    cruiseLineSlug: "princess-cruises-norway",
    shipName: "Sky Princess",
  },
  {
    slug: "regal-princess",
    cruiseLineSlug: "princess-cruises-norway",
    shipName: "Regal Princess",
  },
  {
    slug: "majestic-princess",
    cruiseLineSlug: "princess-cruises-norway",
    shipName: "Majestic Princess",
  },
  {
    slug: "celebrity-apex",
    cruiseLineSlug: "celebrity-cruises-norway",
    shipName: "Celebrity Apex",
  },
  {
    slug: "celebrity-eclipse",
    cruiseLineSlug: "celebrity-cruises-norway",
    shipName: "Celebrity Eclipse",
  },
] as const;

export type FindYourShipCatalogEntry = (typeof findYourShipCatalog)[number];

export type FindYourShipEntry = {
  slug: string;
  shipName: string;
  cruiseLine: string;
  cruiseLineSlug: string;
  searchKey: string;
  cruiseLineSearchKey: string;
  capacityLabel: string;
  callCount: number;
  typicalNorwayCruiseLength: string;
  commonPortsLabel: string;
  recommendedExcursionTypes: string;
  summary?: string;
  badgeInput: ShipCardBadgeInput;
  cruiseLineHref: string;
  shipPageHref: string | null;
  reservedShipPageHref: string;
  schedulesHref: string;
  plannerHref: string;
};

function formatRecommendedExcursionTypes(line: CruiseLineData | undefined): string {
  if (!line?.excursionStyles.length) return "Scenic, fjord and small group tours";
  return line.excursionStyles
    .slice(0, 4)
    .map((style) => style.title)
    .join(", ");
}

function formatPortsFromLine(line: CruiseLineData | undefined): string {
  if (!line) return "";
  return line.recommendedPortSlugs
    .slice(0, 5)
    .map((slug) => portBySlug[slug]?.name ?? slug)
    .join(", ");
}

function buildSearchKey(shipName: string, cruiseLine: string): string {
  return `${normalizeShipSearchKey(shipName)}${normalizeShipSearchKey(cruiseLine)}`;
}

export function buildFindYourShipEntries(): FindYourShipEntry[] {
  return findYourShipCatalog.map((item) => {
    const line = cruiseLineBySlug[item.cruiseLineSlug];
    const summary = getShipScheduleSummaryBySlug(item.slug);
    const lineShip = line
      ? getCruiseLineScheduleSummary(line.scheduleKey).ships.find(
          (ship) => ship.slug === item.slug,
        )
      : undefined;

    const shipName = summary?.ship ?? lineShip?.ship ?? item.shipName;
    const cruiseLine = summary?.cruiseLine ?? lineShip?.cruiseLine ?? line?.name ?? "";
    const callCount = summary?.callCount ?? lineShip?.callCount ?? 0;
    const capacityLabel =
      summary?.capacityLabel ??
      lineShip?.capacityLabel ??
      formatShipCapacityLabel(
        getShipPassengerCapacity(shipName, cruiseLine, null),
      );

    const commonPortsLabel = summary
      ? summary.topPorts.map((port) => port.portDisplayName).join(", ")
      : lineShip?.topPortNames || formatPortsFromLine(line);

    const badgeInput = summary
      ? shipCardBadgeInputFromSummary(summary)
      : lineShip
        ? shipCardBadgeInputFromCruiseLineShip(lineShip)
        : { callCount };

    const schedulesHref = `${shipScheduleSearchPath}?q=${encodeURIComponent(shipName)}`;

    return {
      slug: item.slug,
      shipName,
      cruiseLine,
      cruiseLineSlug: item.cruiseLineSlug,
      searchKey: normalizeShipSearchKey(shipName),
      cruiseLineSearchKey: normalizeShipSearchKey(line?.shortName ?? cruiseLine),
      capacityLabel,
      callCount,
      typicalNorwayCruiseLength:
        line?.passengerSnapshot.typicalCruiseLength ?? "7 to 14 nights",
      commonPortsLabel,
      recommendedExcursionTypes: formatRecommendedExcursionTypes(line),
      summary: getFeaturedShipSummary(item.slug),
      badgeInput,
      cruiseLineHref: cruiseLinePagePath(item.cruiseLineSlug),
      shipPageHref: summary ? shipPagePath(item.slug) : null,
      reservedShipPageHref: cruiseLineShipPagePath(item.slug),
      schedulesHref,
      plannerHref: siteConfig.plannerPath,
    };
  });
}

export function filterFindYourShipEntries(
  entries: readonly FindYourShipEntry[],
  query: string,
): FindYourShipEntry[] {
  const queryKey = normalizeShipSearchKey(query);
  if (!queryKey) return [];

  return entries.filter(
    (entry) =>
      entry.searchKey.includes(queryKey) ||
      entry.cruiseLineSearchKey.includes(queryKey) ||
      buildSearchKey(entry.shipName, entry.cruiseLine).includes(queryKey),
  );
}

export const findYourShipPopularQueries = [
  "Iona",
  "Queen Anne",
  "MSC Euribia",
  "Sky Princess",
  "Celebrity Apex",
] as const;
