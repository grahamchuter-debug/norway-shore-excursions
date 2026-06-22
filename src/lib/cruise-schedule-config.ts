/**
 * Norway cruise schedule site config.
 * Clone this file per destination (Caribbean, Alaska, Canada, Mediterranean)
 * and point the CSV import REGION + port slugs at the new market.
 */

export const cruiseScheduleDisclaimer =
  "Cruise schedules can change due to weather, port operations and cruise line itinerary updates. Always confirm your ship's latest arrival and all aboard time with your cruise line.";

/** Ports in master hub display order (grouped by region on the hub page). */
export const scheduledPortSlugs = [
  "flam",
  "bergen",
  "olden",
  "geiranger",
  "eidfjord",
  "nordfjordeid",
  "skjolden",
  "hellesylt",
  "stavanger",
  "alesund",
  "molde",
  "trondheim",
  "honningsvag",
  "tromso",
  "kristiansand",
] as const;

/** Hub page regional groupings. Port slugs must match scheduledPortSlugs. */
export const schedulePortRegions = [
  {
    label: "Fjord Norway",
    portSlugs: [
      "flam",
      "bergen",
      "olden",
      "geiranger",
      "eidfjord",
      "nordfjordeid",
      "skjolden",
      "hellesylt",
    ],
  },
  {
    label: "Western Norway / Coastal",
    portSlugs: ["stavanger", "alesund", "molde", "trondheim"],
  },
  {
    label: "Northern Norway",
    portSlugs: ["honningsvag", "tromso"],
  },
  {
    label: "Southern Norway",
    portSlugs: ["kristiansand"],
  },
] as const;

export type ScheduledPortSlug = (typeof scheduledPortSlugs)[number];

export const scheduleYears = ["2026", "2027"] as const;

export const scheduleYear = scheduleYears[0];

export const scheduleMonths2026 = ["06", "07", "08", "09"] as const;

export const scheduleMonths2027 = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

/** URL slugs for monthly schedule pages, e.g. june-2026 */
export const scheduleMonthSlugs2026 = [
  "june-2026",
  "july-2026",
  "august-2026",
  "september-2026",
] as const;

export const scheduleMonthSlugs2027 = [
  "january-2027",
  "february-2027",
  "march-2027",
  "april-2027",
  "may-2027",
  "june-2027",
  "july-2027",
  "august-2027",
  "september-2027",
  "october-2027",
  "november-2027",
  "december-2027",
] as const;

export const allScheduleMonthSlugs = [
  ...scheduleMonthSlugs2026,
  ...scheduleMonthSlugs2027,
] as const;

export type ScheduleMonthSlug2026 = (typeof scheduleMonthSlugs2026)[number];
export type ScheduleMonthSlug2027 = (typeof scheduleMonthSlugs2027)[number];
export type ScheduleMonthSlug = ScheduleMonthSlug2026 | ScheduleMonthSlug2027;

/** Master Norway schedule hub (reusable by port sites via shared data helpers). */
export const shipScheduleHubPath = "/ship-schedules";

export const shipScheduleSearchPath = `${shipScheduleHubPath}/search`;

const numericMonthToSlug: Record<string, ScheduleMonthSlug> = {
  "01": "january-2027",
  "02": "february-2027",
  "03": "march-2027",
  "04": "april-2027",
  "05": "may-2027",
  "06": "june-2026",
  "07": "july-2026",
  "08": "august-2026",
  "09": "september-2026",
  "10": "october-2027",
  "11": "november-2027",
  "12": "december-2027",
};

const slugToNumericMonth: Record<
  ScheduleMonthSlug,
  (typeof scheduleMonths2026)[number] | (typeof scheduleMonths2027)[number]
> = {
  "january-2027": "01",
  "february-2027": "02",
  "march-2027": "03",
  "april-2027": "04",
  "may-2027": "05",
  "june-2026": "06",
  "july-2026": "07",
  "august-2026": "08",
  "september-2026": "09",
  "june-2027": "06",
  "july-2027": "07",
  "august-2027": "08",
  "september-2027": "09",
  "october-2027": "10",
  "november-2027": "11",
  "december-2027": "12",
};

export function getScheduleMonthSlugsForYear(year: string): readonly ScheduleMonthSlug[] {
  if (year === "2026") return scheduleMonthSlugs2026;
  if (year === "2027") return scheduleMonthSlugs2027;
  return [];
}

export function buildScheduleMonthSlug(
  month: number | string,
  year: number | string = scheduleYear,
): ScheduleMonthSlug {
  const yearString = String(year);
  const numeric = normalizeScheduleMonth(month);
  const slug =
    yearString === "2027"
      ? (`${monthLabels[numeric]?.toLowerCase() ?? "january"}-2027` as ScheduleMonthSlug)
      : numericMonthToSlug[numeric];
  if (!slug) {
    throw new Error(`Unsupported schedule month slug for ${month} in ${yearString}`);
  }
  if (yearString === "2026" && !slug.endsWith("-2026")) {
    throw new Error(`Unsupported schedule year ${yearString} for month ${month}`);
  }
  if (yearString === "2027" && !slug.endsWith("-2027")) {
    throw new Error(`Unsupported schedule year ${yearString} for month ${month}`);
  }
  return slug;
}

export function parseScheduleMonthSlug(
  monthSlug: string,
): { month: string; year: string } | null {
  const key = monthSlug.trim().toLowerCase() as ScheduleMonthSlug;
  const month = slugToNumericMonth[key];
  if (!month) return null;
  const year = key.endsWith("-2027") ? "2027" : "2026";
  return { month, year };
}

export function shipSchedulePortPath(portSlug: string): string {
  return `${shipScheduleHubPath}/${normalizeSchedulePortSlug(portSlug)}`;
}

export function shipScheduleMonthPath(
  portSlug: string,
  monthSlug: ScheduleMonthSlug | string,
): string {
  return `${shipSchedulePortPath(portSlug)}/${monthSlug}`;
}

export function getScheduleMonthLabelFromSlug(monthSlug: string): string {
  const parsed = parseScheduleMonthSlug(monthSlug);
  if (!parsed) return monthSlug;
  return monthLabels[parsed.month] ?? monthSlug;
}

export const monthLabels: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

/** Keep in sync with scripts/cruise-schedule-utils.js */
export const schedulePortAliases: Record<string, string> = {
  flam: "flam",
  flåm: "flam",
  flaam: "flam",
  aurland: "flam",
  bergen: "bergen",
  olden: "olden",
  nordfjordeid: "nordfjordeid",
  "nordfjordeid eid": "nordfjordeid",
  eid: "nordfjordeid",
  eidfjord: "eidfjord",
  geiranger: "geiranger",
  stavanger: "stavanger",
  alesund: "alesund",
  ålesund: "alesund",
  molde: "molde",
  honningsvag: "honningsvag",
  honningsvåg: "honningsvag",
  kristiansand: "kristiansand",
  hellesylt: "hellesylt",
  trondheim: "trondheim",
  skjolden: "skjolden",
  tromso: "tromso",
  tromsø: "tromso",
};

const scheduleMonthAliases: Record<string, string> = {
  "1": "01",
  "01": "01",
  jan: "01",
  january: "01",
  "2": "02",
  "02": "02",
  feb: "02",
  february: "02",
  "3": "03",
  "03": "03",
  mar: "03",
  march: "03",
  "4": "04",
  "04": "04",
  apr: "04",
  april: "04",
  "5": "05",
  "05": "05",
  may: "05",
  "6": "06",
  "06": "06",
  jun: "06",
  june: "06",
  "7": "07",
  "07": "07",
  jul: "07",
  july: "07",
  "8": "08",
  "08": "08",
  aug: "08",
  august: "08",
  "9": "09",
  "09": "09",
  sep: "09",
  sept: "09",
  september: "09",
  "10": "10",
  oct: "10",
  october: "10",
  "11": "11",
  nov: "11",
  november: "11",
  "12": "12",
  dec: "12",
  december: "12",
};

export function normalizeSchedulePortSlug(port: string): string {
  const key = port.trim().toLowerCase();
  return schedulePortAliases[key] ?? key.replace(/\s+/g, "");
}

export function normalizeScheduleMonth(month: number | string): string {
  const key = String(month).trim().toLowerCase();
  if (scheduleMonthAliases[key]) return scheduleMonthAliases[key];

  const numeric = Number(key);
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 12) {
    return String(numeric).padStart(2, "0");
  }

  return key.padStart(2, "0");
}

export function buildScheduleMonthPrefix(
  year: number | string,
  month: number | string,
): string {
  return `${String(year).trim()}-${normalizeScheduleMonth(month)}`;
}

/** Authority port guide path used for schedule and ship excursion CTAs */
export function portExcursionPath(portSlug: string): string {
  return `/ports/${normalizeSchedulePortSlug(portSlug)}`;
}

/** Recommended excursion landing pages per port (Norway authority site) */
export const portExcursionLinks: Record<string, string> = Object.fromEntries(
  scheduledPortSlugs.map((slug) => [slug, portExcursionPath(slug)]),
);

export function getPortExcursionLink(portSlug: string): string {
  const normalized = normalizeSchedulePortSlug(portSlug);
  return portExcursionLinks[normalized] ?? "/norway-shore-excursions";
}

export function getPortExcursionLinkLabel(portName: string): string {
  return `Recommended ${portName} Shore Excursions`;
}

export function formatScheduleDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatScheduleTime(time: string | null | undefined): string {
  if (!time) return "TBC";
  return time;
}
