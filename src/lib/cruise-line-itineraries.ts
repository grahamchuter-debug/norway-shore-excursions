export type NorwayItineraryStopKind = "embark" | "port" | "sea" | "return";

export type NorwayItineraryStop = {
  label: string;
  portSlug?: string;
  kind: NorwayItineraryStopKind;
};

export type CruiseLineNorwayItinerary = {
  summary: string;
  stops: readonly NorwayItineraryStop[];
};

const classicSouthamptonLoop: readonly NorwayItineraryStop[] = [
  { label: "Southampton", kind: "embark" },
  { label: "Stavanger", portSlug: "stavanger", kind: "port" },
  { label: "Olden", portSlug: "olden", kind: "port" },
  { label: "Ålesund", portSlug: "alesund", kind: "port" },
  { label: "Haugesund", kind: "port" },
  { label: "Southampton", kind: "return" },
];

const classicWithFlamGeiranger: readonly NorwayItineraryStop[] = [
  { label: "Southampton", kind: "embark" },
  { label: "Stavanger", portSlug: "stavanger", kind: "port" },
  { label: "Flåm", portSlug: "flam", kind: "port" },
  { label: "Geiranger", portSlug: "geiranger", kind: "port" },
  { label: "Bergen", portSlug: "bergen", kind: "port" },
  { label: "Southampton", kind: "return" },
];

export const norwayItineraryByCruiseLineSlug: Record<
  string,
  CruiseLineNorwayItinerary
> = {
  "msc-cruises-norway": {
    summary: "Hamburg or Southampton loops through western fjord ports.",
    stops: [
      { label: "Hamburg", kind: "embark" },
      { label: "Bergen", portSlug: "bergen", kind: "port" },
      { label: "Flåm", portSlug: "flam", kind: "port" },
      { label: "Geiranger", portSlug: "geiranger", kind: "port" },
      { label: "Stavanger", portSlug: "stavanger", kind: "port" },
      { label: "Hamburg", kind: "return" },
    ],
  },
  "p-and-o-cruises-norway": {
    summary: "Classic British summer fjord loop from Southampton.",
    stops: classicWithFlamGeiranger,
  },
  "celebrity-cruises-norway": {
    summary: "Premium fjord intensive routes from Southampton or Amsterdam.",
    stops: classicWithFlamGeiranger,
  },
  "cunard-norway": {
    summary: "Refined Northern Europe segments with ballroom evenings at sea.",
    stops: [
      { label: "Southampton", kind: "embark" },
      { label: "Bergen", portSlug: "bergen", kind: "port" },
      { label: "Flåm", portSlug: "flam", kind: "port" },
      { label: "Geiranger", portSlug: "geiranger", kind: "port" },
      { label: "Stavanger", portSlug: "stavanger", kind: "port" },
      { label: "Southampton", kind: "return" },
    ],
  },
  "viking-norway-cruises": {
    summary: "Destination intensive fjord routes with longer port stays.",
    stops: [
      { label: "Bergen", portSlug: "bergen", kind: "embark" },
      { label: "Flåm", portSlug: "flam", kind: "port" },
      { label: "Geiranger", portSlug: "geiranger", kind: "port" },
      { label: "Eidfjord", portSlug: "eidfjord", kind: "port" },
      { label: "Stavanger", portSlug: "stavanger", kind: "port" },
      { label: "Bergen", kind: "return" },
    ],
  },
  "holland-america-norway": {
    summary: "In depth 14 night loops from Rotterdam with Trondheim and Hardanger.",
    stops: [
      { label: "Rotterdam", kind: "embark" },
      { label: "Eidfjord", portSlug: "eidfjord", kind: "port" },
      { label: "Trondheim", portSlug: "trondheim", kind: "port" },
      { label: "Ålesund", portSlug: "alesund", kind: "port" },
      { label: "Olden", portSlug: "olden", kind: "port" },
      { label: "Rotterdam", kind: "return" },
    ],
  },
  "princess-cruises-norway": {
    summary: "North Atlantic routes with Olden glacier days and Stavanger fjords.",
    stops: classicSouthamptonLoop,
  },
  "royal-caribbean-norway": {
    summary: "Select Northern Europe calls focused on Olden and Stavanger.",
    stops: [
      { label: "Southampton", kind: "embark" },
      { label: "Stavanger", portSlug: "stavanger", kind: "port" },
      { label: "Olden", portSlug: "olden", kind: "port" },
      { label: "Kristiansand", kind: "port" },
      { label: "Southampton", kind: "return" },
    ],
  },
  "disney-cruise-line-norway": {
    summary: "Family voyages from Copenhagen with gentle western Norway ports.",
    stops: [
      { label: "Copenhagen", kind: "embark" },
      { label: "Bergen", portSlug: "bergen", kind: "port" },
      { label: "Stavanger", portSlug: "stavanger", kind: "port" },
      { label: "Ålesund", portSlug: "alesund", kind: "port" },
      { label: "Olden", portSlug: "olden", kind: "port" },
      { label: "Copenhagen", kind: "return" },
    ],
  },
  "norwegian-cruise-line-norway": {
    summary: "Freestyle Northern Europe with Bergen and Ålesund emphasis.",
    stops: [
      { label: "Southampton", kind: "embark" },
      { label: "Bergen", portSlug: "bergen", kind: "port" },
      { label: "Ålesund", portSlug: "alesund", kind: "port" },
      { label: "Stavanger", portSlug: "stavanger", kind: "port" },
      { label: "Southampton", kind: "return" },
    ],
  },
};

export function getNorwayItineraryForLine(
  slug: string,
): CruiseLineNorwayItinerary | undefined {
  return norwayItineraryByCruiseLineSlug[slug];
}
