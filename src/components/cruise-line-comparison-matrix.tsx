import Link from "next/link";
import { Fragment } from "react";

import { CruiseLineLogo } from "@/components/cruise-line-logo";
import { shipScheduleSearchPath } from "@/lib/cruise-schedule-config";
import {
  comparisonFeatureRows,
  getCruiseLineComparisonRows,
  primaryNorwayComparisonSlugs,
  type CruiseLineComparisonRow,
} from "@/lib/cruise-line-comparison";
import { cruiseLinePagePath } from "@/lib/cruise-lines-data";

type CruiseLineComparisonMatrixProps = {
  slugs?: readonly string[];
  currentSlug?: string;
  className?: string;
  compact?: boolean;
};

function LineColumnHeader({
  row,
  isCurrent,
}: {
  row: CruiseLineComparisonRow;
  isCurrent: boolean;
}) {
  const inner = (
    <>
      <CruiseLineLogo cruiseLine={row.name} variant="inline" />
      <span className="mt-2 block text-sm font-bold text-slate-900">
        {row.shortName}
      </span>
      {isCurrent ? (
        <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
          Current guide
        </span>
      ) : null}
    </>
  );

  if (isCurrent) {
    return (
      <div className="premium-card border-[var(--gold)] bg-slate-50 p-4 text-center">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={cruiseLinePagePath(row.slug)}
      className="premium-card block p-4 text-center transition hover:border-[var(--glacier-blue)]"
    >
      {inner}
    </Link>
  );
}

function MatrixGrid({
  rows,
  currentSlug,
}: {
  rows: readonly CruiseLineComparisonRow[];
  currentSlug?: string;
}) {
  return (
    <div
      className="not-prose hidden gap-3 md:grid"
      style={{
        gridTemplateColumns: `minmax(9rem, 0.85fr) repeat(${rows.length}, minmax(0, 1fr))`,
      }}
    >
      <div aria-hidden="true" />
      {rows.map((line) => (
        <LineColumnHeader
          key={line.slug}
          row={line}
          isCurrent={line.slug === currentSlug}
        />
      ))}

      {comparisonFeatureRows.map((feature) => (
        <Fragment key={feature.key}>
          <div className="flex items-center rounded-xl border border-[var(--border-light)] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
            {feature.label}
          </div>
          {rows.map((line) => {
            const isCurrent = line.slug === currentSlug;
            return (
              <div
                key={`${line.slug}-${feature.key}`}
                className={`rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-slate-800 ${
                  isCurrent
                    ? "border-[var(--gold)] bg-amber-50/40"
                    : "border-[var(--border-light)]"
                }`}
              >
                {line[feature.key]}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

function MatrixCards({
  rows,
  currentSlug,
}: {
  rows: readonly CruiseLineComparisonRow[];
  currentSlug?: string;
}) {
  return (
    <div className="grid gap-4 md:hidden">
      {rows.map((line) => {
        const isCurrent = line.slug === currentSlug;
        const card = (
          <article
            className={`premium-card p-5 ${
              isCurrent ? "border-[var(--gold)] bg-slate-50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <CruiseLineLogo cruiseLine={line.name} variant="inline" />
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {line.shortName}
                </h3>
              </div>
              {isCurrent ? (
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Current
                </span>
              ) : null}
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {comparisonFeatureRows.map((feature) => (
                <div key={feature.key}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
                    {feature.label}
                  </dt>
                  <dd className="mt-1 leading-6 text-slate-800">
                    {line[feature.key]}
                  </dd>
                </div>
              ))}
            </dl>
            {!isCurrent ? (
              <p className="mt-4 text-sm font-semibold text-[var(--glacier-blue)]">
                Open {line.shortName} guide →
              </p>
            ) : null}
          </article>
        );

        if (isCurrent) {
          return <div key={line.slug}>{card}</div>;
        }

        return (
          <Link key={line.slug} href={cruiseLinePagePath(line.slug)} className="block">
            {card}
          </Link>
        );
      })}
    </div>
  );
}

export function CruiseLineComparisonMatrix({
  slugs = primaryNorwayComparisonSlugs,
  currentSlug,
  className = "",
  compact = false,
}: CruiseLineComparisonMatrixProps) {
  const rows = getCruiseLineComparisonRows(slugs);
  if (rows.length === 0) return null;

  return (
    <section
      id="compare-norway-cruise-lines"
      className={`${compact ? "" : "not-prose"} ${className}`.trim()}
    >
      {!compact ? (
        <>
          <h2>Compare Norway Cruise Lines</h2>
          <p>
            Compare best for, family fit, luxury level, voyage length, headline
            ports and typical ship size across operators sailing western Norway.
          </p>
        </>
      ) : null}

      <div className={compact ? "" : "mt-6"}>
        <MatrixGrid rows={rows} currentSlug={currentSlug} />
        <MatrixCards rows={rows} currentSlug={currentSlug} />
      </div>

      {!compact ? (
        <p className="mt-6 text-sm text-slate-600">
          Schedule counts and port frequency vary by sailing. Confirm your exact
          itinerary with our{" "}
          <Link href={shipScheduleSearchPath} className="content-link font-medium">
            ship schedule search
          </Link>{" "}
          and{" "}
          <Link href="/norway-cruise-planner" className="content-link font-medium">
            Norway Cruise Planner
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}
