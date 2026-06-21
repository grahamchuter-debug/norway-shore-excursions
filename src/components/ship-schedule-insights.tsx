import Link from "next/link";

import type { ShipScheduleInsights } from "@/lib/schedule-insights";

type ShipScheduleInsightsSectionProps = {
  insights: ShipScheduleInsights;
  shipName: string;
};

export function ShipScheduleInsightsSection({
  insights,
  shipName,
}: ShipScheduleInsightsSectionProps) {
  const peakMonth = insights.peakMonths[0];

  return (
    <section>
      <h2>{shipName} schedule insights</h2>
      <p>
        Patterns from our verified Norway database for {shipName}
        {insights.yearsAvailable.length > 0
          ? ` across ${insights.yearsAvailable.join(" and ")}`
          : ""}
        . Use these figures to pick quieter months or plan around peak summer
        weeks before booking shore excursions.
      </p>

      <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Norway calls
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {insights.totalCalls}
          </p>
        </li>
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ports visited
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {insights.portCount}
          </p>
        </li>
        {peakMonth ? (
          <li className="premium-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Busiest month
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {peakMonth.monthLabel}
            </p>
            <p className="text-sm text-slate-600">
              {peakMonth.shipCalls} port calls
            </p>
          </li>
        ) : null}
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Years tracked
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {insights.yearsAvailable.join(", ") || "2026–2027"}
          </p>
        </li>
      </ul>

      {Object.keys(insights.callsByYear).length > 0 ? (
        <div className="mt-6">
          <h3>Visits by year</h3>
          <ul className="card-grid mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(insights.callsByYear)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([year, count]) => (
                <li key={year} className="premium-card p-3 text-sm">
                  <span className="font-semibold text-slate-900">{year}</span>
                  <span className="ml-2 text-slate-600">
                    {count} {count === 1 ? "call" : "calls"}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {insights.busiestMonths.length > 0 ? (
        <div className="mt-8">
          <h3>Calls by month</h3>
          <ul className="mt-3 space-y-2">
            {insights.busiestMonths.map((month) => {
              const max = Math.max(
                ...insights.busiestMonths.map((m) => m.shipCalls),
                1,
              );
              const width = Math.round((month.shipCalls / max) * 100);
              return (
                <li key={month.monthKey} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 font-medium text-slate-700">
                    {month.monthLabel}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[var(--glacier-blue)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-slate-600">
                    {month.shipCalls}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-slate-600">
        <Link href="/norway-cruise-calendar" className="content-link font-medium">
          Browse the Norway cruise calendar
        </Link>{" "}
        for national busiest days and cruise line trends.
      </p>
    </section>
  );
}
