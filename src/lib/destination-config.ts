import type {
  DestinationConfig,
  DestinationPort,
} from "@/lib/destination-port-types";
import { buildBestForTags, type PortRecommendation } from "@/lib/norway-cruise-planner-engine";
import {
  mapFilters,
  mapMarkers,
  norwayOutlinePath,
} from "@/lib/map-data";
import { portBySlug } from "@/lib/ports-data";
import { getPortImage } from "@/lib/site-images";

export const norwayDestinationConfig: DestinationConfig = {
  destinationName: "Norway",
  brandName: "Norway Shore Excursions",
  plannerPath: "/norway-cruise-planner",
  plannerTitle: "Norway Cruise Planner™",
  plannerSubtitle:
    "Personalised shore excursion recommendations with Norway Cruise Match scores, traveller types and return to ship confidence for every port on your itinerary.",
  plannerCtaLabel: "Open cruise planner",
  mapTitle: "Norway Cruise Map™",
  mapSubtitle:
    "Visual overview of Norway cruise ports. Use alongside the planner when you want a geographic reference.",
  mapSecondaryEyebrow: "Visual explorer",
  mapSecondaryTitle: "Norway cruise port map",
  mapSecondarySubtitle:
    "Optional map and list views for browsing ports. For personalised excursion picks, use the Norway Cruise Planner first.",
  mapHeaderLabel: "NORWAY CRUISE PORTS",
  mapOutlinePath: norwayOutlinePath,
  mapViewLabel: "Map View",
  listViewLabel: "List View",
  filters: mapFilters.map((f) => ({ id: f.id, label: f.label })),
  defaultFilterId: "all",
  exploreCtaTemplate: "Explore {port} port guide",
  portMapPath: "/norway-cruise-port-map",
  fjordTexturePaths: [
    "M28 74 Q34 70 38 66 T44 60",
    "M32 68 Q36 64 40 60 T46 54",
    "M36 62 Q40 58 44 54 T48 48",
  ],
};

export function buildNorwayDestinationPorts(): DestinationPort[] {
  return mapMarkers.map((marker) => {
    const port = portBySlug[marker.slug];
    const image = getPortImage(marker.slug);

    return {
      slug: marker.slug,
      name: marker.name,
      shortLabel: marker.shortLabel,
      abbrevLabel: marker.abbrevLabel,
      region: marker.region,
      bestFor: port?.bestFor.split(".")[0]?.trim() ?? "Norway cruise excursions",
      topExcursion: port?.heroTour ?? "See port guide",
      fitScore: marker.defaultScore,
      localSiteUrl: port?.localSiteUrl ?? "#",
      authorityPortPath: `/ports/${marker.slug}`,
      imageUrl: image.url,
      imageAlt: image.alt,
      coordinates: { x: marker.x, y: marker.y },
      labelSide: marker.labelSide,
      dense: marker.dense,
      filterIds: marker.filters,
      tags: buildBestForTags(marker.slug),
      description: port?.bestFor,
    };
  });
}

export const norwayDestinationPorts: readonly DestinationPort[] =
  buildNorwayDestinationPorts();

export function getNorwayPortBySlug(slug: string): DestinationPort | undefined {
  return norwayDestinationPorts.find((p) => p.slug === slug);
}

export function recommendationsToDestinationPorts(
  recommendations: readonly PortRecommendation[],
): DestinationPort[] {
  return recommendations.map((rec) => {
    const base = getNorwayPortBySlug(rec.portSlug);

    return {
      slug: rec.portSlug,
      name: rec.portName,
      shortLabel: base?.shortLabel ?? rec.portName,
      abbrevLabel: base?.abbrevLabel,
      region: base?.region ?? "Norway",
      bestFor: base?.bestFor ?? rec.bestForTags.join(", "),
      topExcursion: rec.recommended,
      fitScore: rec.cruiseFitScore,
      localSiteUrl: rec.localSiteUrl,
      authorityPortPath: rec.authorityPortPath,
      imageUrl: rec.imageUrl,
      imageAlt: rec.imageAlt,
      coordinates: base?.coordinates ?? { x: 50, y: 50 },
      labelSide: base?.labelSide,
      dense: base?.dense,
      filterIds: base?.filterIds ?? ["all"],
      tags: rec.bestForTags.length ? rec.bestForTags : buildBestForTags(rec.portSlug),
      description: base?.description,
      returnConfidence: rec.returnConfidence,
      returnLabel: rec.returnLabel,
      matchReason: rec.why,
    };
  });
}

