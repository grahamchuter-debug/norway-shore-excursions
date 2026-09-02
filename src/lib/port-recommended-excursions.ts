import { siteConfig } from "@/lib/site-config";

export type RecommendedExcursionCard = {
  title: string;
  benefit: string;
  url: string;
  ctaLabel: string;
  external?: boolean;
};

export type ExcursionPick = {
  title: string;
  url: string;
  external?: boolean;
};

export type PortCategorizedExcursions = {
  best: ExcursionPick;
  smallGroup: ExcursionPick;
  scenic: ExcursionPick;
};

/** Ports with curated tour cards (live local excursion pages). */
export const portsWithMappedExcursions = [
  "flam",
  "bergen",
  "stavanger",
  "eidfjord",
  "olden",
  "geiranger",
] as const;

export type MappedExcursionPortSlug = (typeof portsWithMappedExcursions)[number];

const mappedPortExcursions: Record<
  MappedExcursionPortSlug,
  readonly RecommendedExcursionCard[]
> = {
  flam: [
    {
      title: "Stegastein Viewpoint Shore Excursion",
      benefit: "Iconic Aurlandsfjord panorama above Flåm with minimal walking.",
      url: "https://flamshoreexcursions.com/excursions/stegastein-viewpoint",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Private Stegastein Viewpoint Tour",
      benefit: "Flexible small group routing with return to ship buffers built in.",
      url: "https://flamshoreexcursions.com/flam-shore-excursions",
      ctaLabel: "Explore private options",
      external: true,
    },
    {
      title: "Flåm Cruise Planner",
      benefit: "Personalised excursion picks matched to your ship timetable.",
      url: siteConfig.plannerPath,
      ctaLabel: "Open planner",
    },
  ],
  bergen: [
    {
      title: "Mostraumen Fjord Cruise",
      benefit: "Headline Osterfjord sailing from central Bergen harbour.",
      url: "https://bergenshoreexcursions.com/excursions/fjord-cruise-to-mostraumen",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Bergen Walking Tour",
      benefit: "Bryggen, harbour and Fish Market in a compact city loop.",
      url: "https://bergenshoreexcursions.com/excursions/bergen-walking-tour",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Private Bergen Shore Excursions",
      benefit: "Custom routing through Bryggen and harbour viewpoints on your schedule.",
      url: "https://bergenshoreexcursions.com/excursions/private-bergen-sightseeing",
      ctaLabel: "Explore private options",
      external: true,
    },
  ],
  stavanger: [
    {
      title: "Lysefjord Cruise",
      benefit: "Classic fjord sailing beneath Pulpit Rock cliffs.",
      url: "https://stavangershoreexcursions.com/excursions/lysefjord-cruise",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Stavanger Walking Tour",
      benefit: "Old Stavanger streets and harbour without a long transfer.",
      url: "https://stavangershoreexcursions.com/excursions/stavanger-walking-tour",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Private Stavanger Shore Excursions",
      benefit: "Flexible private touring from the Vågen harbour area.",
      url: "https://stavangershoreexcursions.com/stavanger-shore-excursions",
      ctaLabel: "Explore private options",
      external: true,
    },
  ],
  eidfjord: [
    {
      title: "Vøringsfossen Waterfall",
      benefit: "Norway's famous waterfall with modern canyon viewing walkways.",
      url: "https://eidfjordshoreexcursions.com/excursions/voringsfossen-waterfall",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Hardanger Scenic Tour",
      benefit: "Waterfall, Hardangervidda and Måbødalen valley in one port day.",
      url: "https://eidfjordshoreexcursions.com/excursions/best-of-eidfjord-sightseeing",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Private Eidfjord Shore Excursions",
      benefit: "Premium private sightseeing with flexible waterfall pacing.",
      url: "https://eidfjordshoreexcursions.com/excursions/private-best-of-eidfjord-sightseeing",
      ctaLabel: "Explore private options",
      external: true,
    },
  ],
  olden: [
    {
      title: "Briksdal Glacier",
      benefit: "Blue ice valley scenery with lake boat and walking options.",
      url: "https://oldenshoreexcursions.com/excursions/briksdal-glacier-olden-lake",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Loen Skylift",
      benefit: "Dramatic Nordfjord panoramas from Mount Hoven cable car.",
      url: "https://oldenshoreexcursions.com/excursions/loen-skylift-mount-hoven",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Private Olden Shore Excursions",
      benefit: "Flexible glacier touring for families and small groups.",
      url: "https://oldenshoreexcursions.com/excursions/private-briksdal-glacier-olden-lake",
      ctaLabel: "Explore private options",
      external: true,
    },
  ],
  geiranger: [
    {
      title: "Geirangerfjord Viewpoints",
      benefit: "UNESCO fjord sailing past Seven Sisters and Bridal Veil.",
      url: "https://geirangershoreexcursions.com/excursions/geiranger-fjord-sightseeing",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Mount Dalsnibba",
      benefit: "Summit skywalk views over Geirangerfjord below.",
      url: "https://geirangershoreexcursions.com/excursions/mount-dalsnibba",
      ctaLabel: "View tour",
      external: true,
    },
    {
      title: "Private Geiranger Shore Excursions",
      benefit: "Compare private touring options for longer port days.",
      url: "https://geirangershoreexcursions.com/excursions",
      ctaLabel: "Explore private options",
      external: true,
    },
  ],
};

/** Destination-specific microsite handoffs when deep tour URLs are not curated. */
const micrositeHandoffs: Record<
  string,
  { title: string; benefit: string; url: string }
> = {
  alesund: {
    title: "Ålesund local port guide",
    benefit:
      "Art Nouveau streets, Mount Aksla and coastal views — explore the dedicated Ålesund shore excursion site.",
    url: "https://alesundshoreexcursions.com",
  },
  hellesylt: {
    title: "Hellesylt local port guide",
    benefit:
      "Compare Hellesylt versus Geiranger decisions and scenic day options on the local specialist site.",
    url: "https://hellesyltshoreexcursions.com",
  },
  honningsvag: {
    title: "Honningsvåg local port guide",
    benefit:
      "North Cape distance, timing and Arctic excursion ideas on the dedicated Honningsvåg guide.",
    url: "https://honningsvagshoreexcursions.com",
  },
  kristiansand: {
    title: "Kristiansand local port guide",
    benefit:
      "Southern harbour walks, fortress and family beach options on the local Kristiansand site.",
    url: "https://kristiansandshoreexcursions.com",
  },
  molde: {
    title: "Molde local port guide",
    benefit:
      "Atlantic Ocean Road and Romsdal coastal day planning on the dedicated Molde site.",
    url: "https://moldeshoreexcursions.com",
  },
  nordfjordeid: {
    title: "Nordfjordeid local port guide",
    benefit:
      "Viking heritage, waterfalls and Nordfjord day options on the local specialist site.",
    url: "https://nordfjordeidshoreexcursions.com",
  },
  skjolden: {
    title: "Skjolden local port guide",
    benefit:
      "Inner Sognefjord village days, RIB and scenic options on the dedicated Skjolden site.",
    url: "https://skjoldenshoreexcursions.com",
  },
  tromso: {
    title: "Tromsø local port guide",
    benefit:
      "Arctic city logistics, fjord and northern lights planning on the Tromsø specialist site.",
    url: "https://tromsoshoreexcursions.com",
  },
  trondheim: {
    title: "Trondheim local port guide",
    benefit:
      "Nidaros, Bakklandet and harbour walks on the dedicated Trondheim shore excursion site.",
    url: "https://trondheimshoreexcursions.com",
  },
};

function buildFallbackExcursions(
  portSlug: string,
  fitExcursionHref: string,
): readonly RecommendedExcursionCard[] {
  const handoff = micrositeHandoffs[portSlug];
  const cards: RecommendedExcursionCard[] = [];

  if (handoff) {
    cards.push({
      title: handoff.title,
      benefit: handoff.benefit,
      url: handoff.url,
      ctaLabel: "Explore local guide",
      external: true,
    });
  }

  cards.push(
    {
      title: "Open the Norway Cruise Planner",
      benefit: "Match ports, traveller style and time ashore to excursion ideas.",
      url: siteConfig.plannerPath,
      ctaLabel: "Open planner",
    },
    {
      title: "Check if this excursion fits your cruise",
      benefit: "Test tour duration against your arrival and all aboard times.",
      url: fitExcursionHref,
      ctaLabel: "Check timing",
    },
  );

  return cards;
}

export function isMappedExcursionPort(
  portSlug: string,
): portSlug is MappedExcursionPortSlug {
  return (portsWithMappedExcursions as readonly string[]).includes(portSlug);
}

export function getPortRecommendedExcursions(
  portSlug: string,
  options: { fitExcursionHref?: string } = {},
): readonly RecommendedExcursionCard[] {
  const fitExcursionHref = options.fitExcursionHref ?? "#will-this-excursion-fit";

  if (isMappedExcursionPort(portSlug)) {
    return mappedPortExcursions[portSlug];
  }

  return buildFallbackExcursions(portSlug, fitExcursionHref);
}

export function usesFallbackExcursionCards(portSlug: string): boolean {
  return !isMappedExcursionPort(portSlug);
}

/** Fixed ports shown on every cruise line excursions section. */
export const cruiseLineExcursionPortSlugs = [
  "flam",
  "bergen",
  "olden",
  "geiranger",
  "stavanger",
  "alesund",
] as const;

export type CruiseLineExcursionPortSlug =
  (typeof cruiseLineExcursionPortSlugs)[number];

const categorizedPortExcursions: Record<
  CruiseLineExcursionPortSlug,
  PortCategorizedExcursions
> = {
  flam: {
    best: {
      title: "Stegastein Viewpoint",
      url: "https://flamshoreexcursions.com/excursions/stegastein-viewpoint",
      external: true,
    },
    smallGroup: {
      title: "Private Stegastein Tour",
      url: "https://flamshoreexcursions.com/flam-shore-excursions",
      external: true,
    },
    scenic: {
      title: "Flåm Fjord Cruise",
      url: "https://flamshoreexcursions.com/excursions/flam-fjord-cruise",
      external: true,
    },
  },
  bergen: {
    best: {
      title: "Mostraumen Fjord Cruise",
      url: "https://bergenshoreexcursions.com/excursions/fjord-cruise-to-mostraumen",
      external: true,
    },
    smallGroup: {
      title: "Private Bergen Sightseeing",
      url: "https://bergenshoreexcursions.com/excursions/private-bergen-sightseeing",
      external: true,
    },
    scenic: {
      title: "Bergen Walking Tour",
      url: "https://bergenshoreexcursions.com/excursions/bergen-walking-tour",
      external: true,
    },
  },
  olden: {
    best: {
      title: "Briksdal Glacier",
      url: "https://oldenshoreexcursions.com/excursions/briksdal-glacier-olden-lake",
      external: true,
    },
    smallGroup: {
      title: "Private Briksdal Glacier Tour",
      url: "https://oldenshoreexcursions.com/excursions/private-briksdal-glacier-olden-lake",
      external: true,
    },
    scenic: {
      title: "Loen Skylift",
      url: "https://oldenshoreexcursions.com/excursions/loen-skylift-mount-hoven",
      external: true,
    },
  },
  geiranger: {
    best: {
      title: "Mount Dalsnibba",
      url: "https://geirangershoreexcursions.com/excursions/mount-dalsnibba",
      external: true,
    },
    smallGroup: {
      title: "Private Geiranger Touring",
      url: "https://geirangershoreexcursions.com/excursions",
      external: true,
    },
    scenic: {
      title: "Geirangerfjord Sightseeing",
      url: "https://geirangershoreexcursions.com/excursions/geiranger-fjord-sightseeing",
      external: true,
    },
  },
  stavanger: {
    best: {
      title: "Lysefjord Cruise",
      url: "https://stavangershoreexcursions.com/excursions/lysefjord-cruise",
      external: true,
    },
    smallGroup: {
      title: "Stavanger Walking Tour",
      url: "https://stavangershoreexcursions.com/excursions/stavanger-walking-tour",
      external: true,
    },
    scenic: {
      title: "Private Lysefjord Cruise",
      url: "https://stavangershoreexcursions.com/stavanger-shore-excursions",
      external: true,
    },
  },
  alesund: {
    best: {
      title: "Mount Aksla Highlights",
      url: "https://alesundshoreexcursions.com/excursions/alesund-highlights-mount-aksla",
      external: true,
    },
    smallGroup: {
      title: "Ålesund Walking Tour",
      url: "https://alesundshoreexcursions.com/excursions/alesund-walking-tour",
      external: true,
    },
    scenic: {
      title: "Alnes Lighthouse Drive",
      url: "https://alesundshoreexcursions.com/excursions/alnes-lighthouse",
      external: true,
    },
  },
};

export function getPortCategorizedExcursions(
  portSlug: string,
): PortCategorizedExcursions | null {
  if (
    !(cruiseLineExcursionPortSlugs as readonly string[]).includes(portSlug)
  ) {
    return null;
  }
  return categorizedPortExcursions[portSlug as CruiseLineExcursionPortSlug];
}
