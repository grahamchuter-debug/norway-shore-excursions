import { ports } from "@/lib/ports-data";

export type CruiseLineData = {
  slug: string;
  name: string;
  shortName: string;
  metaDescription: string;
  headline: string;
  lead: string;
  planningTips: readonly string[];
  recommendedPortSlugs: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};

export const cruiseLines: readonly CruiseLineData[] = [
  {
    slug: "p-and-o-norway-shore-excursions",
    name: "P&O Cruises",
    shortName: "P&O",
    metaDescription:
      "Independent shore excursion planning guide for P&O Cruises passengers visiting Norway fjord and Arctic ports.",
    headline: "P&O Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for P&O Cruises passengers sailing Norway, not affiliated with P&O Cruises.",
    planningTips: [
      "P&O Norway itineraries often combine Bergen, Flåm, and Geiranger on classic fjord routes.",
      "Use the Norway Cruise Planner to match your ship's port times with Stegastein, Mostraumen, or Dalsnibba excursions.",
      "Independent tours can offer smaller groups, always confirm return times against P&O's all aboard deadline.",
      "Book popular fjord excursions early on summer multi-ship days in Flåm and Geiranger.",
    ],
    recommendedPortSlugs: ["bergen", "flam", "geiranger", "stavanger"],
    faqs: [
      { question: "Is this an official P&O guide?", answer: "No. This is an independent shore excursion planning guide with no partnership or endorsement from P&O Cruises." },
      { question: "Can P&O passengers book independent excursions?", answer: "Yes, subject to your own return to ship responsibility and any visa or insurance requirements." },
    ],
  },
  {
    slug: "msc-norway-shore-excursions",
    name: "MSC Cruises",
    shortName: "MSC",
    metaDescription:
      "Independent shore excursion planning guide for MSC Cruises Norway sailings with port-by-port excursion recommendations.",
    headline: "MSC Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for MSC Cruises passengers visiting Norway, not affiliated with MSC Cruises.",
    planningTips: [
      "MSC Norway programmes frequently include Geiranger, Flåm, and Honningsvåg on summer and Arctic routes.",
      "Tender ports like Geiranger need extra boarding time, factor this into MSC port days.",
      "Compare ship excursion durations with independent options using our cruise fit scores.",
      "Arctic MSC calls from Honningsvåg suit North Cape organised tours with strict coach schedules.",
    ],
    recommendedPortSlugs: ["geiranger", "flam", "honningsvag", "bergen"],
    faqs: [
      { question: "Is this affiliated with MSC?", answer: "No. We provide independent planning guidance only." },
      { question: "Does MSC allow independent shore excursions?", answer: "Generally yes, but passengers must return before the published all aboard time." },
    ],
  },
  {
    slug: "princess-norway-shore-excursions",
    name: "Princess Cruises",
    shortName: "Princess",
    metaDescription:
      "Independent shore excursion planning guide for Princess Cruises Norway fjord itineraries and port timing tips.",
    headline: "Princess Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for Princess Cruises passengers visiting Norway, not affiliated with Princess Cruises.",
    planningTips: [
      "Princess often schedules extended port time in Bergen and Olden, ideal for Mostraumen or Briksdal Glacier.",
      "Use our planner to align Princess port hours with glacier and fjord excursion durations.",
      "Princess passengers benefit from independent booking when ship tours sell out in peak fjord season.",
      "Check whether your Princess sailing uses Skolten or Dokken terminal in Bergen for walking time.",
    ],
    recommendedPortSlugs: ["bergen", "olden", "flam", "geiranger"],
    faqs: [
      { question: "Is this an official Princess resource?", answer: "No. This is an independent cruise excursion planning guide." },
      { question: "Which Princess Norway ports are most popular?", answer: "Bergen, Flåm, Geiranger, and Olden dominate most Princess fjord programmes." },
    ],
  },
  {
    slug: "celebrity-norway-shore-excursions",
    name: "Celebrity Cruises",
    shortName: "Celebrity",
    metaDescription:
      "Independent shore excursion planning guide for Celebrity Cruises Norway sailings with premium port recommendations.",
    headline: "Celebrity Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for Celebrity Cruises passengers visiting Norway, not affiliated with Celebrity Cruises.",
    planningTips: [
      "Celebrity Norway routes often emphasise scenic ports like Geiranger and Ålesund.",
      "Private and small group independent tours align well with Celebrity passenger preferences.",
      "Use the Norway Cruise Planner for AI style recommendations matched to your Celebrity itinerary.",
      "Celebrity Arctic sailings may include Tromsø, plan aurora or Sami culture excursions seasonally.",
    ],
    recommendedPortSlugs: ["geiranger", "alesund", "bergen", "tromso"],
    faqs: [
      { question: "Does Celebrity partner with this site?", answer: "No. We are an independent planning authority with no cruise line partnerships." },
      { question: "Are private tours worth it on Celebrity?", answer: "Many passengers prefer them for flexibility, confirm timing against your all aboard deadline." },
    ],
  },
  {
    slug: "royal-caribbean-norway-shore-excursions",
    name: "Royal Caribbean",
    shortName: "Royal Caribbean",
    metaDescription:
      "Independent shore excursion planning guide for Royal Caribbean Norway cruises with family-friendly port tips.",
    headline: "Royal Caribbean Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for Royal Caribbean passengers visiting Norway, not affiliated with Royal Caribbean.",
    planningTips: [
      "Royal Caribbean Norway sailings often feature large ship ports: Bergen, Stavanger, and Flåm.",
      "Family friendly options include Ålesund Ocean Park and Bergen walking tours.",
      "Large ship days mean longer gangway queues, add buffer time before all aboard.",
      "Use independent local sites linked from our port guides when Royal Caribbean ship tours sell out.",
    ],
    recommendedPortSlugs: ["bergen", "stavanger", "flam", "alesund"],
    faqs: [
      { question: "Is this an official Royal Caribbean guide?", answer: "No. Independent shore excursion planning guide only." },
      { question: "Can I leave the ship without a Royal Caribbean excursion?", answer: "Yes, with responsibility for timely return. See our return to ship guide for buffer tips." },
    ],
  },
  {
    slug: "holland-america-norway-shore-excursions",
    name: "Holland America Line",
    shortName: "Holland America",
    metaDescription:
      "Independent shore excursion planning guide for Holland America Line Norway and fjord cruise itineraries.",
    headline: "Holland America Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for Holland America Line passengers visiting Norway, not affiliated with Holland America Line.",
    planningTips: [
      "Holland America excels on in-depth Norway routes with longer port stays in Trondheim and Eidfjord.",
      "Use extended port time for Vøringsfossen from Eidfjord or Trondheim cathedral tours.",
      "HAL passengers often prefer cultural walks plus one headline scenic excursion per voyage.",
      "Our planner scores Holland America friendly ports by excursion type and timing.",
    ],
    recommendedPortSlugs: ["trondheim", "eidfjord", "bergen", "flam"],
    faqs: [
      { question: "Is Holland America affiliated with this site?", answer: "No. We provide independent excursion planning only." },
      { question: "Which HAL ports suit slow-paced touring?", answer: "Trondheim, Kristiansand, and Eidfjord reward unhurried cultural and nature days." },
    ],
  },
  {
    slug: "cunard-norway-shore-excursions",
    name: "Cunard",
    shortName: "Cunard",
    metaDescription:
      "Independent shore excursion planning guide for Cunard Norway voyages with elegant port day recommendations.",
    headline: "Cunard Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for Cunard passengers visiting Norway, not affiliated with Cunard.",
    planningTips: [
      "Cunard Norway voyages often include classic fjord ports with formal onboard culture ashore in Bergen and Stavanger.",
      "Private sightseeing and refined walking tours suit Cunard passenger pacing.",
      "Allow generous return buffers on tender days in Geiranger when travelling with Cunard.",
      "Link through to local port specialists for independently operated Cunard-friendly tours.",
    ],
    recommendedPortSlugs: ["bergen", "stavanger", "geiranger", "flam"],
    faqs: [
      { question: "Official Cunard partnership?", answer: "No. This is an independent shore excursion planning guide." },
      { question: "Does Cunard visit Arctic ports?", answer: "Some Cunard itineraries include Honningsvåg or Tromsø, check your specific sailing." },
    ],
  },
  {
    slug: "norwegian-cruise-line-norway-shore-excursions",
    name: "Norwegian Cruise Line",
    shortName: "NCL",
    metaDescription:
      "Independent shore excursion planning guide for Norwegian Cruise Line Norway sailings and freestyle port planning.",
    headline: "Norwegian Cruise Line Norway Shore Excursions",
    lead: "An independent shore excursion planning guide for Norwegian Cruise Line passengers visiting Norway, not affiliated with NCL.",
    planningTips: [
      "NCL freestyle cruising lets you choose independent excursions, plan return timing carefully.",
      "NCL Norway routes commonly feature Geiranger, Olden, and Bergen on fjord-heavy schedules.",
      "Use our smart cruise planner to build a port-by-port plan before you sail.",
      "NCL multi-port days benefit from pre-booking Briksdal and Stegastein on peak summer dates.",
    ],
    recommendedPortSlugs: ["geiranger", "olden", "bergen", "flam"],
    faqs: [
      { question: "Is NCL partnered with Norway Shore Excursions?", answer: "No. We are an independent national planning authority." },
      { question: "Can NCL guests book third-party tours?", answer: "Yes, with independent return to ship responsibility." },
    ],
  },
] as const;

export const cruiseLineBySlug = Object.fromEntries(
  cruiseLines.map((c) => [c.slug, c]),
) as Record<string, CruiseLineData>;

export const cruiseLineSlugs = cruiseLines.map((c) => c.slug);

export const localPortSites = ports.map((p) => ({
  slug: p.slug,
  name: p.displayName,
  url: p.localSiteUrl,
  region: p.region,
}));
