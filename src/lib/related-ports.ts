/**
 * Editorial related-port relationships for cruise passenger decisions.
 * Keep sparse — only where a genuine planning choice exists.
 */
export const relatedPortsBySlug: Record<
  string,
  readonly { slug: string; reason: string }[]
> = {
  hellesylt: [
    {
      slug: "geiranger",
      reason:
        "Many itineraries pair Hellesylt and Geiranger on the same fjord day — compare overland versus fjord-focused options.",
    },
  ],
  geiranger: [
    {
      slug: "hellesylt",
      reason:
        "If your ship also calls at Hellesylt, decide whether this day is for viewpoints, fjord scenery or the connecting overland route.",
    },
  ],
  olden: [
    {
      slug: "nordfjordeid",
      reason:
        "Nordfjord ports share glacier and waterfall day options — useful when comparing nearby calls on the same cruise.",
    },
  ],
  nordfjordeid: [
    {
      slug: "olden",
      reason:
        "Olden is the classic Briksdal / Loen Skylift gateway if your itinerary offers both Nordfjord calls.",
    },
    {
      slug: "hellesylt",
      reason:
        "Scenic fjord and waterfall days can look similar on paper — compare time ashore and transfer distance.",
    },
  ],
  flam: [
    {
      slug: "bergen",
      reason:
        "Flåm is a scenic fjord call; Bergen is the larger city-and-fjord day often paired on longer Norway itineraries.",
    },
  ],
  bergen: [
    {
      slug: "stavanger",
      reason:
        "Both are major city-gateway ports — useful when choosing between Bryggen/Mostraumen and Lysefjord days.",
    },
  ],
  stavanger: [
    {
      slug: "bergen",
      reason:
        "Compare a Lysefjord-focused day with Bergen’s harbour and Osterfjord options on multi-port Norway cruises.",
    },
  ],
  tromso: [
    {
      slug: "honningsvag",
      reason:
        "Arctic itineraries often include both — Tromsø for city and aurora logistics, Honningsvåg for North Cape distance/time decisions.",
    },
  ],
  honningsvag: [
    {
      slug: "tromso",
      reason:
        "If your cruise also visits Tromsø, separate North Cape planning from city and aurora day choices.",
    },
  ],
};

export function getRelatedPorts(slug: string) {
  return relatedPortsBySlug[slug] ?? [];
}
