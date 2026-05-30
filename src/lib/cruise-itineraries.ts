import type { PlannerInterest } from "@/lib/ports-data";

export type CruiseItinerary = {
  id: string;
  title: string;
  description: string;
  portSlugs: readonly string[];
  bestFor: readonly string[];
  interests: readonly PlannerInterest[];
  accent: "fjord" | "glacier" | "arctic" | "city" | "adventure";
};

export const popularItineraries: readonly CruiseItinerary[] = [
  {
    id: "classic-fjords",
    title: "Classic Fjords Route",
    description:
      "The headline Norway route, UNESCO fjords, city culture and iconic viewpoints.",
    portSlugs: ["flam", "bergen", "geiranger", "olden"],
    bestFor: [
      "First time Norway cruisers",
      "Fjords",
      "Viewpoints",
      "Glaciers",
    ],
    interests: ["Fjords", "Scenic Drives", "Glaciers"],
    accent: "fjord",
  },
  {
    id: "glacier-waterfall",
    title: "Glacier & Waterfall Route",
    description:
      "Blue ice, powerful falls and inner fjord scenery across western Norway.",
    portSlugs: ["olden", "eidfjord", "skjolden", "hellesylt"],
    bestFor: ["Glaciers", "Waterfalls", "Scenic drives"],
    interests: ["Glaciers", "Waterfalls", "Scenic Drives"],
    accent: "glacier",
  },
  {
    id: "arctic-norway",
    title: "Arctic Explorer Route",
    description:
      "North Cape milestones, aurora potential and Sami culture above the Arctic Circle.",
    portSlugs: ["tromso", "honningsvag", "trondheim"],
    bestFor: [
      "Northern Lights",
      "North Cape",
      "Wildlife",
      "Sami culture",
    ],
    interests: ["Northern Lights", "Wildlife", "History"],
    accent: "arctic",
  },
  {
    id: "easy-walking",
    title: "Easy Walking Route",
    description:
      "Walkable cities and gentle touring for shorter port calls and relaxed pacing.",
    portSlugs: ["kristiansand", "trondheim", "bergen", "stavanger"],
    bestFor: ["City walks", "History", "Short port calls"],
    interests: ["City Walks", "History", "Family Friendly"],
    accent: "city",
  },
  {
    id: "adventure-norway",
    title: "Adventure Norway Cruise",
    description:
      "RIB boats, bird safaris, reindeer encounters and dramatic fjord viewpoints.",
    portSlugs: ["skjolden", "honningsvag", "tromso", "geiranger"],
    bestFor: [
      "RIB boats",
      "Bird safari",
      "Reindeer",
      "Fjord viewpoints",
    ],
    interests: ["Active Tours", "Wildlife", "Fjords"],
    accent: "adventure",
  },
  {
    id: "hidden-gems",
    title: "Hidden Gems Route",
    description:
      "Quieter ports and unusual excursions away from the busiest fjord crowds.",
    portSlugs: ["skjolden", "nordfjordeid", "hellesylt", "molde"],
    bestFor: [
      "Quieter ports",
      "Unusual excursions",
      "Scenic drives",
      "Adventure",
    ],
    interests: ["Scenic Drives", "Active Tours", "Wildlife"],
    accent: "glacier",
  },
] as const;

const routeCardIds = new Set([
  "classic-fjords",
  "glacier-waterfall",
  "arctic-norway",
  "easy-walking",
  "hidden-gems",
]);

/** Five headline route cards for homepage and planner presets */
export const popularCruiseRoutes = popularItineraries.filter((i) =>
  routeCardIds.has(i.id),
);

export function getRouteById(id: string): CruiseItinerary | undefined {
  return popularItineraries.find((i) => i.id === id);
}
