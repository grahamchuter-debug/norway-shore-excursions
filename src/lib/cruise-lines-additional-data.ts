import type { CruiseLineData } from "@/lib/cruise-lines-data";

const independentGuideFaq = (name: string) => [
  {
    question: `Is this an official ${name} page?`,
    answer: `No. This is an independent shore excursion planning guide with no partnership or endorsement from ${name}.`,
  },
  {
    question: "Where does the schedule data come from?",
    answer:
      "Ship counts and port lists are pulled from our imported Norway cruise schedule database for ports with verified data.",
  },
  {
    question: "Can I book excursions through this page?",
    answer:
      "No. Excursion links point to local port specialists or our Norway Cruise Planner. We are not affiliated with your cruise line.",
  },
];

function lineTemplate(
  slug: string,
  scheduleKey: CruiseLineData["scheduleKey"],
  name: string,
  shortName: string,
  overview: string,
  typicalItineraries: string,
  recommendedPortSlugs: readonly string[],
  featuredShipSlugs?: readonly string[],
): CruiseLineData {
  return {
    slug,
    scheduleKey,
    name,
    shortName,
    metaDescription: `${name} Norway guide with 2026 ship schedules, fjord ports and independent shore excursion planning for ${shortName} passengers.`,
    headline: `${name} Norway`,
    lead: `${shortName} Norway planning with verified 2026 schedules, port guides and independent excursions.`,
    overview,
    typicalItineraries,
    fjordDestinations:
      "Bergen, Geiranger, Flåm, Stavanger, Ålesund and Arctic ports depending on sailing length.",
    cruiseStyle: `${shortName} Norway sailings mix headline fjord ports with city and scenic coastal calls.`,
    passengerTypes: `Passengers sailing ${shortName} in Norway typically want fjord scenery with manageable port day pacing.`,
    typicalShoreTime:
      "6 to 10 hours in headline fjord ports; shorter calls on repositioning or multi port days.",
    passengerSnapshot: {
      bestFor: "Norway first timers and repeat fjord cruisers on scheduled sailings",
      luxuryLevel: "Varies by ship class within the fleet",
      familyFriendly: "Check individual ship facilities before booking long coach tours",
      typicalCruiseLength: "7 to 14 nights on summer Norway loops",
      popularDeparturePort: "Northern European homeports and UK turnarounds",
      popularShip: "See featured ships below from schedule data",
      norwaySeason: "May through September peak season",
    },
    excursionStyles: [
      {
        style: "fjord",
        title: "Fjord excursions",
        description:
          "Prioritise one headline fjord experience such as Geiranger viewpoints or a Lysefjord cruise on shorter port days.",
      },
      {
        style: "scenic",
        title: "Scenic excursions",
        description:
          "Viewpoint and scenic drive tours suit passengers who want maximum scenery within published port windows.",
      },
      {
        style: "small-group",
        title: "Small group tours",
        description:
          "Smaller vehicles can reduce queue time on busy summer days when multiple ships share a fjord port.",
      },
      {
        style: "private",
        title: "Private tours",
        description:
          "Private drivers help tailor return times when your ship publishes tight all aboard windows.",
      },
      {
        style: "family",
        title: "Family excursions",
        description:
          "Compact city walks, gentle fjord cruises and family friendly RIB trips work when port time stays under six hours.",
      },
    ],
    planningTips: [
      `Search ship schedules by name to confirm which ${shortName} ports your sailing includes.`,
      "Book headline scenic tours early on July sailings when multiple ships share Geiranger or Flåm.",
      "Use the Norway Cruise Planner to match excursion length with your published port times.",
      "Allow return to ship buffer on tender ports and busy summer weekends.",
    ],
    recommendedPortSlugs,
    featuredShipSlugs,
    faqs: independentGuideFaq(name),
  };
}

/** Cruise lines with regular Norway schedule presence (10+ verified calls). */
export const additionalCruiseLines: readonly CruiseLineData[] = [
  lineTemplate(
    "aida-norway",
    "aida",
    "AIDA Cruises",
    "AIDA",
    "AIDA dominates many Norway summer schedules with repeat calls at Bergen, Ålesund and Stavanger on German market loops.",
    "7 to 14 night North Sea and fjord loops from Hamburg and Kiel with dense port days in western Norway.",
    ["bergen", "alesund", "stavanger", "geiranger", "flam"],
    ["aidaprima", "aidanova", "aidaperla"],
  ),
  lineTemplate(
    "tui-cruises-norway",
    "tui",
    "TUI Cruises",
    "TUI",
    "Mein Schiff ships bring German speaking passengers to Bergen, Stavanger and Geiranger on summer fjord itineraries.",
    "7 night fjord loops from German ports with headline scenic days at Geiranger and Olden.",
    ["bergen", "stavanger", "geiranger", "olden", "alesund"],
    ["mein-schiff-1", "mein-schiff-3", "mein-schiff-7"],
  ),
  lineTemplate(
    "costa-cruises-norway",
    "costa",
    "Costa Cruises",
    "Costa",
    "Costa ships appear frequently at Bergen and Ålesund on Mediterranean repositioning and summer Norway programmes.",
    "Mixed 7 to 14 night sailings linking western Norway with North Sea ports.",
    ["bergen", "alesund", "stavanger", "geiranger"],
    ["costa-diadema", "costa-favolosa"],
  ),
  lineTemplate(
    "fred-olsen-norway",
    "fred-olsen",
    "Fred Olsen Cruise Lines",
    "Fred Olsen",
    "Smaller Fred Olsen ships reach compact fjord ports including Hellesylt and Eidfjord on in depth Norway routes.",
    "14 night in depth fjord voyages with village ports and longer scenic days.",
    ["eidfjord", "hellesylt", "flam", "geiranger", "bergen"],
    ["borealis", "bolette"],
  ),
  lineTemplate(
    "phoenix-reisen-norway",
    "phoenix-reisen",
    "Phoenix Reisen",
    "Phoenix Reisen",
    "German Phoenix Reisen voyages combine Bergen hub days with Geiranger and Hellesylt on classic fjord routing.",
    "14 night fjord and coastal programmes with repeat Geiranger calls.",
    ["bergen", "geiranger", "hellesylt", "flam"],
    ["america", "artania"],
  ),
  lineTemplate(
    "silversea-norway",
    "silversea",
    "Silversea",
    "Silversea",
    "Luxury Silversea expeditions and classic voyages call at Geiranger, Honningsvåg and Tromsø on select summer sailings.",
    "10 to 14 night luxury fjord and Arctic routes with longer port windows.",
    ["geiranger", "honningsvag", "tromso", "bergen"],
    ["silver-spirit", "silver-dawn"],
  ),
  lineTemplate(
    "saga-cruises-norway",
    "saga",
    "Saga Cruises",
    "Saga",
    "UK focused Saga ships visit Bergen, Stavanger and Geiranger on adults only summer Norway programmes.",
    "14 night UK turnarounds with relaxed pacing and repeat western Norway ports.",
    ["bergen", "stavanger", "geiranger", "alesund"],
  ),
  lineTemplate(
    "regent-seven-seas-norway",
    "regent",
    "Regent Seven Seas",
    "Regent",
    "All inclusive Regent voyages include Geiranger and Honningsvåg on premium fjord and Arctic itineraries.",
    "10 to 14 night luxury sailings with included shore excursions at select ports.",
    ["geiranger", "honningsvag", "bergen", "flam"],
    ["seven-seas-mariner"],
  ),
  lineTemplate(
    "ambassador-cruise-line-norway",
    "ambassador",
    "Ambassador Cruise Line",
    "Ambassador",
    "Ambassador ships serve UK passengers on Geiranger and Bergen focused summer Norway loops.",
    "14 night UK departures with classic fjord port combinations.",
    ["geiranger", "bergen", "flam", "stavanger"],
    ["ambience", "ambition"],
  ),
  lineTemplate(
    "oceania-cruises-norway",
    "oceania",
    "Oceania Cruises",
    "Oceania",
    "Oceania calls at Geiranger and Olden on food focused luxury Norway itineraries.",
    "12 to 14 night premium voyages with scenic fjord emphasis.",
    ["geiranger", "olden", "bergen", "flam"],
    ["oceania-sirena"],
  ),
  lineTemplate(
    "hapag-lloyd-norway",
    "hapag-lloyd",
    "Hapag Lloyd",
    "Hapag Lloyd",
    "German luxury operator Hapag Lloyd visits Geiranger and Honningsvåg on expedition style Norway sailings.",
    "10 to 14 night premium routes linking fjords with Arctic ports.",
    ["geiranger", "honningsvag", "bergen", "tromso"],
    ["europa-2", "europa"],
  ),
];
