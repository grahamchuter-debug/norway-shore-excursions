"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import { shipCardBadgeInputFromSummary } from "@/lib/ship-card-badges";
import {
  formatScheduleTime,
  shipScheduleHubPath,
} from "@/lib/cruise-schedule-config";
import {
  isCruiseLineScheduleKey,
  scheduleLineNames,
  type CruiseLineScheduleKey,
} from "@/lib/cruise-line-schedules";
import {
  groupShipScheduleSearchEntries,
  normalizeShipSearchKey,
  type ShipScheduleSearchEntry,
} from "@/lib/cruiseSchedules";
import {
  buildShipSearchResultSummaries,
  getShipScheduleSummaryByName,
  shipNameToSlug,
} from "@/lib/ship-schedules";
import { siteConfig } from "@/lib/site-config";

const POPULAR_SHIP_SEARCHES = [
  "Iona",
  "Arvia",
  "MSC Euribia",
  "Celebrity Apex",
  "Viking Vela",
  "Rotterdam",
] as const;

const EMPTY_STATE_MESSAGE =
  "No matching ship found yet. Try another spelling or check back soon as more Norway schedules are added.";

type ShipScheduleSearchProps = {
  entries: readonly ShipScheduleSearchEntry[];
};

function formatPassengers(value: number | null): string {
  return value ? value.toLocaleString("en-GB") : "Not published";
}

function entryMatchesLine(
  entry: ShipScheduleSearchEntry,
  line: CruiseLineScheduleKey,
): boolean {
  return scheduleLineNames[line].includes(entry.cruiseLine);
}

function lineDisplayName(line: CruiseLineScheduleKey): string {
  return scheduleLineNames[line][0] ?? line;
}

export function ShipScheduleSearch({ entries }: ShipScheduleSearchProps) {
  const searchParams = useSearchParams();
  const lineParam = searchParams.get("line") ?? undefined;
  const initialQuery = searchParams.get("q")?.trim() ?? "";
  const activeLine = lineParam && isCruiseLineScheduleKey(lineParam) ? lineParam : undefined;
  const [query, setQuery] = useState(initialQuery);

  const scopedEntries = useMemo(() => {
    if (!activeLine) return entries;
    return entries.filter((entry) => entryMatchesLine(entry, activeLine));
  }, [entries, activeLine]);

  const results = useMemo(() => {
    const queryKey = normalizeShipSearchKey(query);
    if (!queryKey) {
      if (activeLine) {
        return groupShipScheduleSearchEntries(scopedEntries);
      }
      return [];
    }

    const matches = scopedEntries.filter((entry) =>
      entry.shipSearchKey.includes(queryKey),
    );
    return groupShipScheduleSearchEntries(matches);
  }, [scopedEntries, query, activeLine]);

  const hasQuery = normalizeShipSearchKey(query).length > 0;
  const showResults = hasQuery || Boolean(activeLine);

  return (
    <div className="space-y-8">
      {activeLine ? (
        <section className="rounded-2xl border border-[var(--glacier-blue)]/30 bg-sky-50/60 p-5">
          <p className="text-sm font-semibold text-[var(--navy-deep)]">
            Showing {lineDisplayName(activeLine)} ships in our 2026 Norway schedule
            database.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Search within this line or{" "}
            <Link href="/ship-schedules/search" className="content-link font-medium">
              clear the cruise line filter
            </Link>
            .
          </p>
        </section>
      ) : null}

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

      {showResults ? (
        results.length > 0 ? (
          <section className="space-y-6">
            <p className="text-sm text-slate-600">
              {results.reduce((count, group) => count + group.entries.length, 0)} published port call
              {results.reduce((count, group) => count + group.entries.length, 0) === 1 ? "" : "s"} for{" "}
              {results.length} ship{results.length === 1 ? "" : "s"}.
            </p>

            <div className="space-y-5">
              {results.map((group) => {
                const summary = buildShipSearchResultSummaries(group.entries[0]?.shipSearchKey ?? "");
                const scheduleSummary = getShipScheduleSummaryByName(group.ship);
                const badgeInput = scheduleSummary
                  ? shipCardBadgeInputFromSummary(scheduleSummary)
                  : summary
                    ? {
                        shipSlug: shipNameToSlug(group.ship),
                        callCount: summary.callCount,
                        capacity: summary.capacity,
                        cruiseLine: summary.cruiseLine,
                        topPortDisplayName:
                          summary.topPorts[0]?.portDisplayName ?? null,
                      }
                    : {
                        shipSlug: shipNameToSlug(group.ship),
                        cruiseLine: group.cruiseLine,
                      };
                const topPortsLabel = summary?.topPorts
                  .map((p) => `${p.portDisplayName} (${p.callCount})`)
                  .join(", ");

                return (
                  <article
                    key={group.ship}
                    className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm"
                  >
                    <ShipImage
                      slug={shipNameToSlug(group.ship)}
                      shipName={group.ship}
                      cruiseLine={group.cruiseLine}
                      className="aspect-[21/9] rounded-none border-0 border-b border-[var(--border-light)]"
                      capacityLabel={scheduleSummary?.capacityLabel}
                      callCount={scheduleSummary?.callCount}
                      badgeInput={badgeInput}
                    />
                    <div className="p-5 sm:p-6">
                    <header className="border-b border-[var(--border-light)] pb-4">
                      <ShipCardBadges input={badgeInput} className="mb-3" />
                      <h2 className="text-xl font-bold text-[var(--navy-deep)]">{group.ship}</h2>
                      <p className="mt-1 text-sm text-slate-600">{group.cruiseLine}</p>
                      {summary ? (
                        <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                          <div>
                            <dt className="font-medium text-slate-500">Capacity</dt>
                            <dd>{summary.capacityLabel}</dd>
                          </div>
                          <div>
                            <dt className="font-medium text-slate-500">Norway calls</dt>
                            <dd>{summary.callCount}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="font-medium text-slate-500">Top ports</dt>
                            <dd>{topPortsLabel || "See calls below"}</dd>
                          </div>
                        </dl>
                      ) : null}
                      {summary ? (
                        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold">
                          {summary.shipPageHref ? (
                            <>
                              <Link href={summary.shipPageHref} className="content-link">
                                Ship page
                              </Link>
                              <span aria-hidden="true" className="text-slate-300">
                                |
                              </span>
                            </>
                          ) : null}
                          <Link href={summary.plannerHref} className="content-link">
                            Cruise planner
                          </Link>
                          <span aria-hidden="true" className="text-slate-300">
                            |
                          </span>
                          <Link href={summary.scheduleSearchHref} className="content-link">
                            Schedule results
                          </Link>
                          <span aria-hidden="true" className="text-slate-300">
                            |
                          </span>
                          <Link href={summary.excursionsHref} className="content-link">
                            Recommended excursions
                          </Link>
                        </p>
                      ) : null}
                    </header>

                    <ul className="card-grid mt-4 space-y-4">
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
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-surface-muted p-6 text-sm leading-7 text-slate-600">
            {activeLine
              ? `No matching ${lineDisplayName(activeLine)} ship found for that search. Try another ship name.`
              : EMPTY_STATE_MESSAGE}
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
        {" · "}
        <Link href="/ships" className="content-link text-sm font-semibold">
          Browse cruise ship guides
        </Link>
      </section>
    </div>
  );
}
