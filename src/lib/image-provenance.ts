/**
 * Image provenance inventory for Norway Shore Excursions authority site.
 *
 * Existing live imagery is Wikimedia Commons hotlinks. Creator/licence fields
 * below are provisional where not fully verified in-repo — NEW IMAGE SOURCING
 * or licence confirmation may still be required before commercial redesign.
 */

export type ImageProvenance = {
  id: string;
  filenameOrKey: string;
  subject: string;
  location: string;
  creator: string;
  provider: string;
  sourceUrl: string;
  licence: string;
  licenceStatus: "documented" | "needs_confirmation" | "missing_asset";
  altText: string;
  currentUse: string;
};

export const imageProvenanceRegistry: readonly ImageProvenance[] = [
  {
    id: "hero",
    filenameOrKey: "siteImages.hero",
    subject: "Cruise ship at pier in Flåm",
    location: "Flåm, Aurlandsfjord, Norway",
    creator: "Unknown / Wikimedia uploader (verify on Commons file page)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Fl%C3%A5m_fr%C3%A5_cruiseskip_ved_kai.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Cruise ship docked in a Norwegian fjord port with steep mountains rising from the water",
    currentUse: "Homepage hero, OG default, several fallbacks",
  },
  {
    id: "sognefjord",
    filenameOrKey: "siteImages.sognefjord",
    subject: "Sognefjord landscape",
    location: "Sognefjord, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Sognefjord-Norway-April-2011.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Sognefjord, Norway's longest fjord, with mountains and calm blue water",
    currentUse: "Fjord theme",
  },
  {
    id: "geiranger",
    filenameOrKey: "siteImages.geiranger",
    subject: "Geirangerfjord from Flydalsjuvet",
    location: "Geiranger, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Flydalsjuvet_Geiranger_Geirangerfjorden.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Geirangerfjord UNESCO fjord scenery with a cruise ship sailing between cliffs",
    currentUse: "Geiranger port / theme",
  },
  {
    id: "glacier",
    filenameOrKey: "siteImages.glacier",
    subject: "Briksdalsbreen glacier",
    location: "Olden / Briksdal, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Briksdalsbreen_Glacier_-Norway.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Briksdal Glacier in Olden valley with ice and mountain scenery for Norway cruise excursions",
    currentUse: "Olden / Nordfjordeid / glacier theme",
  },
  {
    id: "waterfall",
    filenameOrKey: "siteImages.waterfall",
    subject: "Vøringsfossen waterfall",
    location: "Eidfjord, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b6/Voringsfossen_waterfall_at_Eidfjord%2C_Norway.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Vøringsfossen waterfall in Eidfjord, a popular shore excursion from Norway cruise ships",
    currentUse: "Eidfjord / waterfall theme",
  },
  {
    id: "northernLights",
    filenameOrKey: "siteImages.northernLights",
    subject: "Aurora over Tromsø",
    location: "Tromsø, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Northern_lights_in_Tromso.jpg/1280px-Northern_lights_in_Tromso.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Aurora borealis over Tromsø harbour, ideal for Arctic Norway cruise shore excursions",
    currentUse: "Northern lights theme",
  },
  {
    id: "bergen",
    filenameOrKey: "siteImages.bergen",
    subject: "Bergen harbour",
    location: "Bergen, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Harbour_Bergen_Norway_2009_5.jpg/1280px-Harbour_Bergen_Norway_2009_5.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Bergen harbour and Bryggen waterfront with cruise-friendly access from Vågen",
    currentUse: "Bergen port / contact hero / family theme",
  },
  {
    id: "trondheim",
    filenameOrKey: "siteImages.trondheim",
    subject: "Trondheim harbour",
    location: "Trondheim, Norway",
    creator: "Diego Delso (verify on Commons)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Puerto%2C_Trondheim%2C_Noruega%2C_2019-09-06%2C_DD_26.jpg/1280px-Puerto%2C_Trondheim%2C_Noruega%2C_2019-09-06%2C_DD_26.jpg",
    licence: "Likely CC BY-SA — confirm on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Trondheim harbour and waterfront on Trondheimsfjord for cruise shore excursions",
    currentUse: "Trondheim port",
  },
  {
    id: "northCape",
    filenameOrKey: "siteImages.northCape",
    subject: "North Cape Globe Monument",
    location: "Nordkapp, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Globe_Monument_at_Nordkapp.jpg/1280px-Globe_Monument_at_Nordkapp.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "North Cape Globe Monument at the top of Norway, a classic Arctic cruise excursion destination",
    currentUse: "Honningsvåg port",
  },
  {
    id: "stavanger",
    filenameOrKey: "siteImages.stavanger",
    subject: "Cruise ship at Stavanger",
    location: "Stavanger, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/66/Cruise_ship_Stavanger_Norway.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Cruise ship at Stavanger harbour on Lysefjord gateway port day",
    currentUse: "Stavanger port / hiking theme",
  },
  {
    id: "alesund",
    filenameOrKey: "siteImages.alesund",
    subject: "Ålesund from Mount Aksla",
    location: "Ålesund, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/%C3%85lesund_Aksla_lub_2025-07-28_img36_Aussicht.jpg/1280px-%C3%85lesund_Aksla_lub_2025-07-28_img36_Aussicht.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Ålesund Art Nouveau cityscape from Mount Aksla viewpoint on a Norway cruise port day",
    currentUse: "Ålesund port / viewpoints theme",
  },
  {
    id: "atlanticRoad",
    filenameOrKey: "siteImages.atlanticRoad",
    subject: "Storseisundet bridge",
    location: "Atlantic Ocean Road, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Storseisundet_bridge.jpg/1280px-Storseisundet_bridge.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Storseisundet bridge on the Atlantic Ocean Road, a scenic Norway cruise shore excursion route",
    currentUse: "Molde / scenic drive theme",
  },
  {
    id: "arctic",
    filenameOrKey: "siteImages.arctic",
    subject: "Tromsø harbour",
    location: "Tromsø, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Troms%C3%B8_harbour_01.jpg/1280px-Troms%C3%B8_harbour_01.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText:
      "Tromsø Arctic harbour city used as a gateway for northern lights and fjord excursions",
    currentUse: "Tromsø port",
  },
  {
    id: "planner",
    filenameOrKey: "siteImages.planner",
    subject: "Bergen from Fløyen",
    location: "Bergen, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Bergen_panoramic_photograph_taken_from_Fl%C3%B8yen_mountain.jpg/1280px-Bergen_panoramic_photograph_taken_from_Fl%C3%B8yen_mountain.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Panoramic Norway fjord and city views for cruise excursion planning",
    currentUse: "Planner / about heroes",
  },
  {
    id: "kristiansand",
    filenameOrKey: "siteImages.kristiansand",
    subject: "Kristiansand harbour",
    location: "Kristiansand, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Kristiansand_harbour.jpg/1280px-Kristiansand_harbour.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Kristiansand harbour and city centre on Norway's southern coast",
    currentUse: "Kristiansand port",
  },
  {
    id: "puffins",
    filenameOrKey: "siteImages.puffins",
    subject: "Atlantic puffins",
    location: "Norwegian coast (generic wildlife)",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Atlantic_Puffin_Fratercula_arctica.jpg/1280px-Atlantic_Puffin_Fratercula_arctica.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Atlantic puffins on the Norwegian coast, a wildlife shore excursion highlight",
    currentUse: "Wildlife theme",
  },
  {
    id: "skjolden",
    filenameOrKey: "siteImages.skjolden",
    subject: "Skjolden village",
    location: "Skjolden, Lustrafjord, Norway",
    creator: "Unknown / Wikimedia uploader (verify)",
    provider: "Wikimedia Commons",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Skjolden_village.jpg",
    licence: "Needs confirmation on Commons file page",
    licenceStatus: "needs_confirmation",
    altText: "Skjolden village at the inner end of Lustrafjord on Sognefjord",
    currentUse: "Skjolden port",
  },
  {
    id: "ship-placeholder",
    filenameOrKey: "public/images/ships/placeholder.svg",
    subject: "Ship image placeholder",
    location: "N/A",
    creator: "Site asset",
    provider: "Local",
    sourceUrl: "/images/ships/placeholder.svg",
    licence: "Site-owned SVG",
    licenceStatus: "documented",
    altText: "Cruise ship illustration placeholder",
    currentUse: "Fallback when ship JPG missing",
  },
];

/** Referenced in data/ships/ship-images.json but not present as JPGs on disk. */
export const missingShipImageNote =
  "data/ships/ship-images.json references ~28 /images/ships/*.jpg paths; public/images/ships contains placeholder.svg only. ShipImage component already falls back gracefully.";
