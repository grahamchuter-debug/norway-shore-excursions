import { portBySlug, type PortTheme } from "@/lib/ports-data";

export type MapFilterId =
  | "all"
  | "fjords"
  | "glaciers"
  | "waterfalls"
  | "wildlife"
  | "northern-lights"
  | "city-walks"
  | "family"
  | "hidden-gems"
  | "active";

export type MapFilter = {
  id: MapFilterId;
  label: string;
};

export const mapFilters: readonly MapFilter[] = [
  { id: "all", label: "All" },
  { id: "fjords", label: "Fjords" },
  { id: "glaciers", label: "Glaciers" },
  { id: "waterfalls", label: "Waterfalls" },
  { id: "wildlife", label: "Wildlife" },
  { id: "northern-lights", label: "Northern Lights" },
  { id: "city-walks", label: "City Walks" },
  { id: "family", label: "Family" },
  { id: "hidden-gems", label: "Hidden Gems" },
  { id: "active", label: "Active" },
] as const;

export type MapLabelSide = "left" | "right" | "bottom";

export type MapMarker = {
  slug: string;
  name: string;
  shortLabel: string;
  abbrevLabel?: string;
  region: string;
  x: number;
  y: number;
  labelSide: MapLabelSide;
  dense?: boolean;
  filters: readonly MapFilterId[];
  defaultScore: number;
};

/** Stylised Norway outline scaled to fill the map panel (viewBox 0 0 100 100) */
export const norwayOutlinePath =
  "M12 88 L16 72 L22 66 L26 54 L32 48 L36 36 L42 32 L46 26 L52 22 L58 18 L64 14 L70 10 L76 8 L82 10 L86 16 L88 26 L90 36 L88 46 L84 56 L80 66 L76 74 L72 82 L66 88 L58 92 L50 94 L42 92 L34 88 L26 84 L18 88 Z";

/** Demo route for map page: Classic Fjords Route */
export const classicFjordsRoutePorts = [
  "stavanger",
  "bergen",
  "flam",
  "olden",
  "geiranger",
] as const;

const hiddenGemSlugs = new Set([
  "skjolden",
  "eidfjord",
  "hellesylt",
  "nordfjordeid",
  "molde",
  "kristiansand",
]);

function buildFilters(slug: string, themes: readonly PortTheme[]): MapFilterId[] {
  const filters: MapFilterId[] = ["all"];
  if (themes.some((t) => ["fjords", "unesco-fjord"].includes(t)))
    filters.push("fjords");
  if (themes.includes("glaciers")) filters.push("glaciers");
  if (themes.includes("waterfalls")) filters.push("waterfalls");
  if (themes.some((t) => ["wildlife", "arctic"].includes(t)))
    filters.push("wildlife");
  if (themes.includes("northern-lights")) filters.push("northern-lights");
  if (themes.some((t) => ["city-walks", "history", "culture"].includes(t)))
    filters.push("city-walks");
  if (themes.includes("family-friendly")) filters.push("family");
  if (hiddenGemSlugs.has(slug)) filters.push("hidden-gems");
  if (themes.some((t) => ["active-tours", "adventure"].includes(t)))
    filters.push("active");
  return filters;
}

const markerSeed: Omit<MapMarker, "filters" | "defaultScore">[] = [
  {
    slug: "kristiansand",
    name: "Kristiansand",
    shortLabel: "Kristiansand",
    region: "Southern Norway",
    x: 13,
    y: 87,
    labelSide: "right",
  },
  {
    slug: "stavanger",
    name: "Stavanger",
    shortLabel: "Stavanger",
    region: "Rogaland",
    x: 19,
    y: 81,
    labelSide: "right",
  },
  {
    slug: "bergen",
    name: "Bergen",
    shortLabel: "Bergen",
    region: "Vestland",
    x: 27,
    y: 75,
    labelSide: "right",
  },
  {
    slug: "eidfjord",
    name: "Eidfjord",
    shortLabel: "Eidfjord",
    region: "Hardanger",
    x: 31,
    y: 69,
    labelSide: "left",
    dense: true,
  },
  {
    slug: "flam",
    name: "Flåm",
    shortLabel: "Flam",
    region: "Sognefjord",
    x: 33,
    y: 67,
    labelSide: "right",
    dense: true,
  },
  {
    slug: "skjolden",
    name: "Skjolden",
    shortLabel: "Skjolden",
    abbrevLabel: "Skjolden",
    region: "Inner Sognefjord",
    x: 35,
    y: 65,
    labelSide: "left",
    dense: true,
  },
  {
    slug: "geiranger",
    name: "Geiranger",
    shortLabel: "Geiranger",
    region: "UNESCO fjord",
    x: 43,
    y: 61,
    labelSide: "right",
    dense: true,
  },
  {
    slug: "olden",
    name: "Olden",
    shortLabel: "Olden",
    region: "Nordfjord",
    x: 41,
    y: 59,
    labelSide: "left",
    dense: true,
  },
  {
    slug: "hellesylt",
    name: "Hellesylt",
    shortLabel: "Hellesylt",
    abbrevLabel: "Helles.",
    region: "Geirangerfjord",
    x: 42,
    y: 60,
    labelSide: "bottom",
    dense: true,
  },
  {
    slug: "nordfjordeid",
    name: "Nordfjordeid",
    shortLabel: "Nordfjordeid",
    abbrevLabel: "N.Eid",
    region: "Nordfjord",
    x: 39,
    y: 57,
    labelSide: "left",
    dense: true,
  },
  {
    slug: "alesund",
    name: "Ålesund",
    shortLabel: "Alesund",
    region: "Møre og Romsdal",
    x: 44,
    y: 51,
    labelSide: "right",
  },
  {
    slug: "molde",
    name: "Molde",
    shortLabel: "Molde",
    region: "Romsdal",
    x: 45,
    y: 49,
    labelSide: "left",
  },
  {
    slug: "trondheim",
    name: "Trondheim",
    shortLabel: "Trondheim",
    region: "Trøndelag",
    x: 50,
    y: 43,
    labelSide: "right",
  },
  {
    slug: "tromso",
    name: "Tromsø",
    shortLabel: "Tromso",
    region: "Arctic Troms",
    x: 73,
    y: 15,
    labelSide: "left",
  },
  {
    slug: "honningsvag",
    name: "Honningsvåg",
    shortLabel: "Honningsvag",
    region: "Arctic",
    x: 79,
    y: 21,
    labelSide: "right",
  },
];

const defaultScores: Record<string, number> = {
  flam: 92,
  stavanger: 86,
  bergen: 90,
  alesund: 84,
  geiranger: 94,
  olden: 88,
  eidfjord: 82,
  molde: 80,
  honningsvag: 87,
  kristiansand: 78,
  hellesylt: 81,
  trondheim: 83,
  nordfjordeid: 79,
  skjolden: 85,
  tromso: 89,
};

export const mapMarkers: readonly MapMarker[] = markerSeed.map((m) => ({
  ...m,
  defaultScore: defaultScores[m.slug] ?? 80,
  filters: buildFilters(m.slug, portBySlug[m.slug]?.themes ?? []),
}));

export function markerMatchesFilter(
  marker: MapMarker,
  filter: MapFilterId,
): boolean {
  if (filter === "all") return true;
  return marker.filters.includes(filter);
}

export function getMarkerBySlug(slug: string): MapMarker | undefined {
  return mapMarkers.find((m) => m.slug === slug);
}

export function buildRoutePolylinePoints(
  routePorts: readonly string[],
): string | null {
  const points = routePorts
    .map((slug) => getMarkerBySlug(slug))
    .filter(Boolean)
    .map((m) => `${m!.x},${m!.y}`);
  return points.length >= 2 ? points.join(" ") : null;
}
