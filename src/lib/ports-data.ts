export type PortTheme =
  | "fjords"
  | "glaciers"
  | "waterfalls"
  | "wildlife"
  | "northern-lights"
  | "history"
  | "city-walks"
  | "scenic-drives"
  | "family-friendly"
  | "private-tours"
  | "active-tours"
  | "viewpoints"
  | "first-time-visitors"
  | "short-port-calls"
  | "arctic"
  | "viking"
  | "adventure"
  | "culture"
  | "unesco-fjord"
  | "coastal-drives"
  | "nature";

export type PortDifficulty = "easy" | "moderate" | "active";

export type PortData = {
  slug: string;
  name: string;
  displayName: string;
  localSiteUrl: string;
  region: string;
  heroTour: string;
  secondaryTours: readonly string[];
  bestFor: string;
  minimumPortTime: string;
  difficulty: PortDifficulty;
  themes: readonly PortTheme[];
  cruiseFitNotes: string;
  intro: string;
  whoBestFor: string;
  typicalTimeNeeded: string;
  cruiseTips: readonly string[];
  faqs: readonly { question: string; answer: string }[];
  sampleTours: readonly { name: string; description: string }[];
};

export const ports: readonly PortData[] = [
  {
    slug: "flam",
    name: "Flam",
    displayName: "Flåm",
    localSiteUrl: "https://flamshoreexcursions.com",
    region: "Sognefjord",
    heroTour: "Stegastein Viewpoint",
    secondaryTours: ["Fjord Cruise", "Flam Railway"],
    bestFor: "First time Norway visitors wanting iconic fjord scenery",
    minimumPortTime: "4 hours",
    difficulty: "easy",
    themes: ["fjords", "viewpoints", "first-time-visitors", "scenic-drives"],
    cruiseFitNotes:
      "Compact port with tours close to the pier. Stegastein and short fjord cruises suit most call lengths.",
    intro:
      "Flåm sits at the inner end of Aurlandsfjord, one of Norway's most photographed cruise ports. Ships dock steps from the village, making it easy to combine a viewpoint drive, fjord cruise, or famous Flåm Railway within a single port day.",
    whoBestFor:
      "Ideal for first-time Norway cruisers, scenery lovers, and passengers who want maximum impact without long transfers.",
    typicalTimeNeeded:
      "Allow 2 to 3 hours for Stegastein or a fjord cruise; the Flåm Railway needs a half day with careful timing.",
    cruiseTips: [
      "Book popular Stegastein departures early on busy ship days.",
      "The Flåm Railway is spectacular but time consuming, confirm return times before booking.",
      "Walk from the pier to excursion meeting points; no taxi needed in the village centre.",
      "Allow 45 minutes before all aboard for gangway queues on peak days.",
    ],
    sampleTours: [
      { name: "Stegastein Viewpoint", description: "Panoramic platform overlooking Aurlandsfjord with minimal walking." },
      { name: "Fjord Cruise", description: "Scenic sailing on Aurlandsfjord and Nærøyfjord UNESCO waters." },
      { name: "Flam Railway", description: "One of the world's steepest train lines through mountain scenery." },
    ],
    faqs: [
      { question: "Is Flåm worth it on a short port call?", answer: "Yes for a viewpoint or short fjord cruise. Skip the railway if you have under five hours ashore." },
      { question: "How far is the pier from excursions?", answer: "Most tours start within a few minutes' walk of the cruise pier in Flåm village." },
    ],
  },
  {
    slug: "stavanger",
    name: "Stavanger",
    displayName: "Stavanger",
    localSiteUrl: "https://stavangershoreexcursions.com",
    region: "Rogaland",
    heroTour: "Lysefjord Cruise",
    secondaryTours: ["Stavanger Walking Tour"],
    bestFor: "Short port calls and fjord-first itineraries",
    minimumPortTime: "3 hours",
    difficulty: "easy",
    themes: ["fjords", "city-walks", "short-port-calls"],
    cruiseFitNotes:
      "Excellent for compact city walks. Lysefjord cruises need more time; Pulpit Rock hikes are rarely suitable from a cruise day.",
    intro:
      "Stavanger blends a walkable old town with gateway access to Lysefjord. Cruise ships typically dock close to Vågen harbour, putting Bryggen-style streets and excursion piers within easy reach.",
    whoBestFor:
      "Passengers with shorter calls, city explorers, and anyone wanting a fjord experience without long road transfers.",
    typicalTimeNeeded: "2 hours for a walking tour; 3 to 4 hours for a Lysefjord cruise.",
    cruiseTips: [
      "A city walk works even on the shortest calls.",
      "Lysefjord cruises depart from the harbour area, confirm pier to pier walking time.",
      "Pulpit Rock hikes are not realistic for standard cruise schedules.",
      "Old Stavanger's white wooden houses are free to explore near the port.",
    ],
    sampleTours: [
      { name: "Lysefjord Cruise", description: "Sail beneath Pulpit Rock cliffs on a classic fjord route." },
      { name: "Stavanger Walking Tour", description: "Guided loop through Old Stavanger, the cathedral, and harbour." },
    ],
    faqs: [
      { question: "Can I see Pulpit Rock from a cruise excursion?", answer: "You can see the cliffs from a Lysefjord boat tour. The hike itself requires a full day, not a typical port call." },
      { question: "Is Stavanger good for a half day?", answer: "Yes. A guided walk or harbour sightseeing fits comfortably in under four hours." },
    ],
  },
  {
    slug: "bergen",
    name: "Bergen",
    displayName: "Bergen",
    localSiteUrl: "https://bergenshoreexcursions.com",
    region: "Vestland",
    heroTour: "Mostraumen Fjord Cruise",
    secondaryTours: ["Funicular Railway", "Bergen Walking Tour"],
    bestFor: "City culture combined with fjord scenery",
    minimumPortTime: "4 hours",
    difficulty: "easy",
    themes: ["fjords", "city-walks", "viewpoints", "history"],
    cruiseFitNotes:
      "Norway's most versatile cruise city. Walking tours suit short calls; Mostraumen and Fløyen need longer stays.",
    intro:
      "Bergen is Norway's historic gateway to the fjords, with Bryggen UNESCO wharf, Mount Fløyen, and fjord cruises all reachable from the cruise port at Skolten or Dokken.",
    whoBestFor:
      "Culture lovers, food-focused travellers, and passengers wanting both city and fjord in one day.",
    typicalTimeNeeded: "2 to 3 hours for city touring; 3 to 4 hours for Mostraumen fjord cruise.",
    cruiseTips: [
      "Check which Bergen terminal your ship uses, shuttle buses may apply.",
      "Mostraumen cruises are the headline excursion for longer port days.",
      "Fløibanen funicular queues grow on multi-ship days.",
      "Bryggen and Torget fish market are walkable from most piers with time to spare.",
    ],
    sampleTours: [
      { name: "Mostraumen Fjord Cruise", description: "Half-day sailing through Osterfjord to the narrow Mostraumen strait." },
      { name: "Funicular Railway", description: "Fløibanen ride to Mount Fløyen for city and fjord panoramas." },
      { name: "Bergen Walking Tour", description: "Bryggen, harbour, and historic centre with a local guide." },
    ],
    faqs: [
      { question: "How much time do I need in Bergen?", answer: "Four hours minimum for a city walk; six or more for a fjord cruise plus sightseeing." },
      { question: "Is Bergen walkable from the cruise port?", answer: "Yes from most terminals, though some ships use a short shuttle to the city centre." },
    ],
  },
  {
    slug: "alesund",
    name: "Alesund",
    displayName: "Ålesund",
    localSiteUrl: "https://alesundshoreexcursions.com",
    region: "Møre og Romsdal",
    heroTour: "Mount Aksla",
    secondaryTours: ["Alnes Lighthouse", "Atlantic Ocean Park"],
    bestFor: "Art Nouveau architecture and family-friendly viewpoints",
    minimumPortTime: "3 hours",
    difficulty: "easy",
    themes: ["viewpoints", "family-friendly", "city-walks"],
    cruiseFitNotes:
      "Compact port with excellent short excursions. Mount Aksla viewpoint suits almost every call length.",
    intro:
      "Ålesund's Art Nouveau skyline rises from a cluster of islands on Norway's west coast. Cruise passengers arrive close to town, with viewpoint walks and coastal attractions within easy reach.",
    whoBestFor:
      "Photographers, architecture enthusiasts, and families wanting gentle excursions with strong visual payoff.",
    typicalTimeNeeded: "1 to 2 hours for Mount Aksla; half day for Atlantic Ocean Park or Alnes.",
    cruiseTips: [
      "Walk up to Aksla viewpoint or take a short taxi if mobility is limited.",
      "Town centre Art Nouveau streets are ideal for self guided time after a tour.",
      "Atlantic Ocean Park works well for families with five or more hours ashore.",
    ],
    sampleTours: [
      { name: "Mount Aksla", description: "City panorama from the iconic viewpoint above Ålesund." },
      { name: "Alnes Lighthouse", description: "Coastal drive to a picturesque lighthouse on Godøy island." },
      { name: "Atlantic Ocean Park", description: "Aquarium and marine exhibits suited to families." },
    ],
    faqs: [
      { question: "Is Ålesund good for short port calls?", answer: "Yes. Mount Aksla and a city stroll fit comfortably in three to four hours." },
      { question: "Do I need transport from the pier?", answer: "The town centre is nearby; some outer excursions include coach transfers." },
    ],
  },
  {
    slug: "geiranger",
    name: "Geiranger",
    displayName: "Geiranger",
    localSiteUrl: "https://geirangershoreexcursions.com",
    region: "UNESCO Geirangerfjord",
    heroTour: "Dalsnibba",
    secondaryTours: ["Eagle Road", "Fjord sightseeing"],
    bestFor: "Waterfall and UNESCO fjord scenery",
    minimumPortTime: "4 hours",
    difficulty: "moderate",
    themes: ["viewpoints", "waterfalls", "unesco-fjord", "scenic-drives"],
    cruiseFitNotes:
      "Small village port inside Geirangerfjord. Viewpoint drives are popular; timing matters on busy tender days.",
    intro:
      "Geiranger sits at the head of the UNESCO listed Geirangerfjord, surrounded by Seven Sisters waterfalls and dramatic switchback roads. Ships anchor or dock in one of Norway's most spectacular settings.",
    whoBestFor:
      "Scenery-first travellers, photographers, and passengers on classic fjord itineraries.",
    typicalTimeNeeded: "3 to 4 hours for Dalsnibba or Eagle Road; 1 to 2 hours for village and fjord viewing.",
    cruiseTips: [
      "Tender operations can add 30 to 45 minutes, factor this into tour selection.",
      "Dalsnibba and Eagle Road are road based; check return to ship buffers.",
      "The village itself is small; most value comes from viewpoint excursions.",
    ],
    sampleTours: [
      { name: "Dalsnibba", description: "High-altitude viewpoint over Geirangerfjord and cruise ships below." },
      { name: "Eagle Road", description: "Iconic hairpin bends with waterfall views above the fjord." },
      { name: "Fjord sightseeing", description: "Water-level perspective on Geirangerfjord waterfalls and cliffs." },
    ],
    faqs: [
      { question: "Does Geiranger use tenders?", answer: "Some ships tender; others dock at the hellesylt-Geiranger ferry pier. Allow extra boarding time." },
      { question: "Which viewpoint is best?", answer: "Dalsnibba offers the highest panorama; Eagle Road is closer with dramatic road scenery." },
    ],
  },
  {
    slug: "olden",
    name: "Olden",
    displayName: "Olden",
    localSiteUrl: "https://oldenshoreexcursions.com",
    region: "Nordfjord",
    heroTour: "Briksdal Glacier",
    secondaryTours: ["Loen Skylift"],
    bestFor: "Glacier scenery and active fjord-country adventures",
    minimumPortTime: "5 hours",
    difficulty: "moderate",
    themes: ["glaciers", "waterfalls", "scenic-drives", "active-tours"],
    cruiseFitNotes:
      "Glacier excursions need adequate port time. Briksdal is the headline tour; Loen Skylift suits longer calls.",
    intro:
      "Olden opens onto Nordfjord with direct access to Briksdal Glacier valley. Cruise ships dock near the village, with glacier excursions departing by coach into Jostedalsbreen National Park.",
    whoBestFor:
      "Glacier seekers, adventurous passengers, and anyone wanting Norway's blue-ice scenery from a cruise port.",
    typicalTimeNeeded: "4 to 5 hours for Briksdal Glacier; add time for Loen Skylift combinations.",
    cruiseTips: [
      "Briksdal involves a valley walk or lake boat plus optional hiking, wear sturdy shoes.",
      "Loen Skylift adds spectacular height but needs a longer port day.",
      "Road transfers to Briksdal are included on most organised excursions.",
    ],
    sampleTours: [
      { name: "Briksdal Glacier", description: "Valley journey to the glacier tongue with lake boat and walking options." },
      { name: "Loen Skylift", description: "Cable car to Hoven mountain with panoramic Nordfjord views." },
    ],
    faqs: [
      { question: "Can I reach the glacier on a short call?", answer: "Briksdal needs at least five hours ashore including transfers. Shorter calls suit village walks only." },
      { question: "How strenuous is Briksdal?", answer: "Moderate. Most visitors take a lake boat; the final walk can be adjusted to fitness level." },
    ],
  },
  {
    slug: "eidfjord",
    name: "Eidfjord",
    displayName: "Eidfjord",
    localSiteUrl: "https://eidfjordshoreexcursions.com",
    region: "Hardanger",
    heroTour: "Vøringsfossen",
    secondaryTours: ["Hardangervidda Nature Centre"],
    bestFor: "Waterfalls and high-plateau nature",
    minimumPortTime: "4 hours",
    difficulty: "easy",
    themes: ["waterfalls", "scenic-drives", "nature"],
    cruiseFitNotes:
      "Quiet port ideal for waterfall and nature excursions. Vøringsfossen is the signature tour.",
    intro:
      "Eidfjord lies at the inner end of Hardangerfjord, a peaceful cruise stop with quick access to Vøringsfossen waterfall and Hardangervidda mountain plateau exhibits.",
    whoBestFor:
      "Nature lovers, waterfall chasers, and passengers preferring quieter ports over crowded cities.",
    typicalTimeNeeded: "3 to 4 hours for Vøringsfossen round trip; 2 hours for the nature centre.",
    cruiseTips: [
      "Vøringsfossen viewing platforms were upgraded, safe walkways with dramatic views.",
      "Coach time to the waterfall is part of the excursion, confirm total duration.",
      "The village itself is small; plan an organised tour rather than expecting urban sightseeing.",
    ],
    sampleTours: [
      { name: "Vøringsfossen", description: "Norway's famous waterfall with modern viewing walkways over Måbødalen." },
      { name: "Hardangervidda Nature Centre", description: "Interactive exhibits on Arctic fox, reindeer, and plateau ecology." },
    ],
    faqs: [
      { question: "Is Eidfjord tender-only?", answer: "Most ships dock at Eidfjord; always confirm with your cruise line's port sheet." },
      { question: "Is Vøringsfossen suitable for limited mobility?", answer: "Viewing platforms are largely accessible; check specific tour descriptions for walking distances." },
    ],
  },
  {
    slug: "molde",
    name: "Molde",
    displayName: "Molde",
    localSiteUrl: "https://moldeshoreexcursions.com",
    region: "Romsdal",
    heroTour: "Atlantic Ocean Road",
    secondaryTours: ["Bud fishing village"],
    bestFor: "Coastal drives and island scenery",
    minimumPortTime: "5 hours",
    difficulty: "easy",
    themes: ["scenic-drives", "coastal-drives", "viewpoints"],
    cruiseFitNotes:
      "Atlantic Ocean Road excursions need half a day. Town viewpoints suit shorter calls.",
    intro:
      "Molde, the 'City of Roses', serves as the gateway to the Atlantic Ocean Road, one of Norway's most dramatic coastal drives, and charming fishing villages on the Romsdal coast.",
    whoBestFor:
      "Road-trip enthusiasts, photographers, and passengers who enjoy coastal engineering and island hopping by coach.",
    typicalTimeNeeded: "5 to 6 hours for Atlantic Ocean Road; 3 hours for local viewpoints or Bud village.",
    cruiseTips: [
      "Atlantic Ocean Road tours are road based, weather can affect visibility.",
      "Molde panorama from the town viewpoint is a compact alternative on shorter calls.",
      "Confirm excursion duration includes return buffer to the pier.",
    ],
    sampleTours: [
      { name: "Atlantic Ocean Road", description: "Iconic bridges and island hops along the wild Atlantic coast." },
      { name: "Bud fishing village", description: "Historic coastal village with aquarium and maritime heritage." },
    ],
    faqs: [
      { question: "How long is the Atlantic Ocean Road tour?", answer: "Typically five to six hours round trip from Molde cruise port, including photo stops." },
      { question: "Is Molde worth visiting on its own?", answer: "The town is pleasant but most cruise passengers come for the Atlantic Road or coastal excursions." },
    ],
  },
  {
    slug: "honningsvag",
    name: "Honningsvag",
    displayName: "Honningsvåg",
    localSiteUrl: "https://honningsvagshoreexcursions.com",
    region: "Arctic Finnmark",
    heroTour: "North Cape VIP",
    secondaryTours: ["Gjesvær Bird Safari", "King Crab"],
    bestFor: "Arctic milestones and wildlife",
    minimumPortTime: "4 hours",
    difficulty: "easy",
    themes: ["arctic", "wildlife", "scenic-drives"],
    cruiseFitNotes:
      "North Cape tours dominate schedules. Allow for Arctic weather and coach time to the plateau.",
    intro:
      "Honningsvåg is the gateway port for North Cape, the northernmost point of mainland Europe, plus bird safaris, king crab experiences, and raw Arctic coastal scenery.",
    whoBestFor:
      "Bucket-list travellers, wildlife watchers, and passengers on Arctic or midnight sun itineraries.",
    typicalTimeNeeded: "3 to 4 hours for North Cape; half day for bird safaris or culinary tours.",
    cruiseTips: [
      "Dress in warm layers even in summer, Arctic wind chill is significant.",
      "North Cape coaches follow strict return schedules; avoid independent trips that cut timing fine.",
      "Gjesvær puffin season is typically May to August.",
    ],
    sampleTours: [
      { name: "North Cape VIP", description: "Guided visit to the iconic plateau monument and Arctic visitor centre." },
      { name: "Gjesvær Bird Safari", description: "Boat trip to seabird colonies including puffins when in season." },
      { name: "King Crab", description: "Coastal safari with king crab tasting on the Barents Sea." },
    ],
    faqs: [
      { question: "Will I see the midnight sun from Honningsvåg?", answer: "On summer sailings above the Arctic Circle, yes, weather permitting. Exact dates depend on your sailing month." },
      { question: "How far is North Cape from the port?", answer: "Roughly 34 km by road; organised excursions handle timing and tickets." },
    ],
  },
  {
    slug: "kristiansand",
    name: "Kristiansand",
    displayName: "Kristiansand",
    localSiteUrl: "https://kristiansandshoreexcursions.com",
    region: "Southern Norway",
    heroTour: "Highlights",
    secondaryTours: ["Walking Tour", "Baneheia and Ravnedalen"],
    bestFor: "Southern Norway city breaks and family outings",
    minimumPortTime: "3 hours",
    difficulty: "easy",
    themes: ["city-walks", "family-friendly", "history"],
    cruiseFitNotes:
      "Relaxed southern port with walkable centre. Good for shorter calls and family-friendly parks.",
    intro:
      "Kristiansand offers a gentler Norway introduction on southern coast itineraries, with a compact city centre, harbour promenade, and green spaces like Baneheia and Ravnedalen.",
    whoBestFor:
      "Families, city walkers, and passengers on repositioning or southern Norway routes.",
    typicalTimeNeeded: "2 to 3 hours for highlights; half day for parks and museums.",
    cruiseTips: [
      "The city centre is walkable from most cruise piers.",
      "Posebyen old town offers white wooden houses without long transfers.",
      "Combine a guided walk with free time at the fish market area.",
    ],
    sampleTours: [
      { name: "Highlights", description: "Coach and walking overview of Kristiansand's key sights." },
      { name: "Walking Tour", description: "Guided exploration of Posebyen, harbour, and city centre." },
      { name: "Baneheia and Ravnedalen", description: "Parkland walks through woodland and ornamental gardens." },
    ],
    faqs: [
      { question: "Is Kristiansand a major fjord port?", answer: "No, it is a southern city port. Expect urban and coastal scenery rather than deep fjord drama." },
      { question: "Is it good for children?", answer: "Yes. Parks, beaches nearby, and compact touring suit families." },
    ],
  },
  {
    slug: "hellesylt",
    name: "Hellesylt",
    displayName: "Hellesylt",
    localSiteUrl: "https://hellesyltshoreexcursions.com",
    region: "Geirangerfjord",
    heroTour: "Mount Stranda",
    secondaryTours: ["Briksdal Glacier", "Geiranger panorama"],
    bestFor: "Full-day scenic touring and glacier combinations",
    minimumPortTime: "6 hours",
    difficulty: "moderate",
    themes: ["viewpoints", "glaciers", "unesco-fjord", "scenic-drives"],
    cruiseFitNotes:
      "Often a ferry transit port, excursion timing must align with ship movement through Geirangerfjord.",
    intro:
      "Hellesylt village marks the western entrance to Geirangerfjord. Some ships call briefly while others transit the fjord, excursions may combine glacier visits, viewpoints, or Geiranger sightseeing.",
    whoBestFor:
      "Passengers on scenic fjord transit days who want ambitious touring when the port call allows.",
    typicalTimeNeeded: "Full day for glacier or Geiranger combinations; 2 hours for village and waterfall.",
    cruiseTips: [
      "Confirm whether your ship docks or sails through, this affects available tour length.",
      "Hellesylt waterfall is visible from the village without a tour.",
      "Long glacier transfers are only viable on extended calls.",
    ],
    sampleTours: [
      { name: "Mount Stranda", description: "Viewpoint drive with fjord and mountain panoramas." },
      { name: "Briksdal Glacier", description: "Cross-region glacier excursion when port time allows." },
      { name: "Geiranger panorama", description: "Viewpoint touring linked to Geirangerfjord highlights." },
    ],
    faqs: [
      { question: "Is Hellesylt the same as Geiranger?", answer: "No, Hellesylt is at the fjord entrance. Some itineraries visit one, both, or sail between them." },
      { question: "How long is the ship in port?", answer: "Varies widely. Transit calls can be short; check your itinerary before booking ambitious tours." },
    ],
  },
  {
    slug: "trondheim",
    name: "Trondheim",
    displayName: "Trondheim",
    localSiteUrl: "https://trondheimshoreexcursions.com",
    region: "Trøndelag",
    heroTour: "City Walk",
    secondaryTours: ["Nidaros Cathedral", "Bakklandet"],
    bestFor: "History, cathedral architecture, and café culture",
    minimumPortTime: "4 hours",
    difficulty: "easy",
    themes: ["history", "city-walks", "culture"],
    cruiseFitNotes:
      "Excellent walkable city. Nidaros Cathedral and Bakklandet suit most call lengths.",
    intro:
      "Trondheim is Norway's medieval capital, centred on Nidaros Cathedral and the colourful wharves of Bakklandet. Cruise ships dock with tram or walk access to the historic core.",
    whoBestFor:
      "History buffs, architecture lovers, and passengers who prefer urban depth over fjord drama.",
    typicalTimeNeeded: "2 to 3 hours for cathedral and old town; half day for museums.",
    cruiseTips: [
      "Walk or tram from the port to Nidaros Cathedral.",
      "Bakklandet's old warehouses line the Nidelva river, ideal for self guided photos.",
      "City walks work well even when fjord-style tours are not available.",
    ],
    sampleTours: [
      { name: "City Walk", description: "Guided introduction to Trondheim's harbour, cathedral quarter, and streets." },
      { name: "Nidaros Cathedral", description: "Visit Norway's national shrine and Gothic architecture landmark." },
      { name: "Bakklandet", description: "Explore the old town boardwalk and colourful wharf buildings." },
    ],
    faqs: [
      { question: "Is Trondheim walkable from the cruise port?", answer: "Yes for most ships, with flat terrain to the city centre in 15 to 25 minutes." },
      { question: "Does Trondheim offer fjord excursions?", answer: "The focus is urban and cultural. Some seasonal fjord tours exist but city walks are the main draw." },
    ],
  },
  {
    slug: "nordfjordeid",
    name: "Nordfjordeid",
    displayName: "Nordfjordeid",
    localSiteUrl: "https://nordfjordeidshoreexcursions.com",
    region: "Nordfjord",
    heroTour: "Briksdal Glacier",
    secondaryTours: ["Viking heritage", "Tvinnefossen"],
    bestFor: "Glacier access with Viking heritage stops",
    minimumPortTime: "5 hours",
    difficulty: "moderate",
    themes: ["glaciers", "viking", "waterfalls"],
    cruiseFitNotes:
      "Alternative glacier gateway to Olden region. Viking sites add cultural variety on longer calls.",
    intro:
      "Nordfjordeid sits on Nordfjord's shore, offering glacier excursions toward Briksdal, Viking heritage sites, and waterfall viewpoints in a less crowded setting than larger ports.",
    whoBestFor:
      "Glacier-focused travellers and passengers interested in Viking history alongside scenery.",
    typicalTimeNeeded: "4 to 5 hours for Briksdal; 2 to 3 hours for heritage and waterfall tours.",
    cruiseTips: [
      "Compare timing with nearby Olden if your itinerary includes both.",
      "Viking heritage stops pair well with shorter glacier alternatives.",
      "Coach-based touring is standard, independent options are limited.",
    ],
    sampleTours: [
      { name: "Briksdal Glacier", description: "Glacier valley excursion shared with the wider Nordfjord region." },
      { name: "Viking heritage", description: "Visits to local Viking history sites and coastal settlements." },
      { name: "Tvinnefossen", description: "Waterfall stop on scenic Nordfjord drives." },
    ],
    faqs: [
      { question: "Nordfjordeid vs Olden, which is better?", answer: "Both access similar glacier country. Choice depends on your ship's port assignment and excursion schedules." },
      { question: "Is this port tender-only?", answer: "Most ships dock at Eid; confirm on your cruise line port guide." },
    ],
  },
  {
    slug: "skjolden",
    name: "Skjolden",
    displayName: "Skjolden",
    localSiteUrl: "https://skjoldenshoreexcursions.com",
    region: "Inner Sognefjord",
    heroTour: "Llama walk",
    secondaryTours: ["Fjord RIB", "Sognefjord adventure"],
    bestFor: "Adventure seekers and family-friendly unique experiences",
    minimumPortTime: "4 hours",
    difficulty: "moderate",
    themes: ["adventure", "family-friendly", "fjords"],
    cruiseFitNotes:
      "Tiny port at Sognefjord's inner end. RIB tours and unusual experiences dominate over classic coach touring.",
    intro:
      "Skjolden is a village at the head of Sognefjord, Norway's longest fjord, offering RIB adventures, llama walks, and intimate fjord experiences far from crowds.",
    whoBestFor:
      "Adventurous families, active travellers, and passengers seeking something beyond standard coach tours.",
    typicalTimeNeeded: "2 to 3 hours for RIB or llama experiences; half day for combined adventures.",
    cruiseTips: [
      "Port calls here are often on smaller or expedition-style ships.",
      "RIB tours require minimum age and fitness, check operator rules.",
      "The setting itself is the attraction, even short walks from the pier are scenic.",
    ],
    sampleTours: [
      { name: "Llama walk", description: "Unusual gentle trekking with llamas in fjord-side scenery." },
      { name: "Fjord RIB", description: "High-speed boat exploration of inner Sognefjord waters." },
      { name: "Sognefjord adventure", description: "Combined activity day tailored to active cruise passengers." },
    ],
    faqs: [
      { question: "How often do cruise ships visit Skjolden?", answer: "Less frequently than Flåm or Bergen, typically smaller ships on deep fjord routes." },
      { question: "Are llama walks suitable for children?", answer: "Generally yes with age limits, confirm with the local operator via the Skjolden port guide." },
    ],
  },
  {
    slug: "tromso",
    name: "Tromso",
    displayName: "Tromsø",
    localSiteUrl: "https://tromsoshoreexcursions.com",
    region: "Arctic Troms",
    heroTour: "Aurora Chase",
    secondaryTours: ["Fjord Photo Tour", "Reindeer Sami Experience"],
    bestFor: "Northern lights, Arctic culture, and winter cruising",
    minimumPortTime: "4 hours",
    difficulty: "easy",
    themes: ["northern-lights", "arctic", "wildlife", "culture"],
    cruiseFitNotes:
      "Seasonal focus: aurora in winter, midnight sun and fjord tours in summer. City walks suit short calls.",
    intro:
      "Tromsø is the Arctic capital, a compact city above the tree line with aurora chasing, Sami culture, fjord photography, and polar history museums for cruise passengers.",
    whoBestFor:
      "Northern lights hunters, culture travellers, and winter itinerary passengers.",
    typicalTimeNeeded: "3 to 4 hours for city and cable car; evening aurora tours need overnight or late sailings.",
    cruiseTips: [
      "Aurora excursions depend on darkness and weather, no guarantees.",
      "Fjord photo tours suit daylight port calls in any season.",
      "Reindeer and Sami experiences are popular ethical culture options, book early.",
      "Cable car to Mount Storsteinen works on most call lengths.",
    ],
    sampleTours: [
      { name: "Aurora Chase", description: "Evening aurora hunting away from city light pollution when conditions allow." },
      { name: "Fjord Photo Tour", description: "Guided photography route through Arctic fjord landscapes." },
      { name: "Reindeer Sami Experience", description: "Visit a Sami camp with reindeer feeding and cultural storytelling." },
    ],
    faqs: [
      { question: "Can I see northern lights on a port call?", answer: "Only on winter sailings with evening time ashore or overnight stays. Summer calls have midnight sun instead." },
      { question: "Is Tromsø walkable from the port?", answer: "Yes, the city centre is a manageable walk or short shuttle from most cruise terminals." },
    ],
  },
] as const;

export const portBySlug = Object.fromEntries(
  ports.map((p) => [p.slug, p]),
) as Record<string, PortData>;

export const portSlugs = ports.map((p) => p.slug);

export type PlannerInterest =
  | "Fjords"
  | "Glaciers"
  | "Waterfalls"
  | "Wildlife"
  | "Northern Lights"
  | "History"
  | "City Walks"
  | "Scenic Drives"
  | "Family Friendly"
  | "Private Tours"
  | "Active Tours";

export const plannerInterests: readonly PlannerInterest[] = [
  "Fjords",
  "Glaciers",
  "Waterfalls",
  "Wildlife",
  "Northern Lights",
  "History",
  "City Walks",
  "Scenic Drives",
  "Family Friendly",
  "Private Tours",
  "Active Tours",
];

export const interestToThemes: Record<PlannerInterest, readonly PortTheme[]> = {
  Fjords: ["fjords", "unesco-fjord"],
  Glaciers: ["glaciers"],
  Waterfalls: ["waterfalls"],
  Wildlife: ["wildlife", "arctic"],
  "Northern Lights": ["northern-lights", "arctic"],
  History: ["history", "viking", "culture"],
  "City Walks": ["city-walks"],
  "Scenic Drives": ["scenic-drives", "coastal-drives"],
  "Family Friendly": ["family-friendly"],
  "Private Tours": ["private-tours"],
  "Active Tours": ["active-tours", "adventure"],
};

export type PortTimeOption =
  | "Under 4 hours"
  | "4 to 6 hours"
  | "6 to 8 hours"
  | "8+ hours";

export type FitnessLevel = "Easy" | "Moderate" | "Active";

export const cruiseLines = [
  "P&O Cruises",
  "MSC Cruises",
  "Princess Cruises",
  "Celebrity Cruises",
  "Royal Caribbean",
  "Holland America Line",
  "Cunard",
  "Norwegian Cruise Line",
] as const;

export const sailingMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
