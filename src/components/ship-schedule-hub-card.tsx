import Link from "next/link";

import {
  shipScheduleMonthPath,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import type { ScheduleHubPortSummary } from "@/lib/cruiseSchedules";
import { portBySlug } from "@/lib/ports-data";

type ShipScheduleHubCardProps = {
  summary: ScheduleHubPortSummary;
};

export function ShipScheduleHubCard({ summary }: ShipScheduleHubCardProps) {
  const port = portBySlug[summary.portSlug];
  const available = summary.scheduleStatus === "Available";

  return (
    <article className="premium-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-[var(--navy-deep)]">
          <Link href={shipSchedulePortPath(summary.portSlug)} className="content-link">
            {port?.displayName ?? summary.portSlug}
          </Link>
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            available
              ? "bg-emerald-100 text-emerald-900"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {summary.scheduleStatus}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-800">Schedule Status</dt>
          <dd className="text-slate-600">{summary.scheduleStatus}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Months Available</dt>
          <dd className="mt-1">
            <ul className="space-y-1">
              {summary.months.map((month) => (
                <li key={month.slug} className="flex flex-wrap items-baseline gap-x-2">
                  <Link
                    href={shipScheduleMonthPath(summary.portSlug, month.slug)}
                    className="content-link font-medium"
                  >
                    {month.label}
                  </Link>
                  {month.shipCallCount !== null ? (
                    <span className="text-slate-500">
                      · {month.shipCallCount} ship call
                      {month.shipCallCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        {summary.totalShipCalls !== null ? (
          <div>
            <dt className="font-semibold text-slate-800">Total ship calls</dt>
            <dd className="text-slate-600">
              {summary.totalShipCalls} published calls in {summary.months.length} months
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
