/**
 * Norway cruise schedule site config.
 * Clone this file per destination (Caribbean, Alaska, Canada, Mediterranean)
 * and point the CSV import REGION + port slugs at the new market.
 */

export const cruiseScheduleDisclaimer =
  "Cruise schedules can change due to weather, port operations and cruise line itinerary updates. Always confirm your ship's latest arrival and all aboard time with your cruise line.";

/** Ports in master hub display order. */
export const scheduledPortSlugs = [
  "flam",
  "bergen",
  "stavanger",
  "eidfjord",
  "olden",
  "geiranger",
  "nordfjordeid",
] as const;

export type ScheduledPortSlug = (typeof scheduledPortSlugs)[number];

export const scheduleYears = ["2026"] as const;

export const scheduleYear = scheduleYears[0];

export const scheduleMonths2026 = ["06", "07", "08", "09"] as const;

/** URL slugs for monthly schedule pages, e.g. june-2026 */
export const scheduleMonthSlugs2026 = [
  "june-2026",
  "july-2026",
  "august-2026",
  "september-2026",
] as const;

export type ScheduleMonthSlug2026 = (typeof scheduleMonthSlugs2026)[number];

/** Master Norway schedule hub (reusable by port sites via shared data helpers). */
export const shipScheduleHubPath = "/ship-schedules";

const numericMonthToSlug: Record<string, ScheduleMonthSlug2026> = {
  "06": "june-2026",
  "07": "july-2026",
  "08": "august-2026",
  "09": "september-2026",
};

const slugToNumericMonth: Record<ScheduleMonthSlug2026, (typeof scheduleMonths2026)[number]> =
  {
    "june-2026": "06",
    "july-2026": "07",
    "august-2026": "08",
    "september-2026": "09",
  };

export function buildScheduleMonthSlug(
  month: number | string,
  year: number | string = scheduleYear,
): ScheduleMonthSlug2026 {
  const numeric = normalizeScheduleMonth(month);
  const slug = numericMonthToSlug[numeric];
  if (!slug) {
    throw new Error(`Unsupported schedule month slug for ${month}`);
  }
  if (String(year) !== scheduleYear) {
    throw new Error(`Unsupported schedule year ${year}`);
  }
  return slug;
}

export function parseScheduleMonthSlug(
  monthSlug: string,
): { month: (typeof scheduleMonths2026)[number]; year: string } | null {
  const key = monthSlug.trim().toLowerCase() as ScheduleMonthSlug2026;
  const month = slugToNumericMonth[key];
  if (!month) return null;
  return { month, year: scheduleYear };
}

export function shipSchedulePortPath(portSlug: string): string {
  return `${shipScheduleHubPath}/${normalizeSchedulePortSlug(portSlug)}`;
}

export function shipScheduleMonthPath(
  portSlug: string,
  monthSlug: ScheduleMonthSlug2026 | string,
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

/** Recommended excursion landing pages per port (Norway authority site) */
export const portExcursionLinks: Record<string, string> = {
  flam: "https://norwayshoreexcursions.com/stegastein-viewpoint-shore-excursion",
  bergen: "https://norwayshoreexcursions.com/bergen-shore-excursions",
  olden: "https://norwayshoreexcursions.com/excursions",
  nordfjordeid: "https://norwayshoreexcursions.com/excursions",
  eidfjord: "https://norwayshoreexcursions.com/excursions",
  geiranger: "https://norwayshoreexcursions.com/excursions",
  stavanger: "https://norwayshoreexcursions.com/excursions",
};

export function getPortExcursionLink(portSlug: string): string {
  return (
    portExcursionLinks[portSlug] ??
    "https://norwayshoreexcursions.com/excursions"
  );
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
