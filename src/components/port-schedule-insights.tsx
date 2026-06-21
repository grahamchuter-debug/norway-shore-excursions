import Link from "next/link";

import type { PortScheduleInsights } from "@/lib/schedule-insights";

type PortScheduleInsightsProps = {
  insights: PortScheduleInsights;
};

export function PortScheduleInsightsSection({ insights }: PortScheduleInsightsProps) {
  const peakMonth = [...insights.busiestMonths].sort(
    (a, b) => b.shipCalls - a.shipCalls,
  )[0];

  return (
    <section>
      <h2>{insights.portDisplayName} cruise schedule at a glance</h2>
      <p>
        Our verified Norway database lists{" "}
        <strong>{insights.totalCalls.toLocaleString("en-GB")}</strong> scheduled
        port calls at {insights.portDisplayName}
        {insights.yearsAvailable.length > 0
          ? ` across ${insights.yearsAvailable.join(" and ")}`
          : ""}
        . Use these patterns to pick quieter months or plan around busy summer
        weeks before booking shore excursions.
      </p>

      <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Annual visit total
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {insights.totalCalls}
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
              {peakMonth.shipCalls} ship calls
            </p>
          </li>
        ) : null}
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Cruise lines tracked
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {insights.topCruiseLines.length}+
          </p>
        </li>
        <li className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ships tracked
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {insights.topShips.length}+
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

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3>Most frequent cruise lines</h3>
          <ul className="card-grid mt-3 grid gap-2">
            {insights.topCruiseLines.map((line) => (
              <li key={line.label} className="premium-card flex items-center justify-between gap-3 p-3">
                {line.href ? (
                  <Link href={line.href} className="content-link font-medium">
                    {line.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-900">{line.label}</span>
                )}
                <span className="text-sm text-slate-600">
                  {line.count} {line.count === 1 ? "call" : "calls"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Most frequent ships</h3>
          <ul className="card-grid mt-3 grid gap-2">
            {insights.topShips.map((ship) => (
              <li key={ship.slug ?? ship.label} className="premium-card flex items-center justify-between gap-3 p-3">
                <Link href={ship.href ?? "/ships"} className="content-link font-medium">
                  {ship.label}
                </Link>
                <span className="text-sm text-slate-600">
                  {ship.count} {ship.count === 1 ? "call" : "calls"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        <Link href="/norway-cruise-calendar" className="content-link font-medium">
          Browse the Norway cruise calendar
        </Link>{" "}
        for national busiest days and cruise line trends.
      </p>
    </section>
  );
}
