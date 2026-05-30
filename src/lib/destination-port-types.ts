export type ViewMode = "map" | "list";

export type PortCoordinates = {
  x: number;
  y: number;
};

export type PortFilter = {
  id: string;
  label: string;
};

export type LabelSide = "left" | "right" | "bottom";

export type ReturnConfidenceLevel = "green" | "amber" | "red";

/** Generic cruise port record for map/list explorer (destination agnostic) */
export type DestinationPort = {
  slug: string;
  name: string;
  shortLabel: string;
  abbrevLabel?: string;
  region: string;
  bestFor: string;
  topExcursion: string;
  fitScore: number;
  localSiteUrl: string;
  authorityPortPath: string;
  imageUrl: string;
  imageAlt: string;
  coordinates: PortCoordinates;
  labelSide?: LabelSide;
  dense?: boolean;
  filterIds: readonly string[];
  tags: readonly string[];
  description?: string;
  returnConfidence?: ReturnConfidenceLevel;
  returnLabel?: string;
  matchReason?: string;
};

export type DestinationConfig = {
  destinationName: string;
  brandName: string;
  plannerPath: string;
  plannerTitle: string;
  plannerSubtitle: string;
  plannerCtaLabel: string;
  mapTitle: string;
  mapSubtitle: string;
  mapSecondaryEyebrow: string;
  mapSecondaryTitle: string;
  mapSecondarySubtitle: string;
  mapHeaderLabel: string;
  mapOutlinePath: string;
  mapViewLabel: string;
  listViewLabel: string;
  filters: readonly PortFilter[];
  defaultFilterId: string;
  exploreCtaTemplate: string;
  portMapPath: string;
  fjordTexturePaths?: readonly string[];
};

export function portMatchesFilter(
  port: DestinationPort,
  activeFilter: string,
): boolean {
  if (activeFilter === "all") return true;
  return port.filterIds.includes(activeFilter);
}

export function buildRoutePolylineFromPorts(
  routePorts: readonly string[],
  ports: readonly DestinationPort[],
): string | null {
  const bySlug = new Map(ports.map((p) => [p.slug, p]));
  const points = routePorts
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map((p) => `${p!.coordinates.x},${p!.coordinates.y}`);
  return points.length >= 2 ? points.join(" ") : null;
}

export function orderPortsForRoute(
  ports: readonly DestinationPort[],
  routePorts?: readonly string[],
): DestinationPort[] {
  if (!routePorts?.length) return [...ports];
  const order = new Map(routePorts.map((slug, index) => [slug, index]));
  return [...ports].sort(
    (a, b) =>
      (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}
