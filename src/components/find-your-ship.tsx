"use client";

import { useMemo, useState } from "react";

import { FindYourShipCard } from "@/components/find-your-ship-card";
import {
  filterFindYourShipEntries,
  findYourShipPopularQueries,
  type FindYourShipEntry,
} from "@/lib/find-your-ship";
import { normalizeShipSearchKey } from "@/lib/cruiseSchedules";

const EMPTY_STATE_MESSAGE =
  "No matching ship in our Find Your Ship list yet. Try the full ship name, cruise line or MSC prefix.";

type FindYourShipProps = {
  ships: readonly FindYourShipEntry[];
  className?: string;
};

export function FindYourShip({ ships, className = "" }: FindYourShipProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => filterFindYourShipEntries(ships, query),
    [ships, query],
  );

  const hasQuery = normalizeShipSearchKey(query).length > 0;
  const showResults = hasQuery;

  return (
    <section
      id="find-your-ship"
      className={`rounded-2xl border border-[var(--glacier-blue)]/25 bg-gradient-to-b from-sky-50/80 to-white p-6 shadow-sm sm:p-8 ${className}`}
    >
      <h2 className="text-2xl font-bold text-[var(--navy-deep)] sm:text-3xl">
        Find Your Ship
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
        Search for your cruise ship and discover typical Norway itineraries, ports visited,
        shore excursion ideas and ship schedules.
      </p>

      <label
        htmlFor="find-your-ship-search"
        className="mt-6 block text-sm font-semibold text-[var(--navy-deep)]"
      >
        Ship name or cruise line
      </label>
      <input
        id="find-your-ship-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g. Iona, Queen Anne, MSC Euribia, Princess"
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[var(--glacier-blue)] focus:ring-2 focus:ring-[var(--glacier-blue)]/20"
        autoComplete="off"
        spellCheck={false}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="w-full text-xs font-semibold uppercase tracking-wide text-slate-500">
          Popular searches
        </span>
        {findYourShipPopularQueries.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setQuery(label)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[var(--glacier-blue)] hover:text-[var(--glacier-blue)]"
          >
            {label}
          </button>
        ))}
      </div>

      {showResults ? (
        <div className="mt-8">
          {results.length > 0 ? (
            <ul className="card-grid grid gap-4 sm:grid-cols-2">
              {results.map((ship, index) => (
                <li key={ship.slug}>
                  <FindYourShipCard ship={ship} priority={index === 0} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
              {EMPTY_STATE_MESSAGE}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-600">
          Start typing to see matching ships from P&O, Cunard, MSC, Princess and Celebrity in
          our Norway database.
        </p>
      )}
    </section>
  );
}
