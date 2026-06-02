import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import type { CruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { shipScheduleSearchPathForLine } from "@/lib/cruise-line-schedules";
import {
  shipScheduleHubPath,
} from "@/lib/cruise-schedule-config";

type PlanResource = {
  title: string;
  description: string;
  href: string;
  emphasis?: boolean;
};

type CruiseLinePlanDashboardProps = {
  cruiseLineShortName: string;
  scheduleKey: CruiseLineScheduleKey;
  className?: string;
};

export function CruiseLinePlanDashboard({
  cruiseLineShortName,
  scheduleKey,
  className = "",
}: CruiseLinePlanDashboardProps) {
  const resources: PlanResource[] = [
    {
      title: "Ship schedules",
      description: `Filter 2026 Norway port calls for ${cruiseLineShortName} ships.`,
      href: shipScheduleSearchPathForLine(scheduleKey),
      emphasis: true,
    },
    {
      title: "Norway Cruise Planner",
      description: "Port matched excursion ideas for your sailing dates.",
      href: siteConfig.plannerPath,
      emphasis: true,
    },
    {
      title: "Cruise lines hub",
      description: "Compare operators and open every Norway line guide.",
      href: "/cruise-lines",
    },
    {
      title: "Shore excursions",
      description: "Theme hubs for scenic, fjord, family and private touring.",
      href: "/norway-shore-excursions",
    },
    {
      title: "Port guides",
      description: "Maps, timing tips and excursion links for every Norway call.",
      href: "/norway-cruise-ports",
    },
    {
      title: "Schedule hub",
      description: "Browse Norway timetables by port and month.",
      href: shipScheduleHubPath,
    },
  ];

  return (
    <section className={className}>
      <h2>Plan your Norway cruise</h2>
      <p>
        Jump to schedules, the planner and port tools wired for {cruiseLineShortName}{" "}
        passengers.
      </p>
      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`premium-card flex h-full flex-col p-5 transition hover:border-[var(--glacier-blue)] ${
                item.emphasis ? "border-[var(--glacier-blue)]/40 bg-sky-50/30" : ""
              }`}
            >
              <span className="text-base font-bold text-slate-900">
                {item.title}
              </span>
              <span className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {item.description}
              </span>
              <span className="mt-4 text-sm font-semibold text-[var(--glacier-blue)]">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
