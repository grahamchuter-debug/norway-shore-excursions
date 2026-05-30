export type PortDayTip = {
  slug: string;
  port: string;
  dont: string;
  better: string;
};

export const portDayTips: readonly PortDayTip[] = [
  {
    slug: "geiranger",
    port: "Geiranger",
    dont: "Don't only stay in the village all day.",
    better:
      "Dalsnibba, Eagle Road or Flydalsjuvet viewpoints deliver the UNESCO fjord drama most passengers come for.",
  },
  {
    slug: "olden",
    port: "Olden",
    dont: "Don't assume the best scenery is beside the ship.",
    better:
      "Briksdal Glacier, Loen Skylift or Olden Lake scenery are where Nordfjord's payoff really lives.",
  },
  {
    slug: "flam",
    port: "Flåm",
    dont: "Don't leave Stegastein or fjord viewpoints too late.",
    better:
      "Plan Stegastein or a short fjord cruise early and keep a generous return to ship buffer.",
  },
  {
    slug: "honningsvag",
    port: "Honningsvåg",
    dont: "Don't treat it as just another small town.",
    better:
      "North Cape, bird safari, king crab or Sami culture turn this into a true Arctic milestone port day.",
  },
  {
    slug: "skjolden",
    port: "Skjolden",
    dont: "Don't miss the unusual local experiences.",
    better:
      "Llama walk, fjord RIB or Sognefjord adventure options make this inner-fjord stop memorable.",
  },
  {
    slug: "stavanger",
    port: "Stavanger",
    dont: "Don't attempt Pulpit Rock on a standard cruise schedule.",
    better:
      "A Lysefjord cruise or Old Stavanger walk fits realistic port timing with strong scenery payoff.",
  },
  {
    slug: "bergen",
    port: "Bergen",
    dont: "Don't spend the whole day only at the pier without a plan.",
    better:
      "Combine Bryggen walks with Mostraumen fjord cruise or Mount Fløyen when your port time allows.",
  },
  {
    slug: "tromso",
    port: "Tromsø",
    dont: "Don't expect aurora guarantees on a daylight-only call.",
    better:
      "Match the season, aurora chase in winter, fjord photo tours or Sami culture when evenings are light.",
  },
] as const;
