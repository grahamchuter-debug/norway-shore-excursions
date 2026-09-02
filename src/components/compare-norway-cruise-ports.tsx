import Link from "next/link";

import {
  featuredComparisonSlugs,
  portComparisonRows,
  type PortComparisonRow,
} from "@/lib/port-comparison";

type CompareNorwayCruisePortsProps = {
  showAll?: boolean;
  compact?: boolean;
};

function ComparisonTable({ rows }: { rows: readonly PortComparisonRow[] }) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-light)] bg-surface-muted">
            <th className="px-4 py-3 font-semibold text-slate-900">Port</th>
            <th className="px-4 py-3 font-semibold text-slate-900">Best for</th>
            <th className="px-4 py-3 font-semibold text-slate-900">
              Top excursion
            </th>
            <th className="px-4 py-3 font-semibold text-slate-900">
              Time needed
            </th>
            <th className="px-4 py-3 font-semibold text-slate-900">
              Activity level
            </th>
            <th className="px-4 py-3 font-semibold text-slate-900">Local site</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.slug}
              className="border-b border-[var(--border-light)] bg-white"
            >
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link
                  href={`/ports/${row.slug}`}
                  className="text-[var(--glacier-blue)] underline"
                >
                  {row.port}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-700">{row.bestFor}</td>
              <td className="px-4 py-3 text-slate-700">{row.topExcursion}</td>
              <td className="px-4 py-3 text-slate-700">{row.timeNeeded}</td>
              <td className="px-4 py-3 text-slate-700">{row.activityLevel}</td>
              <td className="px-4 py-3">
                <a
                  href={row.localSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[var(--glacier-blue)] underline"
                >
                  Local guide
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCards({ rows }: { rows: readonly PortComparisonRow[] }) {
  return (
    <div className="grid gap-4 lg:hidden">
      {rows.map((row) => (
        <article key={row.slug} className="premium-card p-5">
          <h3 className="text-lg font-bold text-slate-900">
            <Link href={`/ports/${row.slug}`} className="content-link">
              {row.port}
            </Link>
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-slate-500">Best for</dt>
              <dd className="text-slate-800">{row.bestFor}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Top excursion</dt>
              <dd className="text-slate-800">{row.topExcursion}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="font-medium text-slate-500">Time needed</dt>
                <dd className="text-slate-800">{row.timeNeeded}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Activity level</dt>
                <dd className="text-slate-800">{row.activityLevel}</dd>
              </div>
            </div>
          </dl>
          <a
            href={row.localSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-on-light mt-4 inline-flex min-h-11 items-center text-xs"
          >
            Visit local guide
          </a>
        </article>
      ))}
    </div>
  );
}

export function CompareNorwayCruisePorts({
  showAll = false,
  compact = false,
}: CompareNorwayCruisePortsProps) {
  const rows = showAll
    ? portComparisonRows
    : featuredComparisonSlugs
        .map((slug) => portComparisonRows.find((r) => r.slug === slug))
        .filter(Boolean) as PortComparisonRow[];

  return (
    <section
      className={compact ? "py-12" : "border-y bg-surface-muted py-16"}
      id="compare-norway-cruise-ports"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          Side-by-side planning
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Compare Norway Cruise Ports
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Compare Norway cruise ports by best for focus, headline excursions,
          time needed and activity level, then jump to authority guides or local
          booking sites.
        </p>

        <div className="mt-8">
          <ComparisonTable rows={rows} />
          <ComparisonCards rows={rows} />
        </div>

        {!showAll ? (
          <p className="mt-8">
            <Link href="/norway-cruise-ports#compare-norway-cruise-ports" className="btn-primary-on-light">
              Compare all {portComparisonRows.length} ports
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
