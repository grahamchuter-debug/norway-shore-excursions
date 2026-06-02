import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { shipScheduleHubPath } from "@/lib/cruise-schedule-config";

const hubResources = [
  {
    title: "Norway Cruise Planner",
    description: "Enter your ports for matched excursion recommendations.",
    href: siteConfig.plannerPath,
  },
  {
    title: "Ship schedules",
    description: "Search 2026 Norway calls by ship, line or port.",
    href: shipScheduleHubPath,
  },
  {
    title: "Shore excursions",
    description: "Scenic, fjord, family and private touring theme hubs.",
    href: "/norway-shore-excursions",
  },
  {
    title: "Port guides",
    description: "Every western Norway cruise port with maps and timing tips.",
    href: "/norway-cruise-ports",
  },
] as const;

type CruiseLineHubPlanDashboardProps = {
  className?: string;
};

export function CruiseLineHubPlanDashboard({
  className = "",
}: CruiseLineHubPlanDashboardProps) {
  return (
    <section className={className}>
      <h2>Plan your Norway cruise</h2>
      <p>Core tools to move from cruise line choice to port day planning.</p>
      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2">
        {hubResources.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="premium-card block p-5 transition hover:border-[var(--glacier-blue)]"
            >
              <span className="font-bold text-slate-900">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
