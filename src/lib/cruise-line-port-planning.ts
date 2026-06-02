import type { CruiseLineData } from "@/lib/cruise-lines-data";
import type { CruiseLinePortSummary } from "@/lib/cruise-line-schedules";
import {
  getPortExcursionLink,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import {
  cruiseLineExcursionPortSlugs,
  getPortCategorizedExcursions,
  type ExcursionPick,
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
  portRegion: string;
  description: string;
  portGuideHref: string;
  excursionHubHref: string;
  scheduleHref: string | null;
  best: ExcursionPick;
  smallGroup: ExcursionPick;
  scenic: ExcursionPick;
};

const portCardDescriptions: Record<
  (typeof cruiseLineExcursionPortSlugs)[number],
  string
> = {
  flam:
    "Iconic Aurlandsfjord stop with pier side access. Stegastein and fjord cruises suit most full port days.",
  bergen:
    "Norway's culture and fjord gateway. Bryggen walks and Mostraumen cruises fit a single measured day ashore.",
  olden:
    "Nordfjord glacier port. Briksdal valley and Loen Skylift need most of a full day ashore.",
  geiranger:
    "UNESCO fjord village at Geirangerfjord head. Viewpoint drives and fjord sailings reward full port windows.",
  stavanger:
    "Walkable old town plus Lysefjord access from Vågen harbour. City loops or fjord cruises match most call lengths.",
  alesund:
    "Art Nouveau islands on Norway's west coast. Mount Aksla and coastal drives suit compact port days.",
};

type LinePortExcursionOverrides = {
  description?: string;
  best?: ExcursionPick;
  smallGroup?: ExcursionPick;
  scenic?: ExcursionPick;
};

const linePortExcursionOverrides: Partial<
  Record<string, Partial<Record<(typeof cruiseLineExcursionPortSlugs)[number], LinePortExcursionOverrides>>>
> = {
  "p-and-o-cruises-norway": {
    flam: {
      description:
        "Headline Aurlandsfjord stop on Iona and Britannia sailings. Stegastein and Naeroyfjord suit typical P&O full port days.",
    },
    olden: {
      description:
        "Busy glacier port on P&O fjord loops. Briksdal and Loen Skylift need a full day and early booking on peak sailings.",
    },
  },
  "royal-caribbean-norway": {
    flam: {
      description:
        "High demand stop on Icon and Anthem class sailings. Stegastein and short fjord cruises suit typical Royal Caribbean port windows.",
    },
  },
  "norwegian-cruise-line-norway": {
    geiranger: {
      description:
        "Signature UNESCO fjord day on Norwegian Prima and Encore routes. Dalsnibba and fjord sailings need a full port window.",
    },
  },
  "viking-norway-cruises": {
    bergen: {
      description:
        "Culture rich city call on Viking ocean itineraries. Mostraumen and Bryggen walks suit the line's measured port pacing.",
    },
  },
  "celebrity-cruises-norway": {
    stavanger: {
      description:
        "Lysefjord gateway on Celebrity Edge class Norway sailings. Fjord cruises or old town walks fit most call lengths.",
    },
  },
  "holland-america-norway": {
    geiranger: {
      description:
        "Classic fjord highlight on Rotterdam and Nieuw Statendam routes. Viewpoint drives reward Holland America full day calls.",
    },
  },
  "princess-cruises-norway": {
    olden: {
      description:
        "Glacier headline on Sky and Sun class fjord itineraries. Briksdal suits Princess passengers with five or more hours ashore.",
    },
  },
  "cunard-norway": {
    flam: {
      description:
        "Scenic Aurlandsfjord call on Queen Mary 2 and Queen Victoria sailings. Stegastein and fjord cruises suit Cunard full port days.",
    },
  },
  "disney-cruise-line-norway": {
    alesund: {
      description:
        "Family friendly Art Nouveau port on Disney Magic Norway sailings. Mount Aksla and gentle coastal tours suit all ages.",
    },
  },
  "msc-cruises-norway": {
    bergen: {
      description:
        "Versatile city port on MSC Euribia and Preziosa Norway routes. Mostraumen and Bryggen walks fit MSC full day calls.",
    },
  },
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

function buildLinePortExcursionEntry(
  line: CruiseLineData,
  portSlug: (typeof cruiseLineExcursionPortSlugs)[number],
): LinePortExcursionEntry | null {
  const port = portBySlug[portSlug];
  const categorized = getPortCategorizedExcursions(portSlug);
  if (!port || !categorized) return null;

  const overrides = linePortExcursionOverrides[line.slug]?.[portSlug];

  return {
    portSlug,
    portDisplayName: port.displayName,
    portRegion: port.region,
    description: overrides?.description ?? portCardDescriptions[portSlug],
    portGuideHref: `/ports/${portSlug}`,
    excursionHubHref: getPortExcursionLink(portSlug),
    scheduleHref: hasRealScheduleData(portSlug)
      ? shipSchedulePortPath(portSlug)
      : null,
    best: overrides?.best ?? categorized.best,
    smallGroup: overrides?.smallGroup ?? categorized.smallGroup,
    scenic: overrides?.scenic ?? categorized.scenic,
  };
}

export function getLinePortExcursionEntries(
  line: CruiseLineData,
): LinePortExcursionEntry[] {
  return cruiseLineExcursionPortSlugs
    .map((portSlug) => buildLinePortExcursionEntry(line, portSlug))
    .filter((entry): entry is LinePortExcursionEntry => entry !== null);
}
