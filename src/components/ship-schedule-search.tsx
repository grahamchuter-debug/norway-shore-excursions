"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  formatScheduleTime,
  shipScheduleHubPath,
} from "@/lib/cruise-schedule-config";
import {
  groupShipScheduleSearchEntries,
  normalizeShipSearchKey,
  type ShipScheduleSearchEntry,
} from "@/lib/cruiseSchedules";
import { siteConfig } from "@/lib/site-config";

const POPULAR_SHIP_SEARCHES = [
  "Iona",
  "Arvia",
  "MSC Euribia",
  "Celebrity Apex",
  "AIDAprima",
  "Norwegian Prima",
] as const;

const EMPTY_STATE_MESSAGE =
  "No matching ship found yet. Try another spelling or check back soon as more Norway schedules are added.";

type ShipScheduleSearchProps = {
  entries: readonly ShipScheduleSearchEntry[];
};

function formatPassengers(value: number | null): string {
  return value ? value.toLocaleString("en-GB") : "Not published";
}

export function ShipScheduleSearch({ entries }: ShipScheduleSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const queryKey = normalizeShipSearchKey(query);
    if (!queryKey) return [];

    const matches = entries.filter((entry) => entry.shipSearchKey.includes(queryKey));
    return groupShipScheduleSearchEntries(matches);
  }, [entries, query]);

  const hasQuery = normalizeShipSearchKey(query).length > 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-sm sm:p-8">
        <label htmlFor="ship-schedule-search" className="block text-sm font-semibold text-[var(--navy-deep)]">
          Search by ship name
        </label>
        <input
          id="ship-schedule-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ship name, e.g. Iona, MSC Euribia, Celebrity Apex"
          className="mt-3 w-full rounded-xl border border-slate-200 bg-surface-muted px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[var(--glacier-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--glacier-blue)]/20"
          autoComplete="off"
          spellCheck={false}
        />

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Popular quick searches
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_SHIP_SEARCHES.map((ship) => (
              <button
                key={ship}
                type="button"
                onClick={() => setQuery(ship)}
                className="min-h-10 rounded-full border border-slate-200 bg-surface-muted px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--glacier-blue)] hover:text-[var(--glacier-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glacier-blue)]"
              >
                {ship}
              </button>
            ))}
          </div>
        </div>
      </section>

      {hasQuery ? (
        results.length > 0 ? (
          <section className="space-y-6">
            <p className="text-sm text-slate-600">
              {results.reduce((count, group) => count + group.entries.length, 0)} published port call
              {results.reduce((count, group) => count + group.entries.length, 0) === 1 ? "" : "s"} for{" "}
              {results.length} ship{results.length === 1 ? "" : "s"}.
            </p>

            <div className="space-y-5">
              {results.map((group) => (
                <article
                  key={group.ship}
                  className="rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6"
                >
                  <header className="border-b border-[var(--border-light)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--navy-deep)]">{group.ship}</h2>
                    <p className="mt-1 text-sm text-slate-600">{group.cruiseLine}</p>
                  </header>

                  <ul className="mt-4 space-y-4">
                    {group.entries.map((entry) => (
                      <li
                        key={`${entry.portSlug}-${entry.arrivalDate}-${entry.arrivalTime ?? "tbc"}`}
                        className="rounded-xl border border-slate-100 bg-surface-muted p-4"
                      >
                        <p className="text-base font-semibold text-slate-900">
                          {entry.portDisplayName}, {entry.dateLabel}
                        </p>
                        <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                          <div>
                            <dt className="font-medium text-slate-500">Arrival</dt>
                            <dd>{formatScheduleTime(entry.arrivalTime)}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-slate-500">Departure</dt>
                            <dd>{formatScheduleTime(entry.departureTime)}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-slate-500">Passengers</dt>
                            <dd>{formatPassengers(entry.passengers)}</dd>
                          </div>
                        </dl>
                        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold">
                          <Link href={entry.scheduleHref} className="content-link">
                            View schedule
                          </Link>
                          <span aria-hidden="true" className="text-slate-300">
                            |
                          </span>
                          <Link href={entry.excursionHref} className="content-link">
                            Recommended excursions
                          </Link>
                          <span aria-hidden="true" className="text-slate-300">
                            |
                          </span>
                          <Link href={siteConfig.plannerPath} className="content-link">
                            Cruise planner
                          </Link>
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-surface-muted p-6 text-sm leading-7 text-slate-600">
            {EMPTY_STATE_MESSAGE}
          </section>
        )
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-surface-muted p-6 text-sm leading-7 text-slate-600">
          {EMPTY_STATE_MESSAGE}
        </section>
      )}

      <section>
        <Link href={shipScheduleHubPath} className="content-link text-sm font-semibold">
          Back to Norway ship schedules
        </Link>
      </section>
    </div>
  );
}
