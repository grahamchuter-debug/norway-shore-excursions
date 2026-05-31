import type { CruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { ports } from "@/lib/ports-data";

export type CruiseLineData = {
  slug: string;
  scheduleKey: CruiseLineScheduleKey;
  name: string;
  shortName: string;
  metaDescription: string;
  headline: string;
  lead: string;
  overview: string;
  planningTips: readonly string[];
  recommendedPortSlugs: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};

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
