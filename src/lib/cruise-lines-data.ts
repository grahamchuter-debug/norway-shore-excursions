import type { CruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { ports } from "@/lib/ports-data";
import { getShipScheduleSummaryBySlug, shipPagePath } from "@/lib/ship-schedules";

export type CruiseLinePassengerSnapshot = {
  bestFor: string;
  luxuryLevel: string;
  familyFriendly: string;
  typicalCruiseLength: string;
  popularDeparturePort: string;
  popularShip: string;
  norwaySeason: string;
};

export type CruiseLineExcursionStyle = {
  style: "scenic" | "small-group" | "private" | "family" | "fjord";
  title: string;
  description: string;
};

export type CruiseLineData = {
  slug: string;
  scheduleKey: CruiseLineScheduleKey;
  name: string;
  shortName: string;
  metaDescription: string;
  headline: string;
  lead: string;
  overview: string;
  typicalItineraries: string;
  fjordDestinations: string;
  cruiseStyle: string;
  passengerTypes: string;
  typicalShoreTime: string;
  passengerSnapshot: CruiseLinePassengerSnapshot;
  excursionStyles: readonly CruiseLineExcursionStyle[];
  planningTips: readonly string[];
  recommendedPortSlugs: readonly string[];
  /** Curated ship slugs for the Ships Sailing Norway section (schedule data fills call counts). */
  featuredShipSlugs?: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};

/** Cruise line guides shown in the compare section on line pages. */
export const compareNorwayCruiseLineSlugs = [
  "cunard-norway",
  "holland-america-norway",
  "celebrity-cruises-norway",
  "p-and-o-cruises-norway",
  "msc-cruises-norway",
  "princess-cruises-norway",
] as const;

export const cruiseLinePagePath = (slug: string) => `/cruise-lines/${slug}`;

/**
 * Reserved nested URL for future per line ship pages.
 * Production ship pages today use {@link shipPagePath} from ship-schedules.
 * When nested pages launch, prefer {@link cruiseLineShipPagePath} over the
 * cruise line anchor fallback in {@link resolveFeaturedShipCardHref}.
 */
export const cruiseLineShipPagePath = (slug: string) =>
  `/cruise-lines/ships/${slug}`;

export const cruiseLinePopularShipsAnchor = "popular-ships";

/** Headline ports shown on cruise line pages when schedule data confirms a call. */
export const FEATURED_CRUISE_LINE_PORT_SLUGS = [
  "flam",
  "bergen",
  "geiranger",
  "olden",
  "stavanger",
  "alesund",
  "honningsvag",
  "trondheim",
] as const;

export function resolveFeaturedShipCardHref(
  shipSlug: string,
  cruiseLineSlug: string,
): string {
  if (getShipScheduleSummaryBySlug(shipSlug)) {
    return shipPagePath(shipSlug);
  }
  // Future nested pages: cruiseLineShipPagePath(shipSlug)
  return `${cruiseLinePagePath(cruiseLineSlug)}#${cruiseLinePopularShipsAnchor}`;
}

export const cruiseLines: readonly CruiseLineData[] = [
  {
    slug: "msc-cruises-norway",
    scheduleKey: "msc",
    name: "MSC Cruises",
    shortName: "MSC",
    metaDescription:
      "MSC Cruises Norway guide with 2026 ship schedules, fjord ports and independent shore excursion planning for MSC passengers.",
    headline: "MSC Cruises Norway",
    lead: "MSC Norway planning with 2026 schedules, port guides and independent excursions.",
    overview:
      "Busy summer fjord loops through Bergen, Flåm, Geiranger and Stavanger. Match port times to independent tours.",
    typicalItineraries:
      "7 night loops from Hamburg or Southampton: Bergen, Flåm, Geiranger, Stavanger; some Arctic extensions.",
    fjordDestinations:
      "Geirangerfjord, Aurlandsfjord at Flåm, Lysefjord from Stavanger, Hardanger from Eidfjord.",
    cruiseStyle:
      "Large resort ships with broad dining and family facilities; full day headline fjord calls.",
    passengerTypes:
      "Families and value focused European cruisers wanting big ship amenities with fjord scenery.",
    typicalShoreTime:
      "8 to 10 hours in headline ports; shorter when multiple MSC ships share Flåm or Geiranger.",
    featuredShipSlugs: ["msc-euribia", "msc-virtuosa", "msc-preziosa"],
    passengerSnapshot: {
      bestFor: "Families and first time Norway cruisers on big ship budgets",
      luxuryLevel: "Mainstream resort",
      familyFriendly: "Strong, with kids clubs and flexible dining",
      typicalCruiseLength: "7 to 14 nights",
      popularDeparturePort: "Hamburg, Southampton and Kiel",
      popularShip: "MSC Euribia",
      norwaySeason: "May through September, with peak July sailings",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "MSC passengers often book Stegastein, Eagle Road or Dalsnibba viewpoint drives on full day fjord ports.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Independent minibus tours help MSC groups escape the largest ship coach crowds in Flåm and Geiranger.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private drivers suit families who want a custom pace between Bergen city walks and a single headline viewpoint.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Flåm railway, Briksdal lake boats and compact Stavanger walks work well for multigenerational MSC groups.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Mostraumen from Bergen, Naeroyfjord sailings from Flåm and Geirangerfjord transit tours anchor MSC port days.",
      },
    ],
    planningTips: [
      "Euribia leads our MSC Norway data with heavy Flåm, Geiranger and Ålesund rotations.",
      "Use the Norway Cruise Planner to test Naeroyfjord and Stegastein against MSC all aboard times.",
      "Book small group tours early when Virtuosa or Euribia share Geiranger in peak July.",
      "Confirm departure port before stacking two long scenic excursions on one port day.",
    ],
    recommendedPortSlugs: ["bergen", "flam", "geiranger", "stavanger", "eidfjord"],
    faqs: [
      {
        question: "Which MSC ships visit Norway in 2026?",
        answer: "Our schedule data tracks MSC Euribia, MSC Magnifica, MSC Preziosa and MSC Virtuosa on Norway calls. Search by ship name for your exact sailing dates.",
      },
      {
        question: "Does MSC allow independent shore excursions in Norway?",
        answer: "Yes. MSC passengers can book third party tours, but you must return before the published all aboard time. Use our fit calculator to check tour duration against your port window.",
      },
      {
        question: "Which Norway ports does MSC visit most often?",
        answer: "Bergen, Flåm, Geiranger, Olden and Stavanger appear most frequently on MSC Norway schedules. Each port has a dedicated guide with local excursion links.",
      },
      {
        question: "Is this an official MSC Cruises guide?",
        answer: "No. Norway Shore Excursions is an independent planning authority with no partnership or endorsement from MSC Cruises.",
      },
    ],
  },
  {
    slug: "p-and-o-cruises-norway",
    scheduleKey: "p-and-o",
    name: "P&O Cruises",
    shortName: "P&O",
    metaDescription:
      "P&O Cruises Norway guide with 2026 ship schedules, fjord port calls and independent shore excursion planning for P&O passengers.",
    headline: "P&O Cruises Norway",
    lead: "P&O Norway planning with 2026 schedules, port guides and independent excursions.",
    overview:
      "Iona and Britannia anchor busy British fjord loops. Plan Bergen, Flåm, Olden and Stavanger independently.",
    typicalItineraries:
      "7 to 14 night fjord cruises from Southampton: Bergen, Flåm, Olden, Geiranger, Stavanger.",
    fjordDestinations:
      "Geiranger, Flåm, Olden for glaciers; Stavanger for Lysefjord; Skjolden on select sailings.",
    cruiseStyle:
      "British mainstream with inclusive dining tiers and relaxed onboard culture; iconic fjord ports.",
    passengerTypes:
      "UK couples, families and groups booking school holiday sailings.",
    typicalShoreTime:
      "9 to 11 hours ashore on most fjord calls; add buffers on Geiranger tender days.",
    featuredShipSlugs: ["iona", "britannia", "arcadia", "aurora"],
    passengerSnapshot: {
      bestFor: "UK families and couples on classic British summer fjord loops",
      luxuryLevel: "Mainstream British",
      familyFriendly: "Strong, with school holiday sailings",
      typicalCruiseLength: "7 to 14 nights",
      popularDeparturePort: "Southampton",
      popularShip: "Iona",
      norwaySeason: "May through September",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "P&O passengers frequently choose Stegastein, Briksdal glacier valleys and Geiranger viewpoint drives.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Smaller independent groups help P&O travellers avoid the longest coach queues on Iona and Britannia peak days.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private guides suit couples who want Bergen Bryggen and a single fjord highlight in one measured day.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Flåm railway, Olden lake boats and Stavanger old town walks fit P&O multigenerational port plans.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Naeroyfjord sailings, Geirangerfjord transit and Lysefjord trips match P&O scenic Norway itineraries.",
      },
    ],
    planningTips: [
      "Iona and Britannia dominate our P&O data; Olden and Stavanger are busiest ports.",
      "Match Briksdal or Stegastein buffers to your P&O port times in the planner.",
      "Minibus tours help on school holiday days when Iona and Britannia share Flåm.",
      "Search by ship to see if your sailing includes Ålesund or Skjolden instead of Olden.",
    ],
    recommendedPortSlugs: ["bergen", "flam", "geiranger", "stavanger", "olden"],
    faqs: [
      {
        question: "Which P&O ships visit Norway in 2026?",
        answer: "Iona, Britannia, Aurora, Arcadia and Arvia all appear on our Norway schedule data. Search by ship for your sailing month and port times.",
      },
      {
        question: "Can P&O passengers book independent excursions?",
        answer: "Yes, subject to your own return to ship responsibility and any visa or insurance requirements. See our return to ship guide for buffer tips.",
      },
      {
        question: "Which Norway ports does P&O visit most?",
        answer: "Bergen, Flåm, Olden and Stavanger dominate P&O Norway programmes. Each port page links to independent local excursion specialists.",
      },
      {
        question: "Is this an official P&O guide?",
        answer: "No. This is an independent shore excursion planning guide with no partnership or endorsement from P&O Cruises.",
      },
    ],
  },
  {
    slug: "celebrity-cruises-norway",
    scheduleKey: "celebrity",
    name: "Celebrity Cruises",
    shortName: "Celebrity",
    metaDescription:
      "Celebrity Cruises Norway guide with 2026 ship schedules, fjord ports and independent shore excursion planning for Celebrity passengers.",
    headline: "Celebrity Cruises Norway",
    lead: "Celebrity Norway planning with Apex and Eclipse schedules, port guides and independent excursions.",
    overview:
      "Apex leads our 2026 Celebrity data with Geiranger, Flåm, Bergen and Ålesund. Suited to upscale couples and small group touring.",
    typicalItineraries:
      "7 to 12 night premium fjord routes from Southampton or Amsterdam, sometimes Arctic ports.",
    fjordDestinations:
      "Geirangerfjord, Aurlandsfjord, Molde and Romsdal; Honningsvåg or Tromsø on longer voyages.",
    cruiseStyle:
      "Modern premium ships with elevated dining and cosmopolitan feel; scenic, culinary port days.",
    passengerTypes:
      "Couples and experienced cruisers wanting upscale comfort without ultra luxury pricing.",
    typicalShoreTime:
      "Often 9 to 12 hours on fjord days, ideal for private touring and slow dining ashore.",
    featuredShipSlugs: ["celebrity-apex", "celebrity-eclipse"],
    passengerSnapshot: {
      bestFor: "Couples and premium travellers who want design forward ships",
      luxuryLevel: "Premium",
      familyFriendly: "Moderate, with some family sailings",
      typicalCruiseLength: "7 to 12 nights",
      popularDeparturePort: "Southampton and Amsterdam",
      popularShip: "Celebrity Apex",
      norwaySeason: "May through September, plus occasional Arctic voyages",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Celebrity passengers gravitate toward Dalsnibba, Eagle Road and curated viewpoint drives with fewer coach stops.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group independent tours align with Celebrity preferences for intimate guiding and flexible photo stops.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private drivers and guides suit Celebrity couples pairing Bergen food walks with a single fjord highlight.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Older teens enjoy Flåm railway and Geiranger boat tours when Celebrity sailings include multigenerational groups.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Geirangerfjord transit, Mostraumen and Lysefjord sailings fit Celebrity scenic Norway programmes.",
      },
    ],
    planningTips: [
      "Celebrity Apex repeats Geiranger and Flåm in our data, ideal for Eagle Road or Dalsnibba with fewer coach stops.",
      "Book private drivers when you want Bergen food markets and one fjord highlight in a single measured day.",
      "Use the Norway Cruise Planner to compare small group timings against Celebrity all aboard deadlines.",
      "Honningsvåg calls in our data are seasonal. Plan Arctic excursions only when your sailing lists the port.",
    ],
    recommendedPortSlugs: ["geiranger", "bergen", "flam", "olden", "stavanger"],
    faqs: [
      {
        question: "Which Celebrity ships sail Norway in 2026?",
        answer: "Celebrity Apex and Celebrity Eclipse appear most often in our Norway schedule data. Use ship search to confirm your exact dates and port times.",
      },
      {
        question: "Are private tours worth it on Celebrity?",
        answer: "Many Celebrity passengers prefer independent tours for flexibility and smaller groups. Confirm timing against your all aboard deadline using our fit calculator.",
      },
      {
        question: "Does Celebrity partner with this site?",
        answer: "No. We are an independent planning authority with no cruise line partnerships.",
      },
      {
        question: "Which Celebrity Norway ports suit scenic excursions?",
        answer: "Geiranger, Flåm and Bergen offer the headline fjord and city experiences. Olden suits glacier focused days like Briksdal.",
      },
    ],
  },
  {
    slug: "cunard-norway",
    scheduleKey: "cunard",
    name: "Cunard",
    shortName: "Cunard",
    metaDescription:
      "Cunard Norway guide with 2026 ship schedules, port calls and independent shore excursion planning for Cunard passengers.",
    headline: "Cunard Norway",
    lead: "Cunard Norway planning with Queen Anne and Queen Mary 2 schedules and independent excursions.",
    overview:
      "Ballroom evenings meet Bergen, Olden, Ålesund and Stavanger. Queen Anne leads our 2026 call counts.",
    typicalItineraries:
      "9 to 14 night Northern Europe or transatlantic segments with Bergen, Stavanger, Flåm, Geiranger.",
    fjordDestinations:
      "Olden for Nordfjord glaciers, Geiranger for UNESCO scenery, Stavanger for Lysefjord.",
    cruiseStyle:
      "Ocean liner heritage with formal evenings and lecture programmes; unhurried cultural touring.",
    passengerTypes:
      "Mature travellers and couples who value classic service and refined shore days.",
    typicalShoreTime:
      "8 to 10 hours on most calls; plan extra return time for Geiranger tenders.",
    featuredShipSlugs: [
      "queen-anne",
      "queen-mary-2",
      "queen-victoria",
      "queen-elizabeth",
    ],
    passengerSnapshot: {
      bestFor: "Mature couples and ocean liner enthusiasts",
      luxuryLevel: "Premium to luxury ocean liner",
      familyFriendly: "Limited, adult oriented culture",
      typicalCruiseLength: "9 to 14 nights",
      popularDeparturePort: "Southampton and Hamburg",
      popularShip: "Queen Anne",
      norwaySeason: "May through September",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Cunard passengers often choose refined viewpoint drives and fjord panoramas at a measured pace.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group cultural walks in Bergen and Stavanger suit Cunard's unhurried shore day style.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private guides and chauffeurs match Cunard couples who want cathedral visits plus one scenic highlight.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Multigenerational Cunard groups do well with compact city tours and gentle Briksdal lake boat sections.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Geirangerfjord transit and Lysefjord sailings complement Cunard scenic Norway segments.",
      },
    ],
    planningTips: [
      "Queen Anne and Queen Mary 2 favour Olden glacier valleys and compact Bergen walks over rushed multi stop coach days.",
      "Match formal evening plans with shorter afternoon returns on tender or busy pier days.",
      "Use the Norway Cruise Planner to score cathedral walks and Briksdal lake boats against your all aboard time.",
      "Book independent guides early when Cunard shares Bergen or Stavanger with other summer ships.",
    ],
    recommendedPortSlugs: ["bergen", "stavanger", "geiranger", "flam", "olden"],
    faqs: [
      {
        question: "Which Cunard ships visit Norway in 2026?",
        answer: "Queen Mary 2 and Queen Anne appear in our Norway schedule data. Search by ship name for your sailing dates.",
      },
      {
        question: "Does Cunard visit Arctic ports?",
        answer: "Some Cunard itineraries include Honningsvåg or Tromsø. Check your specific sailing and use our port guides for Arctic planning.",
      },
      {
        question: "What shore excursions suit Cunard passengers?",
        answer: "Cultural walking tours in Bergen and Stavanger, plus scenic fjord excursions from Flåm and Geiranger, match Cunard's refined pace.",
      },
      {
        question: "Official Cunard partnership?",
        answer: "No. This is an independent shore excursion planning guide with no affiliation to Cunard.",
      },
    ],
  },
  {
    slug: "viking-norway-cruises",
    scheduleKey: "viking",
    name: "Viking",
    shortName: "Viking",
    metaDescription:
      "Viking Norway cruises guide with 2026 ship schedules, fjord ports and independent shore excursion planning for Viking Ocean passengers.",
    headline: "Viking Norway Cruises",
    lead: "Viking Norway planning with 2026 schedules, port guides and independent excursions.",
    overview:
      "Six Viking Ocean ships rotate through Bergen, Flåm, Geiranger, Eidfjord and Stavanger in our data.",
    typicalItineraries:
      "8 to 15 night fjord intensive routes with repeat calls at headline villages.",
    fjordDestinations:
      "Geirangerfjord, Naeroyfjord at Flåm, Hardanger from Eidfjord, Lysefjord from Stavanger.",
    cruiseStyle:
      "Small to mid size ships with understated luxury and destination focus; included dining wine.",
    passengerTypes:
      "Well travelled adults who prefer cultural immersion and longer port stays.",
    typicalShoreTime:
      "Often 10 to 12 hours, longer than many mainstream lines for deeper touring.",
    featuredShipSlugs: [
      "viking-neptune",
      "viking-sky",
      "viking-vela",
      "viking-jupiter",
    ],
    passengerSnapshot: {
      bestFor: "Well travelled adults focused on destination immersion",
      luxuryLevel: "Upscale destination focused",
      familyFriendly: "Adults only ships",
      typicalCruiseLength: "8 to 15 nights",
      popularDeparturePort: "Bergen, Amsterdam and London area ports",
      popularShip: "Viking Neptune",
      norwaySeason: "April through October",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Viking passengers often add independent viewpoint tours beyond included scenic introductions.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group specialists suit Viking travellers seeking deeper local guiding in Bergen and Stavanger.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private touring works well when Viking's longer port windows allow a custom fjord and city combination.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Viking Ocean ships are adults focused, so family style touring applies mainly to multigenerational private groups ashore.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Naeroyfjord, Geirangerfjord and Hardanger sailings align with Viking's fjord intensive Norway routes.",
      },
    ],
    planningTips: [
      "Viking Norway programmes emphasise cultural depth and scenic fjord sailing.",
      "Viking ships often spend longer in port, ideal for independent excursions beyond ship tours.",
      "Use our planner to build a port by port plan before you sail.",
      "Viking passengers benefit from pre booking Stegastein and Mostraumen on peak summer dates.",
    ],
    recommendedPortSlugs: ["bergen", "flam", "geiranger", "eidfjord", "stavanger"],
    faqs: [
      {
        question: "Which Viking ships visit Norway in 2026?",
        answer: "Viking Neptune, Viking Mira, Viking Saturn, Viking Jupiter, Viking Sky and Viking Vela all appear in our Norway schedule data.",
      },
      {
        question: "Does Viking include excursions in the fare?",
        answer: "Viking Ocean fares typically include one shore excursion per port. Many passengers still book independent tours for smaller groups or specific interests.",
      },
      {
        question: "Which Norway ports does Viking visit most?",
        answer: "Bergen, Flåm, Geiranger, Eidfjord and Stavanger dominate Viking Norway schedules in our 2026 data.",
      },
      {
        question: "Is this affiliated with Viking?",
        answer: "No. Norway Shore Excursions is an independent planning guide with no partnership from Viking.",
      },
    ],
  },
  {
    slug: "holland-america-norway",
    scheduleKey: "holland-america",
    name: "Holland America Line",
    shortName: "Holland America",
    metaDescription:
      "Holland America Norway guide with 2026 ship schedules, fjord ports and independent shore excursion planning for HAL passengers.",
    headline: "Holland America Norway",
    lead: "Holland America Norway planning with Rotterdam and Nieuw Statendam schedules and excursions.",
    overview:
      "Longer loops from Rotterdam with Ålesund, Olden and Trondheim. Museum mornings and one scenic highlight per voyage.",
    typicalItineraries:
      "14 night in depth loops from Rotterdam or Amsterdam: Eidfjord, Trondheim, Bergen, fjord villages.",
    fjordDestinations:
      "Hardanger from Eidfjord, Nordfjord at Olden, Geiranger on select sailings, Trondheim fjord access.",
    cruiseStyle:
      "Classic HAL with music, culinary programmes and comfortable traditional ships.",
    passengerTypes:
      "Couples who enjoy slower touring, museums and one headline scenic day per voyage.",
    typicalShoreTime:
      "9 to 11 hours in Trondheim and Eidfjord on in depth sailings.",
    featuredShipSlugs: ["rotterdam", "nieuw-statendam", "zuiderdam"],
    passengerSnapshot: {
      bestFor: "Couples who prefer slower paced cultural and scenic touring",
      luxuryLevel: "Premium classic",
      familyFriendly: "Moderate, with some multigenerational groups",
      typicalCruiseLength: "14 nights on in depth routes",
      popularDeparturePort: "Rotterdam and Amsterdam",
      popularShip: "Nieuw Statendam",
      norwaySeason: "May through September",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "HAL passengers often choose one headline scenic day such as Vøringsfossen or Stegastein per voyage.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group walks in Trondheim and Bergen suit Holland America's museum focused port pacing.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private drivers help HAL couples link cathedral visits with a single fjord or waterfall highlight.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Gentle Eidfjord waterfall trips and compact Bergen walks work for HAL multigenerational groups.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Hardanger sailings, Geiranger transit and Lysefjord trips fit HAL scenic Norway programmes.",
      },
    ],
    planningTips: [
      "Nieuw Statendam and Rotterdam appear most often in our HAL Norway data, with Ålesund and Olden as repeat scenic stops.",
      "Use long Trondheim port windows for Nidaros Cathedral walks before adding a waterfall excursion.",
      "Pair one Vøringsfossen or Briksdal day with unhurried city touring rather than stacking two long coach trips.",
      "Search ship schedules by name to confirm whether your sailing includes Eidfjord or Geiranger.",
    ],
    recommendedPortSlugs: ["bergen", "eidfjord", "flam", "trondheim", "stavanger"],
    faqs: [
      {
        question: "Which Holland America ships visit Norway in 2026?",
        answer: "Rotterdam, Nieuw Statendam and Zuiderdam appear in our Norway schedule data. Search by ship for your exact sailing.",
      },
      {
        question: "Which HAL ports suit slow paced touring?",
        answer: "Trondheim, Kristiansand and Eidfjord reward unhurried cultural and nature days. Bergen suits compact city walking tours.",
      },
      {
        question: "Is Holland America affiliated with this site?",
        answer: "No. We provide independent excursion planning only.",
      },
      {
        question: "Can HAL passengers book third party tours?",
        answer: "Yes, with independent return to ship responsibility. Use our fit calculator to test tour duration against your port window.",
      },
    ],
  },
  {
    slug: "princess-cruises-norway",
    scheduleKey: "princess",
    name: "Princess Cruises",
    shortName: "Princess",
    metaDescription:
      "Princess Cruises Norway guide with 2026 Sky Princess and Majestic Princess schedules, fjord ports and independent shore excursion planning.",
    headline: "Princess Cruises Norway",
    lead: "Princess Norway planning with Sky Princess and Majestic Princess schedules and excursions.",
    overview:
      "Premium mainstream ships call Olden, Stavanger, Ålesund and select Arctic ports in our 2026 data.",
    typicalItineraries:
      "North Atlantic routes from Southampton or Copenhagen: Olden, Stavanger, Ålesund, sometimes Arctic.",
    fjordDestinations:
      "Nordfjord at Olden, Lysefjord from Stavanger, Romsdal near Ålesund; occasional Arctic extensions.",
    cruiseStyle:
      "Premium mainstream with Movies Under the Stars and relaxed American cruise culture.",
    passengerTypes:
      "North American and British couples, repeat Princess cruisers and multigenerational groups.",
    typicalShoreTime:
      "8 to 10 hours in our data; longer Olden days for Briksdal glacier tours.",
    featuredShipSlugs: ["sky-princess", "regal-princess", "majestic-princess"],
    passengerSnapshot: {
      bestFor: "Repeat Princess cruisers and couples on premium mainstream ships",
      luxuryLevel: "Premium mainstream",
      familyFriendly: "Strong on summer multigenerational sailings",
      typicalCruiseLength: "7 to 14 nights",
      popularDeparturePort: "Southampton and Copenhagen",
      popularShip: "Sky Princess",
      norwaySeason: "May through September, with occasional Arctic calls",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Princess passengers on Olden and Ålesund sailings often book Briksdal, Loen Skylift or Romsdal viewpoint drives.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group tours help Princess groups avoid the longest queues on Sky Princess peak summer port days.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private guides suit Princess couples linking Stavanger old town with a Lysefjord cruise in one day.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Briksdal lake boats, Ålesund aquarium walks and gentle Stavanger tours fit Princess family port plans.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Lysefjord sailings from Stavanger and inner fjord access at Olden anchor Princess scenic Norway days.",
      },
    ],
    planningTips: [
      "Confirm whether your Princess sailing calls at Olden or Skjolden, both appear in our 2026 data with different excursion options.",
      "Use the Norway Cruise Planner to match Sky Princess or Majestic Princess port times with Briksdal or Stegastein buffers.",
      "Arctic Princess calls to Honningsvåg or Tromsø need seasonal planning for midnight sun or early season weather.",
      "Book popular glacier and viewpoint tours early when Princess shares a port with other large ships.",
    ],
    recommendedPortSlugs: ["olden", "stavanger", "alesund", "bergen", "trondheim"],
    faqs: [
      {
        question: "Which Princess ships visit Norway in 2026?",
        answer: "Sky Princess and Majestic Princess appear in our Norway schedule data. Search by ship name for your exact sailing dates and port times.",
      },
      {
        question: "Does Princess visit Geiranger or Flåm?",
        answer: "Our 2026 Princess schedule data does not include Geiranger or Flåm calls. Check your itinerary for Olden, Skjolden, Stavanger and Ålesund instead.",
      },
      {
        question: "Can Princess passengers book independent excursions?",
        answer: "Yes, with your own return to ship responsibility. Use our fit calculator against your all aboard deadline.",
      },
      {
        question: "Is this an official Princess Cruises guide?",
        answer: "No. Norway Shore Excursions is an independent planning authority with no partnership from Princess Cruises.",
      },
    ],
  },
  {
    slug: "royal-caribbean-norway",
    scheduleKey: "royal-caribbean",
    name: "Royal Caribbean",
    shortName: "Royal Caribbean",
    metaDescription:
      "Royal Caribbean Norway guide with 2026 Liberty Of The Seas schedules, fjord port calls and independent shore excursion planning.",
    headline: "Royal Caribbean Norway",
    lead: "Royal Caribbean Norway planning with Liberty Of The Seas 2026 port data and excursions.",
    overview:
      "Mega ship energy on select Norway calls: Liberty Of The Seas visits Olden, Stavanger and Kristiansand.",
    typicalItineraries:
      "Northern Europe loops from Southampton or Barcelona, often mixing Norway with Baltic segments.",
    fjordDestinations:
      "Nordfjord at Olden and Lysefjord from Stavanger in our data, not classic Geiranger days.",
    cruiseStyle:
      "Mega resort ships with surf simulators and high energy onboard culture; dramatic port contrasts.",
    passengerTypes:
      "Families and first time cruisers wanting headline ship features plus Norway port stops.",
    typicalShoreTime:
      "8 to 9 hours in our data; plan one headline excursion per port.",
    featuredShipSlugs: ["liberty-of-the-seas"],
    passengerSnapshot: {
      bestFor: "Families and first time cruisers who want mega ship features",
      luxuryLevel: "Mainstream resort mega ship",
      familyFriendly: "Very strong, with extensive kids programming",
      typicalCruiseLength: "7 to 12 nights on Northern Europe loops",
      popularDeparturePort: "Southampton and Barcelona",
      popularShip: "Liberty Of The Seas",
      norwaySeason: "May through August",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Royal Caribbean passengers in Olden often choose Briksdal or Loen Skylift as a single headline scenic day.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group independent tours help Liberty Of The Seas passengers avoid the largest ship coach groups in port.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private drivers suit families who want a custom Olden glacier day with flexible photo stops.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Briksdal lake boats and compact Stavanger walks work well for Royal Caribbean multigenerational port days.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Lysefjord sailings from Stavanger are the main fjord cruise option on Royal Caribbean Norway calls in our data.",
      },
    ],
    planningTips: [
      "Royal Caribbean Norway programmes in our 2026 data are limited to a handful of ports. Confirm Olden and Stavanger on your sailing.",
      "Plan one headline excursion per port because mega ship port windows are often tighter than small ship days.",
      "Use the Norway Cruise Planner to test Briksdal timing against Liberty Of The Seas all aboard deadlines.",
      "Independent small group tours can reduce queue time when the ship carries thousands of passengers ashore.",
    ],
    recommendedPortSlugs: ["olden", "stavanger"],
    faqs: [
      {
        question: "Which Royal Caribbean ship visits Norway in 2026?",
        answer: "Liberty Of The Seas appears in our Norway schedule data with calls at Olden, Stavanger, Kristiansand and Skjolden.",
      },
      {
        question: "Does Royal Caribbean visit Geiranger or Flåm?",
        answer: "Our 2026 Royal Caribbean data does not include Geiranger or Flåm. Focus on Olden glacier tours and Stavanger fjord sailings instead.",
      },
      {
        question: "Are independent excursions allowed on Royal Caribbean?",
        answer: "Yes, subject to your return to ship responsibility. Allow generous buffers on busy mega ship port days.",
      },
      {
        question: "Is this affiliated with Royal Caribbean?",
        answer: "No. This is an independent shore excursion planning guide with no cruise line partnership.",
      },
    ],
  },
  {
    slug: "disney-cruise-line-norway",
    scheduleKey: "disney",
    name: "Disney Cruise Line",
    shortName: "Disney",
    metaDescription:
      "Disney Cruise Line Norway guide with 2026 Disney Dream schedules, family friendly port calls and independent shore excursion planning.",
    headline: "Disney Cruise Line Norway",
    lead: "Disney Norway planning with Disney Dream 2026 port data and family friendly excursions.",
    overview:
      "Family focused sailings: Disney Dream calls Bergen, Stavanger, Ålesund and Olden in our 2026 data.",
    typicalItineraries:
      "Northern Europe family voyages from Copenhagen or Dover with fjord villages and sea days.",
    fjordDestinations:
      "Bergen harbour, Stavanger to Lysefjord, Ålesund coastal scenery, Olden glacier access.",
    cruiseStyle:
      "Family first ships with Disney storytelling, youth clubs and gentle western Norway port days.",
    passengerTypes:
      "Families with children, Disney fans and multigenerational groups.",
    typicalShoreTime:
      "8 to 10 hours; one family friendly excursion plus pier exploration per port.",
    featuredShipSlugs: ["disney-dream"],
    passengerSnapshot: {
      bestFor: "Families with children and Disney fans",
      luxuryLevel: "Premium family",
      familyFriendly: "Excellent, core to the product",
      typicalCruiseLength: "7 to 12 nights on Northern Europe sailings",
      popularDeparturePort: "Copenhagen and Dover",
      popularShip: "Disney Dream",
      norwaySeason: "June through August",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Disney families often choose gentle viewpoint drives and harbour walks rather than long mountain hikes.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group tours help Disney families keep kids together without the largest ship coach crowds.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private family guides suit Disney groups who want nap friendly pacing between Bergen and a single scenic stop.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Briksdal lake boats, Ålesund harbour walks and Stavanger old town tours rank highly for Disney port days.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Lysefjord sailings from Stavanger and harbour cruises near Bergen fit Disney family friendly fjord plans.",
      },
    ],
    planningTips: [
      "Disney Dream Norway calls in our 2026 data include Bergen, Stavanger, Ålesund and Olden. Match excursions to your exact port list.",
      "Build in return buffers when travelling with children, especially on Briksdal or Lysefjord days from Olden or Stavanger.",
      "Use the Norway Cruise Planner to filter family friendly recommendations for your Disney itinerary.",
      "Book popular family tours early when Disney shares Stavanger or Bergen with other summer ships.",
    ],
    recommendedPortSlugs: ["bergen", "stavanger", "alesund", "olden"],
    faqs: [
      {
        question: "Which Disney ship visits Norway in 2026?",
        answer: "Disney Dream appears in our Norway schedule data with calls at Bergen, Stavanger, Ålesund and Olden.",
      },
      {
        question: "Are Disney port adventures required?",
        answer: "No. Disney passengers can book independent tours, but you must return before the published all aboard time.",
      },
      {
        question: "Which Disney Norway ports suit young children?",
        answer: "Bergen aquarium area walks, gentle Stavanger old town tours and Briksdal lake boat sections suit younger children.",
      },
      {
        question: "Is this an official Disney Cruise Line guide?",
        answer: "No. Norway Shore Excursions is independent and not affiliated with Disney Cruise Line.",
      },
    ],
  },
  {
    slug: "norwegian-cruise-line-norway",
    scheduleKey: "norwegian",
    name: "Norwegian Cruise Line",
    shortName: "NCL",
    metaDescription:
      "Norwegian Cruise Line Norway guide with 2026 Norwegian Star schedules, Bergen and Ålesund port calls and independent excursion planning.",
    headline: "Norwegian Cruise Line Norway",
    lead: "NCL Norway planning with Norwegian Star 2026 port data and freestyle excursion ideas.",
    overview:
      "Freestyle cruising with Norwegian Star calling Bergen and Ålesund frequently in our 2026 data.",
    typicalItineraries:
      "Northern Europe routes from Southampton or Copenhagen with Bergen and Ålesund emphasis.",
    fjordDestinations:
      "Bergen harbour and Ålesund coastal access in our data, not Geiranger transit days.",
    cruiseStyle:
      "Freestyle dining and entertainment on resort size ships with casual atmosphere.",
    passengerTypes:
      "Couples, friend groups and families wanting flexible dining and city focused port days.",
    typicalShoreTime:
      "9 to 11 hours in Bergen in our data, enough for city walks plus a fjord sail.",
    featuredShipSlugs: ["norwegian-star"],
    passengerSnapshot: {
      bestFor: "Couples and groups who want freestyle dining and entertainment",
      luxuryLevel: "Mainstream premium",
      familyFriendly: "Strong, with flexible dining times",
      typicalCruiseLength: "7 to 12 nights",
      popularDeparturePort: "Southampton and Copenhagen",
      popularShip: "Norwegian Star",
      norwaySeason: "May through September",
    },
    excursionStyles: [
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "NCL passengers in Bergen often combine city walks with Mostraumen or Stegastein viewpoint drives.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Small group independent tours suit NCL travellers exploring Ålesund art nouveau streets without large coach groups.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private guides help NCL groups customise Bergen food markets and a single scenic highlight in one day.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Bergen funicular rides, Ålesund aquarium visits and compact harbour walks fit NCL family port plans.",
      },
      {
        style: "fjord",
        title: "Fjord cruises",
        description:
          "Mostraumen and Osterfjord sailings from Bergen are the headline fjord option on NCL Norway calls in our data.",
      },
    ],
    planningTips: [
      "Norwegian Star dominates our 2026 NCL Norway data with repeat Bergen and Ålesund calls. Search by ship for your dates.",
      "Freestyle dining means you can align lunch ashore, but confirm excursion return times against your all aboard deadline.",
      "Use the Norway Cruise Planner for Bergen and Ålesund recommendations matched to your NCL itinerary.",
      "Book Mostraumen and popular Bergen tours early on peak summer Norwegian Star sailings.",
    ],
    recommendedPortSlugs: ["bergen", "alesund", "stavanger"],
    faqs: [
      {
        question: "Which NCL ship visits Norway in 2026?",
        answer: "Norwegian Star appears in our Norway schedule data with calls at Bergen, Ålesund and Stavanger.",
      },
      {
        question: "Does NCL visit Geiranger or Flåm?",
        answer: "Our 2026 NCL data does not include Geiranger or Flåm. Focus on Bergen fjord sailings and Ålesund coastal tours instead.",
      },
      {
        question: "Can NCL passengers book third party excursions?",
        answer: "Yes. Independent booking is allowed with your own return to ship responsibility.",
      },
      {
        question: "Is this affiliated with Norwegian Cruise Line?",
        answer: "No. This is an independent planning guide with no partnership from NCL.",
      },
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
