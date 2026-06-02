import type { CruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { ports } from "@/lib/ports-data";

export type CruiseLinePassengerSnapshot = {
  bestFor: string;
  typicalCruiseLength: string;
  popularDeparturePorts: string;
  familyFriendly: string;
  luxuryLevel: string;
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
  faqs: readonly { question: string; answer: string }[];
};

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

export const cruiseLines: readonly CruiseLineData[] = [
  {
    slug: "msc-cruises-norway",
    scheduleKey: "msc",
    name: "MSC Cruises",
    shortName: "MSC",
    metaDescription:
      "MSC Cruises Norway guide with 2026 ship schedules, fjord ports and independent shore excursion planning for MSC passengers.",
    headline: "MSC Cruises Norway",
    lead: "Plan MSC Cruises Norway sailings with real 2026 ship call data, port guides and independent shore excursion recommendations.",
    overview:
      "MSC Cruises runs busy Norway fjord programmes each summer, with multiple ships rotating through Bergen, Flåm, Geiranger and Stavanger. Use this guide to match your MSC port times with independent excursions and return to ship buffers.",
    typicalItineraries:
      "Classic 7 night fjord loops from Hamburg or Southampton, often Bergen, Flåm, Geiranger and Stavanger, plus occasional Arctic extensions to Tromsø or Honningsvåg on longer sailings.",
    fjordDestinations:
      "MSC Norway programmes lean on Geirangerfjord, Aurlandsfjord at Flåm, Lysefjord from Stavanger and Hardanger access from Eidfjord on longer sailings.",
    cruiseStyle:
      "Large resort style ships with broad dining, entertainment and family facilities. Norway programmes emphasise scenic sailing and full day port calls on headline fjord villages.",
    passengerTypes:
      "Families, multigenerational groups and value focused European cruisers who want big ship amenities with fjord scenery.",
    typicalShoreTime:
      "Expect 8 to 10 hours in headline fjord ports and slightly shorter windows when multiple MSC ships share Flåm or Geiranger on peak summer days.",
    passengerSnapshot: {
      bestFor: "Families and first time Norway cruisers on big ship budgets",
      typicalCruiseLength: "7 to 14 nights",
      popularDeparturePorts: "Hamburg, Southampton and Kiel",
      familyFriendly: "Strong, with kids clubs and flexible dining",
      luxuryLevel: "Mainstream resort",
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
      "MSC Norway itineraries often combine Bergen, Flåm and Geiranger on classic fjord routes.",
      "Use the Norway Cruise Planner to match your ship's port times with Stegastein, Mostraumen or Dalsnibba excursions.",
      "Independent tours can offer smaller groups. Always confirm return times against MSC's all aboard deadline.",
      "Book popular fjord excursions early on summer multi ship days in Flåm and Geiranger.",
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
    lead: "Plan P&O Cruises Norway sailings with real 2026 ship call data, port guides and independent shore excursion recommendations.",
    overview:
      "P&O Cruises is one of the busiest operators in Norwegian fjords, with Iona and Britannia making regular calls to Bergen, Flåm, Olden and Stavanger. This guide helps P&O passengers plan port days independently.",
    typicalItineraries:
      "British summer fjord cruises from Southampton, commonly Bergen, Flåm, Olden, Geiranger and Stavanger on 7 to 14 night loops.",
    fjordDestinations:
      "P&O favours Geiranger, Flåm and Olden for glacier and fjord highlights, with Stavanger opening Lysefjord and Skjolden on select sailings.",
    cruiseStyle:
      "British mainstream cruising with inclusive dining tiers, strong entertainment and a relaxed onboard culture. Norway routes prioritise iconic fjord ports.",
    passengerTypes:
      "UK couples, families and groups who book early for school holiday sailings and prefer familiar British service.",
    typicalShoreTime:
      "Most P&O fjord calls allow 9 to 11 hours ashore, though tender days in Geiranger need extra return buffers.",
    passengerSnapshot: {
      bestFor: "UK families and couples on classic British summer fjord loops",
      typicalCruiseLength: "7 to 14 nights",
      popularDeparturePorts: "Southampton",
      familyFriendly: "Strong, with school holiday sailings",
      luxuryLevel: "Mainstream British",
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
      "P&O Norway itineraries often combine Bergen, Flåm and Geiranger on classic fjord routes.",
      "Use the Norway Cruise Planner to match your ship's port times with Stegastein, Mostraumen or Dalsnibba excursions.",
      "Independent tours can offer smaller groups. Always confirm return times against P&O's all aboard deadline.",
      "Book popular fjord excursions early on summer multi ship days in Flåm and Geiranger.",
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
    lead: "Plan Celebrity Cruises Norway sailings with real 2026 ship call data, port guides and independent shore excursion recommendations.",
    overview:
      "Celebrity Cruises brings premium Norway itineraries to Bergen, Flåm, Geiranger, Olden and Stavanger. Celebrity Apex and Celebrity Eclipse are the most frequent callers in our 2026 schedule data.",
    typicalItineraries:
      "Premium 7 to 12 night Norway and fjord itineraries from Southampton or Amsterdam, mixing Geiranger, Flåm, Bergen and occasional Arctic ports.",
    fjordDestinations:
      "Celebrity routes highlight Geirangerfjord, Aurlandsfjord, Molde and Romsdal access, with Arctic calls to Honningsvåg or Tromsø on longer voyages.",
    cruiseStyle:
      "Modern premium ships with elevated dining, design forward public spaces and a cosmopolitan onboard feel. Port days lean scenic and culinary.",
    passengerTypes:
      "Couples and experienced cruisers who want upscale comfort without ultra luxury pricing, often booking specialty dining and spa packages.",
    typicalShoreTime:
      "Celebrity often schedules generous 9 to 12 hour port windows on fjord days, ideal for private touring and slow dining ashore.",
    passengerSnapshot: {
      bestFor: "Couples and premium travellers who want design forward ships",
      typicalCruiseLength: "7 to 12 nights",
      popularDeparturePorts: "Southampton and Amsterdam",
      familyFriendly: "Moderate, with some family sailings",
      luxuryLevel: "Premium",
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
      "Celebrity Norway routes often emphasise scenic ports like Geiranger and Ålesund.",
      "Private and small group independent tours align well with Celebrity passenger preferences.",
      "Use the Norway Cruise Planner for AI style recommendations matched to your Celebrity itinerary.",
      "Celebrity Arctic sailings may include Tromsø. Plan aurora or Sami culture excursions seasonally.",
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
    lead: "Plan Cunard Norway voyages with real 2026 ship call data, port guides and independent shore excursion recommendations.",
    overview:
      "Cunard brings classic ocean liner style to Norway, with Queen Mary 2 and Queen Anne calling at Bergen, Olden and Stavanger. This guide helps Cunard passengers plan refined port days ashore.",
    typicalItineraries:
      "Transatlantic and Northern Europe voyages with Norway segments, often Bergen, Stavanger, Flåm and Geiranger on 9 to 14 night sailings.",
    fjordDestinations:
      "Cunard favours classic west coast ports including Olden for Nordfjord glaciers, Geiranger for UNESCO fjord scenery and Stavanger for Lysefjord access.",
    cruiseStyle:
      "Traditional ocean liner heritage with formal evenings, lecture programmes and spacious public rooms. Norway calls suit unhurried cultural touring.",
    passengerTypes:
      "Mature travellers, ocean liner enthusiasts and couples who value classic service, ballroom events and refined shore days.",
    typicalShoreTime:
      "Cunard port days often run 8 to 10 hours, with tender operations in Geiranger requiring careful return planning.",
    passengerSnapshot: {
      bestFor: "Mature couples and ocean liner enthusiasts",
      typicalCruiseLength: "9 to 14 nights",
      popularDeparturePorts: "Southampton and Hamburg",
      familyFriendly: "Limited, adult oriented culture",
      luxuryLevel: "Premium to luxury ocean liner",
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
      "Cunard Norway voyages often include classic fjord ports with formal onboard culture ashore in Bergen and Stavanger.",
      "Private sightseeing and refined walking tours suit Cunard passenger pacing.",
      "Allow generous return buffers on tender days in Geiranger when travelling with Cunard.",
      "Link through to local port specialists for independently operated Cunard friendly tours.",
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
    lead: "Plan Viking Norway cruises with real 2026 ship call data, port guides and independent shore excursion recommendations.",
    overview:
      "Viking Ocean ships are among the most frequent callers in our Norway schedule data, with six ships rotating through Bergen, Flåm, Geiranger, Eidfjord and Stavanger. This guide helps Viking passengers plan immersive port days.",
    typicalItineraries:
      "In depth fjord intensive routes, often 8 to 15 nights with repeat calls at Bergen, Flåm, Geiranger, Eidfjord and Stavanger.",
    fjordDestinations:
      "Viking concentrates on Geirangerfjord, Naeroyfjord at Flåm, Hardanger from Eidfjord and Lysefjord from Stavanger across repeat port calls.",
    cruiseStyle:
      "Small to mid size expedition leaning ocean ships with understated luxury, included beer and wine at lunch and dinner, and destination focus.",
    passengerTypes:
      "Well travelled adults who prefer cultural immersion, longer port stays and included excursions as a baseline.",
    typicalShoreTime:
      "Viking frequently schedules longer port stays than mainstream lines, often 10 to 12 hours for deeper independent touring.",
    passengerSnapshot: {
      bestFor: "Well travelled adults focused on destination immersion",
      typicalCruiseLength: "8 to 15 nights",
      popularDeparturePorts: "Bergen, Amsterdam and London area ports",
      familyFriendly: "Adults only ships",
      luxuryLevel: "Upscale destination focused",
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
    lead: "Plan Holland America Norway sailings with real 2026 ship call data, port guides and independent shore excursion recommendations.",
    overview:
      "Holland America Line offers in depth Norway routes with Rotterdam, Nieuw Statendam and Zuiderdam calling at Bergen, Eidfjord, Olden and Stavanger. This guide helps HAL passengers plan cultural and scenic port days.",
    typicalItineraries:
      "14 night Norway in depth loops from Rotterdam or Amsterdam, with Eidfjord, Trondheim, Bergen and multiple fjord villages.",
    fjordDestinations:
      "Holland America routes span Hardanger from Eidfjord, Nordfjord at Olden, Geiranger on select sailings and Trondheim fjord access on in depth voyages.",
    cruiseStyle:
      "Classic Holland America cruising with emphasis on music, culinary programmes and longer scenic days. Ships feel traditional and comfortable.",
    passengerTypes:
      "North American and European couples who enjoy slower paced touring, museum visits and one headline scenic excursion per voyage.",
    typicalShoreTime:
      "HAL in depth Norway sailings often allow 9 to 11 hours in Trondheim and Eidfjord, supporting museum and waterfall days.",
    passengerSnapshot: {
      bestFor: "Couples who prefer slower paced cultural and scenic touring",
      typicalCruiseLength: "14 nights on in depth routes",
      popularDeparturePorts: "Rotterdam and Amsterdam",
      familyFriendly: "Moderate, with some multigenerational groups",
      luxuryLevel: "Premium classic",
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
      "Holland America excels on in depth Norway routes with longer port stays in Trondheim and Eidfjord.",
      "Use extended port time for Vøringsfossen from Eidfjord or Trondheim cathedral tours.",
      "HAL passengers often prefer cultural walks plus one headline scenic excursion per voyage.",
      "Our planner scores Holland America friendly ports by excursion type and timing.",
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
    lead: "Plan Princess Cruises Norway sailings with real 2026 ship call data for Sky Princess and Majestic Princess, plus port guides and independent excursion ideas.",
    overview:
      "Princess brings premium mainstream ships to western Norway and Arctic ports, with Sky Princess and Majestic Princess calling at Olden, Stavanger, Ålesund and select Honningsvåg or Trondheim sailings in our 2026 data.",
    typicalItineraries:
      "North Atlantic and Northern Europe voyages from Southampton or Copenhagen, mixing Olden glacier days, Stavanger fjord access and Ålesund art nouveau stops.",
    fjordDestinations:
      "Princess Norway calls emphasise Nordfjord at Olden, Lysefjord from Stavanger and Romsdal scenery near Ålesund, with occasional Arctic extensions.",
    cruiseStyle:
      "Premium mainstream ships with Movies Under the Stars, varied dining and a relaxed American cruise culture adapted to scenic Norway routes.",
    passengerTypes:
      "North American and British couples, repeat Princess cruisers and multigenerational groups who want familiar service with fjord scenery.",
    typicalShoreTime:
      "Princess port windows in our 2026 data typically allow 8 to 10 hours, with longer days in Olden for Briksdal glacier excursions.",
    passengerSnapshot: {
      bestFor: "Repeat Princess cruisers and couples on premium mainstream ships",
      typicalCruiseLength: "7 to 14 nights",
      popularDeparturePorts: "Southampton and Copenhagen",
      familyFriendly: "Strong on summer multigenerational sailings",
      luxuryLevel: "Premium mainstream",
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
    lead: "Plan Royal Caribbean Norway sailings with real 2026 Liberty Of The Seas port call data, plus independent shore excursion recommendations.",
    overview:
      "Royal Caribbean brings mega ship energy to select Norway calls, with Liberty Of The Seas visiting Olden, Stavanger and Kristiansand in our 2026 schedule data.",
    typicalItineraries:
      "Northern Europe summer loops from Southampton or Barcelona, often combining Norway glacier ports with Baltic or British Isles segments.",
    fjordDestinations:
      "Royal Caribbean Norway calls in our data focus on Nordfjord access at Olden and Lysefjord from Stavanger rather than classic Geiranger transit days.",
    cruiseStyle:
      "Mega resort ships with surf simulators, broad entertainment and high energy onboard culture. Norway port days contrast with big ship amenities at sea.",
    passengerTypes:
      "Families, first time cruisers and active travellers who want headline ship features plus a few dramatic Norway port stops.",
    typicalShoreTime:
      "Royal Caribbean port days in our data typically allow 8 to 9 hours, so prioritise one headline excursion per stop.",
    passengerSnapshot: {
      bestFor: "Families and first time cruisers who want mega ship features",
      typicalCruiseLength: "7 to 12 nights on Northern Europe loops",
      popularDeparturePorts: "Southampton and Barcelona",
      familyFriendly: "Very strong, with extensive kids programming",
      luxuryLevel: "Mainstream resort mega ship",
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
    lead: "Plan Disney Cruise Line Norway sailings with real 2026 Disney Dream port call data and family friendly independent excursion ideas.",
    overview:
      "Disney Cruise Line offers family focused Norway itineraries, with Disney Dream calling at Bergen, Stavanger, Ålesund and Olden in our 2026 schedule data.",
    typicalItineraries:
      "Northern Europe family voyages from Copenhagen or Dover, combining Norway fjord villages with character experiences at sea.",
    fjordDestinations:
      "Disney Dream Norway calls highlight Bergen harbour, Stavanger gateway to Lysefjord, Ålesund coastal scenery and Olden glacier access.",
    cruiseStyle:
      "Family first ships with Disney storytelling, youth clubs and approachable dining, paired with scenic western Norway port days.",
    passengerTypes:
      "Families with children, Disney fans and multigenerational groups who want familiar characters onboard and gentle port adventures ashore.",
    typicalShoreTime:
      "Disney port days in our data typically allow 8 to 10 hours, enough for one family friendly excursion plus exploration near the pier.",
    passengerSnapshot: {
      bestFor: "Families with children and Disney fans",
      typicalCruiseLength: "7 to 12 nights on Northern Europe sailings",
      popularDeparturePorts: "Copenhagen and Dover",
      familyFriendly: "Excellent, core to the product",
      luxuryLevel: "Premium family",
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
    lead: "Plan Norwegian Cruise Line Norway sailings with real 2026 Norwegian Star port call data and freestyle independent excursion ideas.",
    overview:
      "Norwegian Cruise Line brings freestyle cruising to western Norway, with Norwegian Star calling frequently at Bergen and Ålesund in our 2026 schedule data.",
    typicalItineraries:
      "Northern Europe summer routes from Southampton or Copenhagen, emphasising city culture in Bergen and coastal scenery at Ålesund.",
    fjordDestinations:
      "NCL Norway calls in our data focus on Bergen harbour and Ålesund coastal access rather than classic Geiranger transit days.",
    cruiseStyle:
      "Freestyle dining and entertainment on resort size ships, with flexible meal times and a casual onboard atmosphere.",
    passengerTypes:
      "Couples, friend groups and families who want flexible dining, varied entertainment and city focused Norway port days.",
    typicalShoreTime:
      "Norwegian Star port windows in our data typically allow 9 to 11 hours in Bergen, supporting city walks plus a fjord excursion.",
    passengerSnapshot: {
      bestFor: "Couples and groups who want freestyle dining and entertainment",
      typicalCruiseLength: "7 to 12 nights",
      popularDeparturePorts: "Southampton and Copenhagen",
      familyFriendly: "Strong, with flexible dining times",
      luxuryLevel: "Mainstream premium",
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
