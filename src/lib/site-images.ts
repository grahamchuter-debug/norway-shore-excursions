/** Verified Wikimedia Commons URLs (HTTP 200 checked). */

export const siteImages = {
  hero:
    "https://upload.wikimedia.org/wikipedia/commons/5/56/Fl%C3%A5m_fr%C3%A5_cruiseskip_ved_kai.jpg",
  sognefjord:
    "https://upload.wikimedia.org/wikipedia/commons/1/1e/Sognefjord-Norway-April-2011.jpg",
  geiranger:
    "https://upload.wikimedia.org/wikipedia/commons/1/10/Flydalsjuvet_Geiranger_Geirangerfjorden.jpg",
  glacier:
    "https://upload.wikimedia.org/wikipedia/commons/c/ca/Briksdalsbreen_Glacier_-Norway.jpg",
  waterfall:
    "https://upload.wikimedia.org/wikipedia/commons/b/b6/Voringsfossen_waterfall_at_Eidfjord%2C_Norway.jpg",
  northernLights:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Northern_lights_in_Tromso.jpg/1280px-Northern_lights_in_Tromso.jpg",
  bergen:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Harbour_Bergen_Norway_2009_5.jpg/1280px-Harbour_Bergen_Norway_2009_5.jpg",
  trondheim:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Puerto%2C_Trondheim%2C_Noruega%2C_2019-09-06%2C_DD_26.jpg/1280px-Puerto%2C_Trondheim%2C_Noruega%2C_2019-09-06%2C_DD_26.jpg",
  northCape:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Globe_Monument_at_Nordkapp.jpg/1280px-Globe_Monument_at_Nordkapp.jpg",
  stavanger:
    "https://upload.wikimedia.org/wikipedia/commons/6/66/Cruise_ship_Stavanger_Norway.jpg",
  alesund:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/%C3%85lesund_Aksla_lub_2025-07-28_img36_Aussicht.jpg/1280px-%C3%85lesund_Aksla_lub_2025-07-28_img36_Aussicht.jpg",
  atlanticRoad:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Storseisundet_bridge.jpg/1280px-Storseisundet_bridge.jpg",
  arctic:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Troms%C3%B8_harbour_01.jpg/1280px-Troms%C3%B8_harbour_01.jpg",
  planner:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Bergen_panoramic_photograph_taken_from_Fl%C3%B8yen_mountain.jpg/1280px-Bergen_panoramic_photograph_taken_from_Fl%C3%B8yen_mountain.jpg",
  kristiansand:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Kristiansand_harbour.jpg/1280px-Kristiansand_harbour.jpg",
  puffins:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Atlantic_Puffin_Fratercula_arctica.jpg/1280px-Atlantic_Puffin_Fratercula_arctica.jpg",
  skjolden:
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Skjolden_village.jpg",
} as const;

export const imageAlts = {
  hero:
    "Cruise ship docked in a Norwegian fjord port with steep mountains rising from the water",
  sognefjord:
    "Sognefjord, Norway's longest fjord, with mountains and calm blue water",
  geiranger:
    "Geirangerfjord UNESCO fjord scenery with a cruise ship sailing between cliffs",
  glacier:
    "Briksdal Glacier in Olden valley with ice and mountain scenery for Norway cruise excursions",
  waterfall:
    "Vøringsfossen waterfall in Eidfjord, a popular shore excursion from Norway cruise ships",
  northernLights:
    "Aurora borealis over Tromsø harbour, ideal for Arctic Norway cruise shore excursions",
  bergen:
    "Bergen harbour and Bryggen waterfront with cruise-friendly access from Vågen",
  trondheim:
    "Trondheim harbour and waterfront on Trondheimsfjord for cruise shore excursions",
  northCape:
    "North Cape Globe Monument at the top of Norway, a classic Arctic cruise excursion destination",
  stavanger:
    "Cruise ship at Stavanger harbour on Lysefjord gateway port day",
  alesund:
    "Ålesund Art Nouveau cityscape from Mount Aksla viewpoint on a Norway cruise port day",
  atlanticRoad:
    "Storseisundet bridge on the Atlantic Ocean Road, a scenic Norway cruise shore excursion route",
  arctic:
    "Tromsø Arctic harbour city used as a gateway for northern lights and fjord excursions",
  planner:
    "Panoramic Norway fjord and city views for cruise excursion planning",
  kristiansand:
    "Kristiansand harbour and city centre on Norway's southern coast",
  puffins:
    "Atlantic puffins on the Norwegian coast, a wildlife shore excursion highlight",
  skjolden:
    "Skjolden village at the inner end of Lustrafjord on Sognefjord",
} as const;

export function getPortImage(slug: string): { url: string; alt: string } {
  const map: Record<string, { url: string; alt: string }> = {
    flam: {
      url: siteImages.hero,
      alt: "Flåm harbour with cruise ship at the pier beneath Aurlandsfjord mountains",
    },
    stavanger: { url: siteImages.stavanger, alt: imageAlts.stavanger },
    bergen: { url: siteImages.bergen, alt: imageAlts.bergen },
    alesund: { url: siteImages.alesund, alt: imageAlts.alesund },
    geiranger: { url: siteImages.geiranger, alt: imageAlts.geiranger },
    olden: { url: siteImages.glacier, alt: imageAlts.glacier },
    eidfjord: { url: siteImages.waterfall, alt: imageAlts.waterfall },
    molde: { url: siteImages.atlanticRoad, alt: imageAlts.atlanticRoad },
    honningsvag: { url: siteImages.northCape, alt: imageAlts.northCape },
    kristiansand: { url: siteImages.kristiansand, alt: imageAlts.kristiansand },
    hellesylt: {
      url: siteImages.geiranger,
      alt: "Hellesylt village at the head of Geirangerfjord",
    },
    trondheim: { url: siteImages.trondheim, alt: imageAlts.trondheim },
    nordfjordeid: {
      url: siteImages.glacier,
      alt: "Nordfjordeid gateway to glacier and waterfall excursions",
    },
    skjolden: { url: siteImages.skjolden, alt: imageAlts.skjolden },
    tromso: { url: siteImages.arctic, alt: imageAlts.arctic },
  };
  return map[slug] ?? { url: siteImages.hero, alt: imageAlts.hero };
}

export function getThemeImage(slug: string): { url: string; alt: string } {
  const map: Record<string, { url: string; alt: string }> = {
    "fjord-shore-excursions-norway": {
      url: siteImages.sognefjord,
      alt: imageAlts.sognefjord,
    },
    "glacier-shore-excursions-norway": {
      url: siteImages.glacier,
      alt: imageAlts.glacier,
    },
    "waterfall-shore-excursions-norway": {
      url: siteImages.waterfall,
      alt: imageAlts.waterfall,
    },
    "wildlife-shore-excursions-norway": {
      url: siteImages.puffins,
      alt: imageAlts.puffins,
    },
    "northern-lights-shore-excursions-norway": {
      url: siteImages.northernLights,
      alt: imageAlts.northernLights,
    },
    "family-shore-excursions-norway": {
      url: siteImages.bergen,
      alt: "Family friendly Bergen harbour excursion",
    },
    "hiking-shore-excursions-norway": {
      url: siteImages.stavanger,
      alt: "Hiking viewpoint over Lysefjord near Stavanger",
    },
    "scenic-drive-shore-excursions-norway": {
      url: siteImages.atlanticRoad,
      alt: imageAlts.atlanticRoad,
    },
    "best-viewpoint-tours-norway": {
      url: siteImages.alesund,
      alt: imageAlts.alesund,
    },
    "best-private-tours-norway": {
      url: siteImages.geiranger,
      alt: imageAlts.geiranger,
    },
  };
  return map[slug] ?? { url: siteImages.hero, alt: imageAlts.hero };
}
