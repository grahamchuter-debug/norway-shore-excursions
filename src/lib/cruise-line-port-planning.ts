import type { CruiseLineData } from "@/lib/cruise-lines-data";
import type { CruiseLinePortSummary } from "@/lib/cruise-line-schedules";
import {
  getPortExcursionLink,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import {
  getPortRecommendedExcursions,
  isMappedExcursionPort,
  type RecommendedExcursionCard,
} from "@/lib/port-recommended-excursions";
import { portBySlug } from "@/lib/ports-data";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";

export type TypicalTimeAshore = "half-day" | "full-day";

export type PortTimeAshoreEntry = {
  portSlug: string;
  timeAshore: TypicalTimeAshore;
  /** Short planning note, no ship specific times. */
  planningNote: string;
};

export type LinePortExcursionEntry = {
  portSlug: string;
  portDisplayName: string;
  portGuideHref: string;
  excursionHubHref: string;
  scheduleHref: string | null;
  excursions: readonly RecommendedExcursionCard[];
  hasMappedExcursions: boolean;
};

const portTypicalTimeAshore: Record<string, PortTimeAshoreEntry> = {
  flam: {
    portSlug: "flam",
    timeAshore: "full-day",
    planningNote:
      "Headline Aurlandsfjord stop. Plan Stegastein, railway or Naeroyfjord with a full port day.",
  },
  bergen: {
    portSlug: "bergen",
    timeAshore: "full-day",
    planningNote:
      "Major city call with room for Bryggen, funicular and a Mostraumen fjord cruise.",
  },
  geiranger: {
    portSlug: "geiranger",
    timeAshore: "full-day",
    planningNote:
      "UNESCO fjord day. Allow time for Dalsnibba, Eagle Road or a fjord sailing.",
  },
  olden: {
    portSlug: "olden",
    timeAshore: "full-day",
    planningNote:
      "Glacier port. Briksdal and Loen Skylift need most of a full day ashore.",
  },
  stavanger: {
    portSlug: "stavanger",
    timeAshore: "full-day",
    planningNote:
      "City and Lysefjord port. Walking tours fit a half day, fjord cruises need longer.",
  },
  eidfjord: {
    portSlug: "eidfjord",
    timeAshore: "full-day",
    planningNote:
      "Hardanger gateway. Vøringsfossen and scenic drives suit a full port window.",
  },
  alesund: {
    portSlug: "alesund",
    timeAshore: "full-day",
    planningNote:
      "Art Nouveau city with Mount Aksla viewpoints. Easy to fill a full day ashore.",
  },
  trondheim: {
    portSlug: "trondheim",
    timeAshore: "full-day",
    planningNote:
      "Historic city call. Cathedral, old town and harbour walks fit a relaxed full day.",
  },
  nordfjordeid: {
    portSlug: "nordfjordeid",
    timeAshore: "full-day",
    planningNote:
      "Nordfjord base. Glacier and scenic drives need a full day, not a quick stop.",
  },
  skjolden: {
    portSlug: "skjolden",
    timeAshore: "full-day",
    planningNote:
      "Inner Sognefjord call. Treat like a full day port for Jostedalen and Luster touring.",
  },
  honningsvag: {
    portSlug: "honningsvag",
    timeAshore: "full-day",
    planningNote:
      "North Cape gateway. Plan a focused full day for the plateau or bird cliff tours.",
  },
  tromso: {
    portSlug: "tromso",
    timeAshore: "full-day",
    planningNote:
      "Arctic city port. Cable car, polar history and harbour walks suit a full day ashore.",
  },
  molde: {
    portSlug: "molde",
    timeAshore: "half-day",
    planningNote:
      "Often a shorter Romsdal call. Pick one highlight such as Atlantic Ocean Road or viewpoints.",
  },
  hellesylt: {
    portSlug: "hellesylt",
    timeAshore: "half-day",
    planningNote:
      "Tender or transit stop at the fjord mouth. Focus on one waterfall or viewpoint.",
  },
  kristiansand: {
    portSlug: "kristiansand",
    timeAshore: "half-day",
    planningNote:
      "Southern city call. Old town and zoo areas fit a compact half day ashore.",
  },
};

const defaultTimeAshore: PortTimeAshoreEntry = {
  portSlug: "",
  timeAshore: "full-day",
  planningNote: "Typical Norway fjord or city call with a full day ashore on most sailings.",
};

export function getPortTypicalTimeAshore(portSlug: string): PortTimeAshoreEntry {
  return (
    portTypicalTimeAshore[portSlug] ?? {
      ...defaultTimeAshore,
      portSlug,
    }
  );
}

export function timeAshoreLabel(timeAshore: TypicalTimeAshore): string {
  return timeAshore === "half-day" ? "Half day" : "Full day";
}

export function timeAshoreBadgeClass(timeAshore: TypicalTimeAshore): string {
  if (timeAshore === "half-day") {
    return "bg-amber-50 text-amber-900 ring-amber-200/80";
  }
  return "bg-emerald-50 text-emerald-900 ring-emerald-200/80";
}

/** Ports to show on line planning sections: recommended first, then schedule order. */
export function getLinePlanningPortSlugs(
  line: CruiseLineData,
  schedulePorts: readonly CruiseLinePortSummary[],
  limit = 6,
): string[] {
  const scheduleOrder = schedulePorts.map((p) => p.portSlug);
  const merged: string[] = [];

  for (const slug of line.recommendedPortSlugs) {
    if (portBySlug[slug] && !merged.includes(slug)) {
      merged.push(slug);
    }
  }

  for (const slug of scheduleOrder) {
    if (!merged.includes(slug)) {
      merged.push(slug);
    }
  }

  if (merged.length === 0) {
    return line.recommendedPortSlugs.slice(0, limit);
  }

  return merged.slice(0, limit);
}

export function getLinePortTimeAshoreEntries(
  line: CruiseLineData,
  schedulePorts: readonly CruiseLinePortSummary[],
): PortTimeAshoreEntry[] {
  return getLinePlanningPortSlugs(line, schedulePorts).map((portSlug) =>
    getPortTypicalTimeAshore(portSlug),
  );
}

function excursionCardsForPort(portSlug: string): readonly RecommendedExcursionCard[] {
  const cards = getPortRecommendedExcursions(portSlug, {
    fitExcursionHref: "/return-to-ship-guide#will-this-excursion-fit",
  });

  if (!isMappedExcursionPort(portSlug)) {
    return cards.slice(0, 1);
  }

  return cards.filter((card) => !card.url.includes("norway-cruise-planner")).slice(0, 2);
}

export function getLinePortExcursionEntries(
  line: CruiseLineData,
  schedulePorts: readonly CruiseLinePortSummary[],
): LinePortExcursionEntry[] {
  return getLinePlanningPortSlugs(line, schedulePorts).map((portSlug) => {
    const port = portBySlug[portSlug];
    return {
      portSlug,
      portDisplayName: port.displayName,
      portGuideHref: `/ports/${portSlug}`,
      excursionHubHref: getPortExcursionLink(portSlug),
      scheduleHref: hasRealScheduleData(portSlug)
        ? shipSchedulePortPath(portSlug)
        : null,
      excursions: excursionCardsForPort(portSlug),
      hasMappedExcursions: isMappedExcursionPort(portSlug),
    };
  });
}
