/** Short hero copy for curated featured ships on cruise line pages. */
export const featuredShipSummaryBySlug: Record<string, string> = {
  "msc-euribia":
    "LNG powered flagship with heavy Geiranger and Flåm rotations in our 2026 Norway data.",
  "msc-virtuosa":
    "Resort style ship repeating Bergen and Stavanger on busy summer fjord loops.",
  "msc-preziosa":
    "Classic MSC fjord programme with Geiranger and Ålesund in peak season sailings.",
  iona: "Mega ship anchor for P&O Norway with Iona class capacity and school holiday demand.",
  britannia:
    "British favourite on Southampton fjord cruises with full day calls at headline ports.",
  arcadia:
    "Adults oriented P&O ship on longer Norway and Arctic leaning routes.",
  aurora:
    "Mid size P&O vessel mixing Bergen culture days with scenic western fjord stops.",
  "celebrity-apex":
    "Premium ship leading Celebrity Geiranger and Flåm calls in our 2026 schedule data.",
  "celebrity-eclipse":
    "Upscale couples ship on measured scenic Norway port days with longer windows.",
  "queen-anne":
    "Newest Cunard liner with ballroom evenings and refined Bergen to Olden pacing.",
  "queen-mary-2":
    "Ocean liner heritage on transatlantic linked Norway segments with formal culture.",
  "queen-victoria":
    "Classic Cunard ship on Northern Europe fjord routes with cathedral focused port days.",
  "queen-elizabeth":
    "Elegant Cunard vessel mixing Geiranger scenic days with compact city touring.",
  rotterdam:
    "HAL flagship on in depth Norway loops with Trondheim and Eidfjord museum days.",
  "nieuw-statendam":
    "Modern HAL ship repeating Ålesund and Olden on slower paced scenic voyages.",
  zuiderdam:
    "Comfortable HAL classic with Geiranger and Bergen on select summer sailings.",
  "sky-princess":
    "Princess flagship on Olden glacier routes and Stavanger Lysefjord days.",
  "regal-princess":
    "Premium mainstream ship with multigenerational Norway port programmes.",
  "majestic-princess":
    "Large Princess vessel on North Atlantic Norway calls with Arctic extensions possible.",
  "viking-neptune":
    "Viking Ocean ship on adults only fjord intensive routes with long Bergen stays.",
  "viking-sky":
    "Destination focused Viking liner repeating Geiranger and Flåm in summer data.",
  "viking-vela":
    "Newer Viking Ocean vessel on Arctic leaning and classic fjord port rotations.",
  "viking-jupiter":
    "Viking ship with extended port windows suited to independent cultural touring.",
  "liberty-of-the-seas":
    "Mega ship on select 2026 Norway calls at Olden, Stavanger and Kristiansand.",
  "disney-dream":
    "Family ship with Bergen, Stavanger, Ålesund and Olden in our Norway data.",
  "norwegian-star":
    "Freestyle NCL ship with frequent Bergen and Ålesund calls in 2026 schedules.",
};

export function getFeaturedShipSummary(slug: string): string | undefined {
  return featuredShipSummaryBySlug[slug];
}
