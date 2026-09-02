import {
  interestToThemes,
  portBySlug,
  type FitnessLevel,
  type PlannerInterest,
  type PortTheme,
  type PortTimeOption,
} from "@/lib/ports-data";
import { getPortImage } from "@/lib/site-images";
import { travellerTypes } from "@/lib/traveller-types";

export type ReturnConfidence = "green" | "amber" | "red";

export type PortRecommendation = {
  portSlug: string;
  portName: string;
  recommended: string;
  excursionType: string;
  why: string;
  cruiseFitScore: number;
  returnConfidence: ReturnConfidence;
  returnLabel: string;
  localSiteUrl: string;
  authorityPortPath: string;
  bestForTags: readonly string[];
  imageUrl: string;
  imageAlt: string;
};

export type MatchScoreBand = {
  label: string;
  tier: "excellent" | "great" | "good" | "fair";
};

export type ExcursionConfidence = {
  stars: number;
  label: string;
};

export type PlannerSummary = {
  overallScore: number;
  matchBand: MatchScoreBand;
  bestPort: string;
  bestPortSlug: string;
  bestPortWhy: string;
  bestExcursionType: string;
  bestHiddenGem: string;
  bestHiddenGemSlug: string;
  bestHiddenGemWhy: string;
  bestHiddenGemLabel: string;
  personalSummary: string;
  excursionConfidence: ExcursionConfidence;
  returnToShipSummary: string;
  greenCount: number;
  amberCount: number;
  redCount: number;
};

export type PlannerResult = {
  recommendations: PortRecommendation[];
  summary: PlannerSummary;
};

export type PlannerInput = {
  cruiseLine: string;
  shipName: string;
  sailingMonth: string;
  selectedPortSlugs: readonly string[];
  interests: readonly PlannerInterest[];
  travellerIds: readonly string[];
  fitnessLevel: FitnessLevel;
  portTime: PortTimeOption;
};

const portInsights: Record<
  string,
  { default: string; byInterest: Partial<Record<PlannerInterest, string>> }
> = {
  flam: {
    default:
      "Flåm puts UNESCO fjord scenery within easy reach of the pier, ideal for first-time Norway cruisers.",
    byInterest: {
      Fjords:
        "Stegastein and short fjord cruises deliver iconic Aurlandsfjord drama without long transfers.",
      "Scenic Drives":
        "The Stegastein viewpoint drive is one of Norway's most efficient scenery-to-time ratios from a cruise pier.",
      "Family Friendly":
        "Short fjord cruises and viewpoint tours work well for mixed-age groups with minimal walking.",
    },
  },
  stavanger: {
    default:
      "Stavanger pairs a compact old town with Lysefjord access, strong on shorter port calls.",
    byInterest: {
      Fjords:
        "Lysefjord can be experienced without strenuous walking and offers dramatic scenery from the water.",
      "City Walks":
        "Old Stavanger and the harbour are walkable from most piers, no long coach time required.",
      "Family Friendly":
        "Gentle city walks and harbour sightseeing suit families when port time is limited.",
    },
  },
  bergen: {
    default:
      "Bergen blends Bryggen culture with headline fjord cruises, one of Norway's most versatile cruise cities.",
    byInterest: {
      Fjords:
        "Mostraumen sails from the harbour area and adds deep fjord drama to a city day.",
      "City Walks":
        "Bryggen, Torget and funicular viewpoints fit comfortably around a half day schedule.",
      History:
        "UNESCO Bryggen and Hanseatic history make Bergen rewarding even without a long excursion.",
    },
  },
  geiranger: {
    default:
      "Geiranger is pure UNESCO fjord theatre, viewpoint drives deliver more than village wandering alone.",
    byInterest: {
      "Scenic Drives":
        "Dalsnibba and Eagle Road convert a short port into some of Norway's most photographed panoramas.",
      Waterfalls:
        "Seven Sisters and fjord-level sightseeing are the headline reasons ships call here.",
      Fjords:
        "This is the classic Geirangerfjord experience, plan a viewpoint or fjord tour, not just pier time.",
    },
  },
  olden: {
    default:
      "Olden is a glacier gateway, the best scenery sits in the valleys beyond the village.",
    byInterest: {
      Glaciers:
        "Briksdal puts blue-ice scenery within reach, making Olden essential on glacier-focused routes.",
      "Active Tours":
        "Valley walks toward Briksdal suit moderate fitness with a clear glacier payoff.",
      "Scenic Drives":
        "Loen Skylift and Nordfjord panoramas reward passengers with five or more hours ashore.",
    },
  },
  eidfjord: {
    default:
      "Eidfjord is built around waterfall and plateau nature, a quieter alternative to crowded fjord villages.",
    byInterest: {
      Waterfalls:
        "Vøringsfossen platforms deliver one of Norway's most powerful falls on a focused half day tour.",
      "Scenic Drives":
        "Hardanger plateau drives combine waterfalls with high-mountain scenery.",
    },
  },
  tromso: {
    default:
      "Tromsø is the Arctic capital, match your excursion to season, daylight and whether evenings are dark.",
    byInterest: {
      "Northern Lights":
        "Aurora chasing needs winter darkness, this port shines when your sailing includes evening time.",
      Wildlife:
        "Reindeer and Sami experiences add cultural depth beyond standard city sightseeing.",
      "City Walks":
        "Compact Arctic city walks and the cathedral quarter suit shorter, easy port days.",
    },
  },
  honningsvag: {
    default:
      "Honningsvåg is an Arctic milestone port, North Cape and wildlife tours define the day.",
    byInterest: {
      Wildlife:
        "Gjesvær puffin safaris and king crab experiences are the standout Arctic wildlife options.",
      "Northern Lights":
        "On winter routes, organised aurora touring away from port lights is the priority here.",
      "Scenic Drives":
        "North Cape coach tours are the classic long day from this gateway port.",
    },
  },
  skjolden: {
    default:
      "Skjolden rewards passengers who want something beyond standard coach touring at the inner Sognefjord.",
    byInterest: {
      "Active Tours":
        "Fjord RIB and adventure combinations suit passengers who want more than a passive coach day.",
      "Family Friendly":
        "Llama walks and gentle inner-fjord experiences are memorable for mixed-age groups.",
      Fjords:
        "Inner Sognefjord scenery here feels remote despite being on mainstream cruise routes.",
    },
  },
  trondheim: {
    default:
      "Trondheim rewards culture-first passengers with cathedral heritage and walkable streets.",
    byInterest: {
      History:
        "Nidaros Cathedral and Bakklandet wharves anchor a strong historic city day.",
      "City Walks":
        "Flat, compact streets make Trondheim one of Norway's easiest city ports for independent walking.",
    },
  },
  kristiansand: {
    default:
      "Kristiansand offers relaxed southern Norway city and park touring on shorter calls.",
    byInterest: {
      "City Walks":
        "Posebyen and harbour promenades suit easy pacing without glacier-country transfers.",
      "Family Friendly":
        "Parks, beaches nearby and compact touring make this a gentle family port.",
    },
  },
  alesund: {
    default:
      "Ålesund combines Art Nouveau streets with quick viewpoint payoff from Mount Aksla.",
    byInterest: {
      "Scenic Drives":
        "Mount Aksla and coastal drives deliver strong panoramas even on shorter port windows.",
      "Family Friendly":
        "Atlantic Ocean Park and gentle city walks work well for families.",
    },
  },
  molde: {
    default:
      "Molde is the gateway to the Atlantic Ocean Road, worth the half day if your port time allows.",
    byInterest: {
      "Scenic Drives":
        "The Atlantic Ocean Road is one of Norway's great coastal drives from a cruise port.",
    },
  },
  hellesylt: {
    default:
      "Hellesylt suits ambitious scenic days when your ship allows time for glacier or fjord combinations.",
    byInterest: {
      Glaciers:
        "Glacier combinations from Hellesylt work when port time is long enough for cross-region touring.",
      "Scenic Drives":
        "Geiranger panorama routes link this fjord entrance to headline viewpoint scenery.",
    },
  },
  nordfjordeid: {
    default:
      "Nordfjordeid offers glacier and Viking heritage with fewer crowds than larger Nordfjord stops.",
    byInterest: {
      Glaciers:
        "Briksdal access from Eid suits glacier seekers on quieter itineraries.",
      History:
        "Viking heritage stops add cultural variety to glacier-focused touring.",
    },
  },
};

function formatList(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function buildPersonalisedWhy(
  portSlug: string,
  interests: readonly PlannerInterest[],
  travellerIds: readonly string[],
  fitnessLevel: FitnessLevel,
  tour: string,
): string {
  const port = portBySlug[portSlug];
  if (!port) return "This port fits your selected itinerary with sensible cruise-day timing.";

  const travellerLabels = travellerIds
    .map((id) => travellerTypes.find((t) => t.id === id)?.label)
    .filter(Boolean) as string[];

  const intro =
    travellerLabels.length > 0
      ? `You selected ${formatList(travellerLabels)}. `
      : interests.length > 0
        ? `Based on your selected interests, `
        : "";

  const insight = portInsights[portSlug];
  let body =
    interests
      .map((i) => insight?.byInterest[i])
      .find(Boolean) ??
    insight?.default ??
    port.cruiseFitNotes;

  if (tour.includes("private") || tour.includes("Private")) {
    body += " A private option adds flexible pacing for your group.";
  }

  if (fitnessLevel === "Easy" && port.difficulty !== "easy") {
    body += " Choose the shorter or coach based variant to match your easy fitness preference.";
  } else if (fitnessLevel === "Active" && port.difficulty === "active") {
    body += " Your active fitness level aligns well with this port's adventure options.";
  }

  return `${intro}${port.displayName} scores highly because ${body.charAt(0).toLowerCase()}${body.slice(1)}`;
}

const hiddenGemSlugs = [
  "skjolden",
  "eidfjord",
  "hellesylt",
  "nordfjordeid",
  "molde",
  "kristiansand",
] as const;

const themeToExcursionType: Partial<Record<PortTheme, string>> = {
  fjords: "Fjord cruising",
  "unesco-fjord": "UNESCO fjord sightseeing",
  glaciers: "Glacier touring",
  waterfalls: "Waterfall viewpoints",
  viewpoints: "Fjord viewpoints",
  wildlife: "Wildlife safari",
  "northern-lights": "Northern Lights chase",
  arctic: "Arctic experiences",
  "city-walks": "City walking tours",
  history: "Historic city walks",
  "scenic-drives": "Scenic coastal drives",
  "family-friendly": "Family friendly touring",
  "private-tours": "Private sightseeing",
  "active-tours": "Active adventure tours",
  adventure: "Adventure excursions",
  culture: "Cultural experiences",
};

const portTimeHours: Record<PortTimeOption, number> = {
  "Under 4 hours": 3.5,
  "4 to 6 hours": 5,
  "6 to 8 hours": 7,
  "8+ hours": 9,
};

const minHoursByPort: Record<string, number> = {
  flam: 4,
  stavanger: 3,
  bergen: 4,
  alesund: 3,
  geiranger: 4,
  olden: 5,
  eidfjord: 4,
  molde: 5,
  honningsvag: 4,
  kristiansand: 3,
  hellesylt: 6,
  trondheim: 4,
  nordfjordeid: 5,
  skjolden: 4,
  tromso: 4,
};

const difficultyRank: Record<string, number> = {
  easy: 1,
  moderate: 2,
  active: 3,
};

const fitnessRank: Record<FitnessLevel, number> = {
  Easy: 1,
  Moderate: 2,
  Active: 3,
};

function getReturnConfidence(
  portSlug: string,
  portTime: PortTimeOption,
  recommendedTour: string,
): { confidence: ReturnConfidence; label: string } {
  const hours = portTimeHours[portTime];
  const minNeeded = minHoursByPort[portSlug] ?? 4;
  const isLongTour =
    recommendedTour.includes("Glacier") ||
    recommendedTour.includes("Atlantic") ||
    recommendedTour.includes("Railway") ||
    recommendedTour.includes("Aurora") ||
    recommendedTour.includes("North Cape");

  if (hours >= minNeeded + 2 && !isLongTour) {
    return { confidence: "green", label: "Comfortable fit" };
  }
  if (hours >= minNeeded) {
    if (isLongTour && hours < minNeeded + 2) {
      return { confidence: "amber", label: "Check exact timings" };
    }
    return { confidence: "green", label: "Comfortable fit" };
  }
  if (hours >= minNeeded - 1) {
    return { confidence: "amber", label: "Check exact timings" };
  }
  return {
    confidence: "red",
    label: "Avoid longer tours unless port call is extended",
  };
}

function scorePortMatch(
  portSlug: string,
  interests: readonly PlannerInterest[],
  fitnessLevel: FitnessLevel,
  portTime: PortTimeOption,
): number {
  const port = portBySlug[portSlug];
  if (!port) return 0;

  let score = 55;
  const hours = portTimeHours[portTime];
  const minNeeded = minHoursByPort[portSlug] ?? 4;

  if (hours >= minNeeded) score += 15;
  else if (hours >= minNeeded - 1) score += 5;
  else score -= 15;

  const fitnessDiff = Math.abs(
    difficultyRank[port.difficulty] - fitnessRank[fitnessLevel],
  );
  score += fitnessDiff === 0 ? 12 : fitnessDiff === 1 ? 6 : -8;

  if (interests.length === 0) {
    score += 10;
  } else {
    let themeMatches = 0;
    for (const interest of interests) {
      const themes = interestToThemes[interest];
      if (themes.some((t) => port.themes.includes(t))) themeMatches++;
    }
    score += Math.min(20, themeMatches * 6);
  }

  if (portSlug === "flam" || portSlug === "geiranger" || portSlug === "bergen") {
    score += 3;
  }

  return Math.max(35, Math.min(98, Math.round(score)));
}

function pickRecommendedTour(
  portSlug: string,
  interests: readonly PlannerInterest[],
  travellerIds: readonly string[],
  fitnessLevel: FitnessLevel,
): { tour: string; why: string; excursionType: string } {
  const port = portBySlug[portSlug];
  if (!port) {
    return {
      tour: "Local highlights",
      why: "General port sightseeing",
      excursionType: "Local highlights",
    };
  }

  const priorityMap: Partial<Record<PlannerInterest, string>> = {
    Fjords:
      port.secondaryTours.find((t) => t.toLowerCase().includes("fjord")) ??
      port.heroTour,
    Glaciers:
      port.secondaryTours.find((t) => t.toLowerCase().includes("glacier")) ??
      port.heroTour,
    Waterfalls: port.heroTour,
    Wildlife: port.secondaryTours[0] ?? port.heroTour,
    "Northern Lights": port.heroTour,
    History:
      port.secondaryTours.find((t) => t.toLowerCase().includes("walk")) ??
      port.heroTour,
    "City Walks":
      port.secondaryTours.find((t) => t.toLowerCase().includes("walk")) ??
      port.heroTour,
    "Scenic Drives": port.heroTour,
    "Family Friendly": port.heroTour,
    "Private Tours": `${port.heroTour} (private option)`,
    "Active Tours":
      port.secondaryTours[port.secondaryTours.length - 1] ?? port.heroTour,
  };

  for (const interest of interests) {
    const match = priorityMap[interest];
    if (match) {
      return {
        tour: match,
        why: buildPersonalisedWhy(
          portSlug,
          interests,
          travellerIds,
          fitnessLevel,
          match,
        ),
        excursionType: deriveExcursionType(port.themes, interest),
      };
    }
  }

  const defaultWhy = buildPersonalisedWhy(
    portSlug,
    interests,
    travellerIds,
    fitnessLevel,
    port.heroTour,
  );

  return {
    tour: port.heroTour,
    why: defaultWhy,
    excursionType: deriveExcursionType(port.themes),
  };
}

function deriveExcursionType(
  themes: readonly PortTheme[],
  interest?: PlannerInterest,
): string {
  if (interest) {
    const fromInterest = interestToThemes[interest]?.[0];
    if (fromInterest && themeToExcursionType[fromInterest]) {
      return themeToExcursionType[fromInterest]!;
    }
  }
  for (const theme of themes) {
    const label = themeToExcursionType[theme];
    if (label) return label;
  }
  return "Shore excursions";
}

export function buildBestForTags(portSlug: string): readonly string[] {
  const port = portBySlug[portSlug];
  if (!port) return [];

  const themeLabels: Partial<Record<PortTheme, string>> = {
    fjords: "Fjords",
    glaciers: "Glaciers",
    waterfalls: "Waterfalls",
    viewpoints: "Viewpoints",
    "first-time-visitors": "First timers",
    "city-walks": "City walks",
    "short-port-calls": "Short calls",
    wildlife: "Wildlife",
    "northern-lights": "Northern Lights",
    arctic: "Arctic",
    "family-friendly": "Families",
    adventure: "Adventure",
    history: "History",
  };

  const tags = port.themes
    .slice(0, 4)
    .map((t) => themeLabels[t])
    .filter(Boolean) as string[];

  if (tags.length === 0) {
    return [port.bestFor.split(",")[0]?.trim() ?? "Cruise passengers"];
  }
  return tags;
}

export function getMatchScoreBand(score: number): MatchScoreBand {
  if (score >= 90) {
    return { label: "Excellent Match", tier: "excellent" };
  }
  if (score >= 75) {
    return { label: "Great Match", tier: "great" };
  }
  if (score >= 60) {
    return { label: "Good Match", tier: "good" };
  }
  return { label: "Fair Match", tier: "fair" };
}

export function getExcursionConfidence(score: number): ExcursionConfidence {
  if (score >= 90) {
    return { stars: 5, label: "Perfect Match" };
  }
  if (score >= 75) {
    return { stars: 4, label: "Strong Match" };
  }
  return { stars: 3, label: "Good Match" };
}

export function getPortExcursionConfidence(
  score: number,
): ExcursionConfidence {
  if (score >= 88) {
    return { stars: 5, label: "Perfect Match" };
  }
  if (score >= 72) {
    return { stars: 4, label: "Strong Match" };
  }
  return { stars: 3, label: "Good Match" };
}

function buildHiddenGemWhy(
  slug: string,
  interests: readonly PlannerInterest[],
): string {
  const insight = portInsights[slug];
  const interestWhy = interests
    .map((i) => insight?.byInterest[i])
    .find(Boolean);
  if (interestWhy) return interestWhy;
  if (insight?.default) return insight.default;
  const port = portBySlug[slug];
  return (
    port?.cruiseFitNotes ??
    "Lesser known than headline fjord stops but well suited to your interests without heavy crowds."
  );
}

function pickHiddenGem(
  recommendations: PortRecommendation[],
  interests: readonly PlannerInterest[],
  excludeSlug?: string,
): { name: string; slug: string; why: string } {
  const exclude = excludeSlug?.toLowerCase();

  const selectedHidden = recommendations
    .filter(
      (r) =>
        (hiddenGemSlugs as readonly string[]).includes(r.portSlug) &&
        r.portSlug.toLowerCase() !== exclude,
    )
    .sort((a, b) => b.cruiseFitScore - a.cruiseFitScore);

  if (selectedHidden[0]) {
    return {
      name: selectedHidden[0].portName,
      slug: selectedHidden[0].portSlug,
      why: selectedHidden[0].why,
    };
  }

  const sorted = [...recommendations].sort(
    (a, b) => b.cruiseFitScore - a.cruiseFitScore,
  );
  const alternate = sorted.find((r) => r.portSlug.toLowerCase() !== exclude);
  if (alternate) {
    return {
      name: alternate.portName,
      slug: alternate.portSlug,
      why: alternate.why,
    };
  }

  let bestSlug: string = hiddenGemSlugs[0];
  let bestScore = 0;
  for (const slug of hiddenGemSlugs) {
    const score = scorePortMatch(slug, interests, "Easy", "6 to 8 hours");
    if (score > bestScore) {
      bestScore = score;
      bestSlug = slug;
    }
  }

  return {
    name: portBySlug[bestSlug]?.displayName ?? "Skjolden",
    slug: bestSlug,
    why: buildHiddenGemWhy(bestSlug, interests),
  };
}

function uniquePhraseList(parts: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const part of parts) {
    const key = part.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(part.trim());
  }

  return unique;
}

function deriveFocusPhrase(
  interests: readonly PlannerInterest[],
  fitnessLevel: FitnessLevel,
): string {
  const parts: string[] = [];

  if (
    interests.some((i) =>
      ["Fjords", "Waterfalls", "Scenic Drives", "Glaciers"].includes(i),
    )
  ) {
    parts.push("scenic fjords");
  } else if (interests.some((i) => ["City Walks", "History"].includes(i))) {
    parts.push("culture rich city days");
  } else if (
    interests.some((i) =>
      ["Wildlife", "Northern Lights", "Arctic"].includes(i),
    )
  ) {
    parts.push("Arctic and wildlife highlights");
  } else {
    parts.push("iconic Norway highlights");
  }

  if (fitnessLevel === "Easy") {
    parts.push("comfortable sightseeing");
  } else if (fitnessLevel === "Moderate") {
    parts.push("balanced walking and coach touring");
  } else {
    parts.push("active adventure options");
  }

  const unique = uniquePhraseList(parts);
  if (unique.length < 3 && !unique.some((part) => part.includes("iconic Norway"))) {
    unique.push("iconic Norway highlights");
  }

  return formatList(uniquePhraseList(unique).slice(0, 3));
}

function normalizeSummaryPhrase(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function removeDuplicateSummaryPhrases(text: string): string {
  const withoutInlineRepeats = text.replace(
    /\b(.{8,}?)(?:,\s*|\s+and\s+)\1\b/gi,
    "$1",
  );

  const sentences = withoutInlineRepeats.split(/(?<=[.!?])\s+/).filter(Boolean);
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const sentence of sentences) {
    const key = normalizeSummaryPhrase(sentence);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(sentence);
  }

  return unique.join(" ");
}

function buildPersonalSummary(
  input: PlannerInput,
  bestPortName: string,
  hiddenGemName: string,
  bestExcursionType: string,
): string {
  const focus = deriveFocusPhrase(input.interests, input.fitnessLevel);

  const hiddenPart =
    hiddenGemName.toLowerCase() === bestPortName.toLowerCase()
      ? "a quieter port day in your itinerary is the standout secondary pick"
      : `${hiddenGemName} is the standout secondary pick`;

  const summary = `Based on your cruise line, interests and ${input.fitnessLevel.toLowerCase()} fitness level, this itinerary focuses on ${focus}. ${bestPortName} is your strongest overall match, while ${hiddenPart}. ${bestExcursionType} excursions are likely to suit you best.`;

  return removeDuplicateSummaryPhrases(summary);
}

function buildReturnSummary(counts: {
  green: number;
  amber: number;
  red: number;
}): string {
  const parts: string[] = [];
  if (counts.green > 0) {
    parts.push(
      `${counts.green} comfortable fit${counts.green > 1 ? "s" : ""}`,
    );
  }
  if (counts.amber > 0) {
    parts.push(
      `${counts.amber} need exact timing check${counts.amber > 1 ? "s" : ""}`,
    );
  }
  if (counts.red > 0) {
    parts.push(
      `${counts.red} avoid longer tour${counts.red > 1 ? "s" : ""} unless extended`,
    );
  }
  return parts.length > 0
    ? `Return to ship confidence: ${parts.join("; ")}`
    : "Return to ship confidence: confirm all aboard times with your operator";
}

function buildSummary(
  recommendations: PortRecommendation[],
  input: PlannerInput,
): PlannerSummary {
  const { interests } = input;
  const greenCount = recommendations.filter(
    (r) => r.returnConfidence === "green",
  ).length;
  const amberCount = recommendations.filter(
    (r) => r.returnConfidence === "amber",
  ).length;
  const redCount = recommendations.filter(
    (r) => r.returnConfidence === "red",
  ).length;

  const avgScore =
    recommendations.reduce((sum, r) => sum + r.cruiseFitScore, 0) /
    recommendations.length;

  const timingBonus =
    greenCount === recommendations.length
      ? 5
      : redCount > 0
        ? -4
        : 0;

  const overallScore = Math.max(
    40,
    Math.min(98, Math.round(avgScore + timingBonus)),
  );

  const sortedByScore = [...recommendations].sort(
    (a, b) => b.cruiseFitScore - a.cruiseFitScore,
  );
  const best = sortedByScore[0];
  const excursionTypes = recommendations.map((r) => r.excursionType);
  const typeFrequency = excursionTypes.reduce<Record<string, number>>(
    (acc, type) => {
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const bestExcursionType =
    Object.entries(typeFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    best?.excursionType ??
    "Fjord viewpoints";

  let hiddenGem = pickHiddenGem(recommendations, interests, best?.portSlug);
  let hiddenGemLabel = "Hidden Gem";

  if (best && hiddenGem.slug === best.portSlug) {
    const alternate = sortedByScore.find((r) => r.portSlug !== best.portSlug);
    if (alternate) {
      hiddenGem = {
        name: alternate.portName,
        slug: alternate.portSlug,
        why: alternate.why,
      };
    } else {
      hiddenGemLabel = "Best Alternative Experience";
      hiddenGem = {
        name: bestExcursionType,
        slug: best.portSlug,
        why: "A flexible alternative shore day style that still fits your interests and port time.",
      };
    }
  }


  return {
    overallScore,
    matchBand: getMatchScoreBand(overallScore),
    bestPort: best?.portName ?? "Geiranger",
    bestPortSlug: best?.portSlug ?? "geiranger",
    bestPortWhy: best?.why ?? "Strong all round cruise fit for your selected interests.",
    bestExcursionType,
    bestHiddenGem: hiddenGem.name,
    bestHiddenGemSlug: hiddenGem.slug,
    bestHiddenGemWhy: hiddenGem.why,
    bestHiddenGemLabel: hiddenGemLabel,
    personalSummary: buildPersonalSummary(
      input,
      best?.portName ?? "Geiranger",
      hiddenGem.name,
      bestExcursionType,
    ),
    excursionConfidence: getExcursionConfidence(overallScore),
    returnToShipSummary: buildReturnSummary({
      green: greenCount,
      amber: amberCount,
      red: redCount,
    }),
    greenCount,
    amberCount,
    redCount,
  };
}

export function generatePlannerRecommendations(
  input: PlannerInput,
): PlannerResult {
  const recommendations = input.selectedPortSlugs.map((slug) => {
    const port = portBySlug[slug];
    const { tour, why, excursionType } = pickRecommendedTour(
      slug,
      input.interests,
      input.travellerIds,
      input.fitnessLevel,
    );
    const cruiseFitScore = scorePortMatch(
      slug,
      input.interests,
      input.fitnessLevel,
      input.portTime,
    );
    const { confidence, label } = getReturnConfidence(
      slug,
      input.portTime,
      tour,
    );
    const image = getPortImage(slug);

    return {
      portSlug: slug,
      portName: port?.displayName ?? slug,
      recommended: tour,
      excursionType,
      why,
      cruiseFitScore,
      returnConfidence: confidence,
      returnLabel: label,
      localSiteUrl: port?.localSiteUrl ?? "#",
      authorityPortPath: `/ports/${slug}`,
      bestForTags: buildBestForTags(slug),
      imageUrl: image.url,
      imageAlt: image.alt,
    };
  });

  return {
    recommendations,
    summary: buildSummary(recommendations, input),
  };
}

export function getConfidenceClass(confidence: ReturnConfidence): string {
  switch (confidence) {
    case "green":
      return "confidence-green";
    case "amber":
      return "confidence-amber";
    case "red":
      return "confidence-red";
  }
}
