import Link from "next/link";

import { CruiseLineLogo } from "@/components/cruise-line-logo";
import { cruiseLines, cruiseLinePagePath } from "@/lib/cruise-lines-data";

type RelatedCruiseLinesProps = {
  currentSlug: string;
  className?: string;
};

function truncateLead(text: string, max = 100): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export function RelatedCruiseLines({
  currentSlug,
  className = "",
}: RelatedCruiseLinesProps) {
  const others = cruiseLines.filter((line) => line.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className={className}>
      <h2>Related cruise lines</h2>
      <p>Compare Norway planning guides across every operator we cover.</p>
      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((line) => (
          <li key={line.slug}>
            <Link
              href={cruiseLinePagePath(line.slug)}
              className="premium-card flex h-full flex-col p-5 transition hover:border-[var(--glacier-blue)]"
            >
              <CruiseLineLogo cruiseLine={line.name} variant="inline" />
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {line.shortName}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {truncateLead(line.lead)}
              </p>
              <span className="mt-4 text-sm font-semibold text-[var(--glacier-blue)]">
                Open {line.shortName} guide →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
