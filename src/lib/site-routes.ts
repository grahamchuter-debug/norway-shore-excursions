import { cruiseLineSlugs } from "@/lib/cruise-lines-data";
import { getAllShipSlugs } from "@/lib/ship-schedules";
import {
  scheduledPortSlugs,
  allScheduleMonthSlugs,
  shipScheduleHubPath,
  shipScheduleMonthPath,
  shipSchedulePortPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { portSlugs } from "@/lib/ports-data";
import { themeSlugs } from "@/lib/themes-data";

type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

const level1Routes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/norway-cruise-ports", priority: 0.95, changeFrequency: "weekly" },
  { path: "/norway-shore-excursions", priority: 0.95, changeFrequency: "weekly" },
  { path: "/norway-cruise-planner", priority: 0.95, changeFrequency: "weekly" },
  { path: "/best-norway-shore-excursions", priority: 0.9, changeFrequency: "weekly" },
  { path: "/when-to-cruise-norway", priority: 0.85, changeFrequency: "monthly" },
  { path: "/norway-cruise-port-map", priority: 0.85, changeFrequency: "monthly" },
  { path: "/cruise-lines", priority: 0.9, changeFrequency: "weekly" },
  { path: "/ships", priority: 0.88, changeFrequency: "weekly" },
  { path: "/return-to-ship-confidence", priority: 0.82, changeFrequency: "monthly" },
  { path: "/private-shore-excursions-norway", priority: 0.85, changeFrequency: "monthly" },
  { path: "/small-group-shore-excursions-norway", priority: 0.85, changeFrequency: "monthly" },
  { path: "/return-to-ship-guide", priority: 0.85, changeFrequency: "monthly" },
  { path: shipScheduleHubPath, priority: 0.9, changeFrequency: "weekly" },
  { path: shipScheduleSearchPath, priority: 0.88, changeFrequency: "weekly" },
  { path: "/norway-cruise-calendar", priority: 0.88, changeFrequency: "weekly" },
];

const portRoutes: RouteEntry[] = portSlugs.map((slug) => ({
  path: `/ports/${slug}`,
  priority: 0.88,
  changeFrequency: "weekly" as const,
}));

const themeRoutes: RouteEntry[] = themeSlugs.map((slug) => ({
  path: `/${slug}`,
  priority: 0.82,
  changeFrequency: "monthly" as const,
}));

const cruiseLineRoutes: RouteEntry[] = cruiseLineSlugs.map((slug) => ({
  path: `/cruise-lines/${slug}`,
  priority: 0.8,
  changeFrequency: "monthly" as const,
}));

const shipRoutes: RouteEntry[] = getAllShipSlugs().map((slug) => ({
  path: `/ships/${slug}`,
  priority: 0.84,
  changeFrequency: "weekly" as const,
}));

const shipSchedulePortRoutes: RouteEntry[] = scheduledPortSlugs.map((portSlug) => ({
  path: shipSchedulePortPath(portSlug),
  priority: 0.86,
  changeFrequency: "weekly" as const,
}));

const shipScheduleMonthRoutes: RouteEntry[] = scheduledPortSlugs.flatMap((portSlug) =>
  allScheduleMonthSlugs.map((monthSlug) => ({
    path: shipScheduleMonthPath(portSlug, monthSlug),
    priority: 0.84,
    changeFrequency: "weekly" as const,
  })),
);

export const siteRoutes = [
  ...level1Routes,
  ...portRoutes,
  ...themeRoutes,
  ...cruiseLineRoutes,
  ...shipRoutes,
  ...shipSchedulePortRoutes,
  ...shipScheduleMonthRoutes,
] as const;

export const allPagePaths = siteRoutes.map((r) => r.path);
