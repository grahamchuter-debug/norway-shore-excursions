import type { CruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import {
  getCruiseLineBusiestMonths,
  getCruiseLineCallsByYear,
  getCruiseLineScheduleSummary,
} from "@/lib/cruise-line-schedules";
import { getScheduleYearsAvailable } from "@/lib/schedule-insights";

type CruiseLineScheduleStatsProps = {
  scheduleKey: CruiseLineScheduleKey;
  cruiseLineShortName: string;
  className?: string;
};

export function CruiseLineScheduleStats({
  scheduleKey,
  cruiseLineShortName,
  className = "",
}: CruiseLineScheduleStatsProps) {
  const summary = getCruiseLineScheduleSummary(scheduleKey);
  const callsByYear = getCruiseLineCallsByYear(scheduleKey);
  const years = getScheduleYearsAvailable().filter((year) => callsByYear[year] != null);
  const peakMonths = getCruiseLineBusiestMonths(scheduleKey, undefined, 3);

  if (summary.totalCalls === 0) return null;

  return (
    <section className={className}>
      <h2>{cruiseLineShortName} Norway schedule totals</h2>
      <p>
        Verified port call counts from our imported Norway timetable database across{" "}
        {years.join(" and ") || "available seasons"}.
      </p>

      <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {years.map((year) => (
          <li key={year} className="premium-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {year} visits
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {callsByYear[year]?.toLocaleString("en-GB") ?? 0}
            </p>
          </li>
        ))}
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Annual total
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {summary.totalCalls.toLocaleString("en-GB")}
          </p>
        </li>
        {peakMonths[0] ? (
          <li className="premium-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Busiest month
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {peakMonths[0].monthLabel}
            </p>
            <p className="text-sm text-slate-600">
              {peakMonths[0].shipCalls} port calls
            </p>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
