import { portBySlug, ports } from "@/lib/ports-data";

export type ThemeData = {
  slug: string;
  title: string;
  metaDescription: string;
  headline: string;
  lead: string;
  explanation: string[];
  recommendedPortSlugs: readonly string[];
  tourExamples: readonly { name: string; portSlug: string; description: string }[];
  faqs: readonly { question: string; answer: string }[];
};

export const themes: readonly ThemeData[] = [
  {
    slug: "fjord-shore-excursions-norway",
    title: "Fjord Shore Excursions Norway",
    metaDescription:
      "Plan fjord shore excursions across Norway's cruise ports including Flåm, Geiranger, Bergen and Stavanger with independent port guides.",
    headline: "Fjord Shore Excursions in Norway",
    lead: "Norway's fjords define the classic cruise itinerary. Match your ports to the right fjord cruise, viewpoint drive, or village experience.",
    explanation: [
      "Fjord shore excursions range from short harbour cruises to full-day UNESCO fjord sailings. The best choice depends on your port, time ashore, and whether you prefer water-level or mountain viewpoints.",
      "Flåm, Geiranger, and Bergen offer the headline fjord experiences, while Stavanger opens Lysefjord and Skjolden reaches inner Sognefjord on smaller-ship routes.",
    ],
    recommendedPortSlugs: ["flam", "geiranger", "bergen", "stavanger", "skjolden"],
    tourExamples: [
      { name: "Stegastein Viewpoint", portSlug: "flam", description: "Aurlandsfjord panorama above Flåm village." },
      { name: "Dalsnibba", portSlug: "geiranger", description: "High viewpoint over Geirangerfjord." },
      { name: "Mostraumen Fjord Cruise", portSlug: "bergen", description: "Osterfjord sailing from Bergen harbour." },
      { name: "Lysefjord Cruise", portSlug: "stavanger", description: "Cliff-lined fjord beneath Pulpit Rock." },
    ],
    faqs: [
      { question: "Which Norway port is best for fjords?", answer: "Geiranger and Flåm are the most dramatic; Bergen adds city plus fjord in one day." },
      { question: "Do I need a tour to see the fjords?", answer: "Viewpoints near Flåm and Geiranger are tour-based; some ports offer walkable harbour views." },
    ],
  },
  {
    slug: "glacier-shore-excursions-norway",
    title: "Glacier Shore Excursions Norway",
    metaDescription:
      "Compare glacier shore excursions from Olden, Nordfjordeid and Hellesylt cruise ports with Briksdal and Loen Skylift recommendations.",
    headline: "Glacier Shore Excursions in Norway",
    lead: "Blue ice and glacier valleys are within reach from Nordfjord cruise ports, if you allow enough time ashore.",
    explanation: [
      "Glacier excursions typically require coach transfers into national park valleys. Briksdal near Olden is Norway's most popular cruise glacier tour.",
      "Loen Skylift adds aerial views. Hellesylt and Nordfjordeid offer alternative access on longer port days.",
    ],
    recommendedPortSlugs: ["olden", "nordfjordeid", "hellesylt"],
    tourExamples: [
      { name: "Briksdal Glacier", portSlug: "olden", description: "Lake boat and valley walk to the glacier tongue." },
      { name: "Loen Skylift", portSlug: "olden", description: "Cable car ascent above Nordfjord." },
      { name: "Briksdal Glacier", portSlug: "nordfjordeid", description: "Glacier access from the Eid port area." },
    ],
    faqs: [
      { question: "How much port time do glaciers need?", answer: "Plan at least five hours for Briksdal including transfers and walking." },
      { question: "Are glacier walks strenuous?", answer: "Most Briksdal visitors take a lake boat; walking sections can be adjusted." },
    ],
  },
  {
    slug: "waterfall-shore-excursions-norway",
    title: "Waterfall Shore Excursions Norway",
    metaDescription:
      "Waterfall shore excursions from Geiranger, Eidfjord and Nordfjordeid including Vøringsfossen and fjord waterfall viewing.",
    headline: "Waterfall Shore Excursions in Norway",
    lead: "From Geirangerfjord's Seven Sisters to Vøringsfossen in Hardanger, waterfall excursions reward cruise passengers who love dramatic nature.",
    explanation: [
      "Geiranger combines fjord transit with visible waterfalls from deck or viewpoint drives.",
      "Eidfjord specialises in Vøringsfossen, one of Norway's most powerful falls with modern viewing platforms.",
    ],
    recommendedPortSlugs: ["geiranger", "eidfjord", "nordfjordeid", "flam"],
    tourExamples: [
      { name: "Vøringsfossen", portSlug: "eidfjord", description: "Hardanger plateau waterfall with walkway views." },
      { name: "Eagle Road", portSlug: "geiranger", description: "Hairpin road with waterfall and fjord vistas." },
      { name: "Tvinnefossen", portSlug: "nordfjordeid", description: "Scenic waterfall stop on Nordfjord drives." },
    ],
    faqs: [
      { question: "Can I see waterfalls without a tour?", answer: "In Geiranger and Hellesylt some falls are visible from the ship; Vøringsfossen requires a road transfer." },
      { question: "Are waterfall platforms accessible?", answer: "Vøringsfossen has upgraded accessible viewing areas; check individual tours for walking distance." },
    ],
  },
  {
    slug: "wildlife-shore-excursions-norway",
    title: "Wildlife Shore Excursions Norway",
    metaDescription:
      "Wildlife shore excursions in Norway including puffin safaris from Honningsvåg, reindeer experiences in Tromsø and Arctic bird tours.",
    headline: "Wildlife Shore Excursions in Norway",
    lead: "Arctic bird colonies, reindeer encounters, and king crab safaris add wildlife depth to Norway cruise itineraries.",
    explanation: [
      "Honningsvåg and Gjesvær offer seasonal puffin and seabird boat safaris.",
      "Tromsø features reindeer and Sami cultural experiences alongside fjord wildlife.",
    ],
    recommendedPortSlugs: ["honningsvag", "tromso", "molde"],
    tourExamples: [
      { name: "Gjesvær Bird Safari", portSlug: "honningsvag", description: "Boat trip to puffin colonies in season." },
      { name: "Reindeer Sami Experience", portSlug: "tromso", description: "Arctic camp visit with reindeer feeding." },
      { name: "King Crab Safari", portSlug: "honningsvag", description: "Barents Sea crab harvest and tasting." },
    ],
    faqs: [
      { question: "When can I see puffins?", answer: "Typically May through August from North Cape area ports; seasons vary annually." },
      { question: "Are wildlife tours ethical?", answer: "Choose licensed operators; Sami reindeer experiences should respect cultural guidelines." },
    ],
  },
  {
    slug: "northern-lights-shore-excursions-norway",
    title: "Northern Lights Shore Excursions Norway",
    metaDescription:
      "Northern lights shore excursions from Tromsø and Arctic Norway cruise ports with aurora chase planning for winter sailings.",
    headline: "Northern Lights Shore Excursions in Norway",
    lead: "Winter cruise passengers can chase the aurora from Tromsø and Arctic ports when darkness and weather align.",
    explanation: [
      "Aurora excursions need dark skies, typically October to March sailings above the Arctic Circle.",
      "Tromsø is the main hub for organised aurora hunts; Honningsvåg offers Arctic context on summer midnight sun routes instead.",
    ],
    recommendedPortSlugs: ["tromso", "honningsvag"],
    tourExamples: [
      { name: "Aurora Chase", portSlug: "tromso", description: "Evening tour seeking aurora away from city lights." },
      { name: "Fjord Photo Tour", portSlug: "tromso", description: "Daylight Arctic landscape photography route." },
    ],
    faqs: [
      { question: "Will I definitely see the aurora?", answer: "No, aurora depends on solar activity and cloud cover. No operator can guarantee sightings." },
      { question: "Do summer cruises see northern lights?", answer: "No. Summer Arctic sailings experience the midnight sun instead." },
    ],
  },
  {
    slug: "family-shore-excursions-norway",
    title: "Family Shore Excursions Norway",
    metaDescription:
      "Family friendly Norway shore excursions in Ålesund, Kristiansand, Skjolden and Bergen with gentle tours and short port day options.",
    headline: "Family Shore Excursions in Norway",
    lead: "Norway cruise ports offer family-friendly walks, aquariums, gentle viewpoints, and unique experiences like llama trekking.",
    explanation: [
      "Choose ports with short transfers and flexible pacing: Ålesund, Kristiansand, and Bergen work well for mixed-age groups.",
      "Skjolden's llama walks and Ålesund's Atlantic Ocean Park are standout family options on suitable itineraries.",
    ],
    recommendedPortSlugs: ["alesund", "kristiansand", "skjolden", "bergen"],
    tourExamples: [
      { name: "Atlantic Ocean Park", portSlug: "alesund", description: "Aquarium suited to children and rainy days." },
      { name: "Llama walk", portSlug: "skjolden", description: "Gentle animal experience in fjord scenery." },
      { name: "Bergen Walking Tour", portSlug: "bergen", description: "Compact city introduction for all ages." },
    ],
    faqs: [
      { question: "Are fjord tours OK for children?", answer: "Most harbour cruises welcome families; RIB tours often have age minimums." },
      { question: "Which port is easiest with a stroller?", answer: "Bergen centre and Kristiansand are relatively flat; glacier valleys are less stroller-friendly." },
    ],
  },
  {
    slug: "hiking-shore-excursions-norway",
    title: "Hiking Shore Excursions Norway",
    metaDescription:
      "Active hiking shore excursions in Norway from Stavanger viewpoints to glacier valley walks and Arctic nature trails.",
    headline: "Hiking Shore Excursions in Norway",
    lead: "Active cruise passengers can find guided hikes and valley walks, but full summit hikes rarely fit standard port schedules.",
    explanation: [
      "Briksdal glacier valley walks and Stavanger coastal paths suit moderate fitness within cruise timing.",
      "Iconic hikes like Pulpit Rock need a full day and are not realistic from a typical port call.",
    ],
    recommendedPortSlugs: ["olden", "stavanger", "eidfjord", "skjolden"],
    tourExamples: [
      { name: "Briksdal Glacier walk", portSlug: "olden", description: "Moderate valley walk with glacier payoff." },
      { name: "Baneheia and Ravnedalen", portSlug: "kristiansand", description: "Parkland trails in southern Norway." },
      { name: "Sognefjord adventure", portSlug: "skjolden", description: "Active combination day for fit travellers." },
    ],
    faqs: [
      { question: "Can I hike Pulpit Rock on a cruise day?", answer: "Not realistically, the round trip needs six to eight hours plus transfers from Stavanger." },
      { question: "What footwear do I need?", answer: "Sturdy waterproof shoes for glacier valleys; trails can be wet even in summer." },
    ],
  },
  {
    slug: "scenic-drive-shore-excursions-norway",
    title: "Scenic Drive Shore Excursions Norway",
    metaDescription:
      "Scenic drive shore excursions in Norway including Atlantic Ocean Road from Molde, Eagle Road in Geiranger and fjord viewpoint routes.",
    headline: "Scenic Drive Shore Excursions in Norway",
    lead: "Norway's great coastal and mountain roads translate into coach based shore excursions with frequent photo stops.",
    explanation: [
      "Molde's Atlantic Ocean Road is the signature coastal drive excursion.",
      "Geiranger's Eagle Road and Flåm's Stegastein route showcase mountain switchbacks and fjord views.",
    ],
    recommendedPortSlugs: ["molde", "geiranger", "flam", "honningsvag"],
    tourExamples: [
      { name: "Atlantic Ocean Road", portSlug: "molde", description: "Island-hopping bridges on the Atlantic coast." },
      { name: "Eagle Road", portSlug: "geiranger", description: "Dramatic hairpins above Geirangerfjord." },
      { name: "Stegastein Viewpoint", portSlug: "flam", description: "Engineered viewpoint platform over Aurlandsfjord." },
    ],
    faqs: [
      { question: "Are scenic drives coach based?", answer: "Yes, nearly all organised scenic drive excursions use coaches with a guide." },
      { question: "Do drives run in bad weather?", answer: "Tours usually operate but views may be limited in fog or heavy rain." },
    ],
  },
  {
    slug: "best-viewpoint-tours-norway",
    title: "Best Viewpoint Tours Norway",
    metaDescription:
      "Best viewpoint shore excursions in Norway from Stegastein and Dalsnibba to Mount Aksla and Loen Skylift for cruise passengers.",
    headline: "Best Viewpoint Tours in Norway",
    lead: "Engineered platforms and mountain roads deliver Norway's most photographed panoramas, often within a single port day.",
    explanation: [
      "Stegastein (Flåm), Dalsnibba (Geiranger), and Mount Aksla (Ålesund) are the most cruise-friendly viewpoints.",
      "Loen Skylift and Bergen's Mount Fløyen add vertical perspective with minimal hiking.",
    ],
    recommendedPortSlugs: ["flam", "geiranger", "alesund", "olden", "bergen"],
    tourExamples: [
      { name: "Stegastein Viewpoint", portSlug: "flam", description: "Cantilevered platform over Aurlandsfjord." },
      { name: "Dalsnibba", portSlug: "geiranger", description: "Summit view over Geirangerfjord." },
      { name: "Mount Aksla", portSlug: "alesund", description: "Art Nouveau city panorama." },
      { name: "Funicular Railway", portSlug: "bergen", description: "Fløibanen to Mount Fløyen viewpoint." },
    ],
    faqs: [
      { question: "Which viewpoint is best for first timers?", answer: "Stegastein near Flåm offers maximum impact with minimal effort." },
      { question: "Are viewpoints crowded on cruise days?", answer: "Popular platforms can be busy when multiple ships call, book timed excursions when possible." },
    ],
  },
  {
    slug: "best-private-tours-norway",
    title: "Best Private Tours Norway",
    metaDescription:
      "Private shore excursions in Norway for cruise passengers wanting flexible timing, custom routing and smaller groups at key ports.",
    headline: "Best Private Tours in Norway",
    lead: "Private touring gives cruise passengers flexible routing, personalised pacing, and tighter control over return to ship timing.",
    explanation: [
      "Private options work best at ports with road access: Bergen, Stavanger, Tromsø, and Olden region gateways.",
      "Independent private guides are not affiliated with cruise lines, always confirm all aboard times in writing.",
    ],
    recommendedPortSlugs: ["bergen", "stavanger", "tromso", "olden", "flam"],
    tourExamples: [
      { name: "Private Bergen sightseeing", portSlug: "bergen", description: "Custom city and fjord routing for your group." },
      { name: "Private Lysefjord charter", portSlug: "stavanger", description: "Smaller-boat fjord experience on your schedule." },
      { name: "Private glacier transfer", portSlug: "olden", description: "Flexible Briksdal timing for private groups." },
    ],
    faqs: [
      { question: "Are private tours safer for return timing?", answer: "They offer flexibility but still depend on traffic and distance, confirm buffers with your guide." },
      { question: "Does Norway Shore Excursions book private tours?", answer: "We link to independent local port sites where private options are listed, we are a planning guide, not a booking agent." },
    ],
  },
] as const;

export const themeBySlug = Object.fromEntries(
  themes.map((t) => [t.slug, t]),
) as Record<string, ThemeData>;

export function getThemePorts(slugs: readonly string[]) {
  return slugs.map((s) => portBySlug[s]).filter(Boolean);
}

export function getThemeLocalSites(slugs: readonly string[]) {
  return slugs.map((s) => ({
    slug: s,
    name: portBySlug[s]?.displayName ?? s,
    url: portBySlug[s]?.localSiteUrl ?? "#",
  }));
}

export const themeSlugs = themes.map((t) => t.slug);

export const featuredThemes = themes.slice(0, 6);

export const interestThemeLinks = [
  { label: "Fjord excursions", href: "/fjord-shore-excursions-norway" },
  { label: "Glacier excursions", href: "/glacier-shore-excursions-norway" },
  { label: "Waterfall tours", href: "/waterfall-shore-excursions-norway" },
  { label: "Wildlife safaris", href: "/wildlife-shore-excursions-norway" },
  { label: "Northern lights", href: "/northern-lights-shore-excursions-norway" },
  { label: "Family friendly", href: "/family-shore-excursions-norway" },
  { label: "Viewpoint tours", href: "/best-viewpoint-tours-norway" },
  { label: "Private tours", href: "/best-private-tours-norway" },
] as const;
