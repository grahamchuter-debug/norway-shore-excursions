import Link from "next/link";

import { CruiseLineLogo } from "@/components/cruise-line-logo";
import {
  compareNorwayCruiseLineSlugs,
  cruiseLineBySlug,
  type CruiseLineData,
} from "@/lib/cruise-lines-data";

type CompareNorwayCruiseLinesProps = {
  currentSlug?: string;
  className?: string;
};

function CompareCardContent({
  line,
  isCurrent,
}: {
  line: CruiseLineData;
  isCurrent: boolean;
}) {
  return (
    <>
      <CruiseLineLogo cruiseLine={line.name} variant="inline" />
      <span
        className={`mt-3 text-xs font-semibold uppercase tracking-wide ${
          isCurrent ? "text-[var(--gold)]" : "invisible"
        }`}
        aria-hidden={!isCurrent}
      >
        Current guide
      </span>
      <span className="mt-1 block flex-1 font-semibold text-slate-900">
        {line.headline}
      </span>
      <span className="mt-1 block text-sm font-normal text-slate-600">
        {line.passengerSnapshot.bestFor}
      </span>
    </>
  );
}

function compareCardClassName(isCurrent: boolean) {
  return `premium-card flex h-full w-full flex-col p-4 ${
    isCurrent
      ? "border-[var(--gold)] bg-slate-50"
      : "font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
  }`;
}

export function CompareNorwayCruiseLines({
  currentSlug,
  className = "",
}: CompareNorwayCruiseLinesProps) {
  return (
    <section className={className}>
      <h2>Compare Norway cruise lines</h2>
      <p>Jump between line guides to compare pace, ship size and ports.</p>
      <ul className="card-grid mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {compareNorwayCruiseLineSlugs.map((slug) => {
          const line = cruiseLineBySlug[slug];
          if (!line) return null;
          const isCurrent = line.slug === currentSlug;
          return (
            <li key={line.slug} className="h-full">
              {isCurrent ? (
                <span
                  className={compareCardClassName(true)}
                  aria-current="page"
                >
                  <CompareCardContent line={line} isCurrent />
                </span>
              ) : (
                <Link
                  href={`/cruise-lines/${line.slug}`}
                  className={compareCardClassName(false)}
                >
                  <CompareCardContent line={line} isCurrent={false} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
