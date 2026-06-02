import Link from "next/link";

import {
  compareNorwayCruiseLineSlugs,
  cruiseLineBySlug,
} from "@/lib/cruise-lines-data";

type CompareNorwayCruiseLinesProps = {
  currentSlug?: string;
  className?: string;
};

export function CompareNorwayCruiseLines({
  currentSlug,
  className = "",
}: CompareNorwayCruiseLinesProps) {
  return (
    <section className={className}>
      <h2>Compare Norway Cruise Lines</h2>
      <p>
        Each operator brings a different pace, ship size and passenger profile to
        Norwegian fjords. Open another line guide to compare schedules, ports and
        excursion styles.
      </p>
      <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {compareNorwayCruiseLineSlugs.map((slug) => {
          const line = cruiseLineBySlug[slug];
          if (!line) return null;
          const isCurrent = line.slug === currentSlug;
          return (
            <li key={line.slug}>
              {isCurrent ? (
                <span
                  className="premium-card block border-[var(--gold)] bg-slate-50 p-4"
                  aria-current="page"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
                    Current guide
                  </span>
                  <span className="mt-1 block font-semibold text-slate-900">
                    {line.headline}
                  </span>
                </span>
              ) : (
                <Link
                  href={`/cruise-lines/${line.slug}`}
                  className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
                >
                  {line.headline}
                  <span className="mt-1 block text-sm font-normal text-slate-600">
                    {line.shortName} Norway planning guide
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
