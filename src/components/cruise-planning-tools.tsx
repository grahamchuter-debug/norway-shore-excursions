import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import {
  shipScheduleHubPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";

type CruisePlanningToolsProps = {
  shipName?: string;
  className?: string;
};

export function CruisePlanningTools({
  shipName,
  className = "",
}: CruisePlanningToolsProps) {
  const shipLabel = shipName ? ` for ${shipName}` : "";

  return (
    <ul
      className={`card-grid mt-4 grid gap-3 sm:grid-cols-2 ${className}`.trim()}
    >
      <li>
        <Link
          href={siteConfig.plannerPath}
          className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
        >
          Norway Cruise Planner™
          <span className="mt-1 block text-sm font-normal text-slate-600">
            Personalised port recommendations matched to your itinerary
          </span>
        </Link>
      </li>
      <li>
        <Link
          href={shipScheduleHubPath}
          className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
        >
          Ship Schedules Hub
          <span className="mt-1 block text-sm font-normal text-slate-600">
            Browse 2026 Norway port schedules by month
          </span>
        </Link>
      </li>
      <li>
        <Link
          href={shipScheduleSearchPath}
          className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
        >
          Search by Ship
          <span className="mt-1 block text-sm font-normal text-slate-600">
            Find Norway port calls{shipLabel}
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/norway-cruise-ports"
          className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
        >
          Norway Cruise Ports
          <span className="mt-1 block text-sm font-normal text-slate-600">
            Port guides, maps and excursion themes
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/return-to-ship-guide#will-this-excursion-fit"
          className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
        >
          Will This Excursion Fit?
          <span className="mt-1 block text-sm font-normal text-slate-600">
            Test tour duration against your port window and all aboard time
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/return-to-ship-confidence"
          className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
        >
          Return to Ship Confidence
          <span className="mt-1 block text-sm font-normal text-slate-600">
            How we score timing fit and safety buffers
          </span>
        </Link>
      </li>
    </ul>
  );
}
