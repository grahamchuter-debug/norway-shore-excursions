import type { PlannerInterest } from "@/lib/ports-data";

export type TravellerType = {
  id: string;
  label: string;
  icon: string;
  description: string;
  interests: readonly PlannerInterest[];
};

export const travellerTypes: readonly TravellerType[] = [
  {
    id: "photographer",
    label: "Photographer",
    icon: "📷",
    description: "Light, viewpoints and flexible pacing",
    interests: ["Scenic Drives", "Private Tours", "Fjords"],
  },
  {
    id: "fjord-lover",
    label: "Fjord Lover",
    icon: "🛳️",
    description: "Water-level and mountain fjord drama",
    interests: ["Fjords", "Scenic Drives"],
  },
  {
    id: "viewpoint-hunter",
    label: "Scenic View Hunter",
    icon: "🏔️",
    description: "Platforms, skylifts and panorama drives",
    interests: ["Scenic Drives", "Fjords"],
  },
  {
    id: "wildlife-explorer",
    label: "Wildlife Explorer",
    icon: "🦅",
    description: "Puffins, reindeer and Arctic safaris",
    interests: ["Wildlife", "Northern Lights"],
  },
  {
    id: "easy-walker",
    label: "Easy Walker",
    icon: "🚶",
    description: "City walks and minimal transfers",
    interests: ["City Walks", "History"],
  },
  {
    id: "family",
    label: "Family Traveller",
    icon: "👨‍👩‍👧",
    description: "Gentle tours with broad appeal",
    interests: ["Family Friendly", "City Walks"],
  },
  {
    id: "first-time",
    label: "First Time in Norway",
    icon: "✨",
    description: "Iconic highlights without over-planning",
    interests: ["Fjords", "Scenic Drives", "City Walks"],
  },
  {
    id: "luxury",
    label: "Luxury Traveller",
    icon: "🥂",
    description: "Private touring and premium pacing",
    interests: ["Private Tours", "Scenic Drives"],
  },
  {
    id: "active",
    label: "Active Adventurer",
    icon: "🥾",
    description: "RIB, hikes and glacier valleys",
    interests: ["Active Tours", "Glaciers", "Wildlife"],
  },
] as const;

export function interestsFromTravellerIds(
  selectedIds: readonly string[],
): PlannerInterest[] {
  const set = new Set<PlannerInterest>();
  for (const type of travellerTypes) {
    if (selectedIds.includes(type.id)) {
      for (const interest of type.interests) set.add(interest);
    }
  }
  return [...set];
}

export function travellerIdsFromInterests(
  interests: readonly PlannerInterest[],
): string[] {
  if (interests.length === 0) return [];
  return travellerTypes
    .filter((type) =>
      type.interests.some((interest) => interests.includes(interest)),
    )
    .map((type) => type.id);
}
