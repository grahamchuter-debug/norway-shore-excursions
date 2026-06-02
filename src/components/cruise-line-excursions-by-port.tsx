import Link from "next/link";

import { shipScheduleSearchPathForLine } from "@/lib/cruise-line-schedules";
import { getLinePortExcursionEntries } from "@/lib/cruise-line-port-planning";
import type { CruiseLineData } from "@/lib/cruise-lines-data";
import type { CruiseLinePortSummary } from "@/lib/cruise-line-schedules";
import type { RecommendedExcursionCard } from "@/lib/port-recommended-excursions";

type CruiseLineExcursionsByPortProps = {
  line: CruiseLineData;
  schedulePorts: readonly CruiseLinePortSummary[];
  className?: string;
};

function ExcursionCardLink({ card }: { card: RecommendedExcursionCard }) {
  const linkClassName =
    "text-sm font-semibold text-[var(--glacier-blue)] hover:text-[var(--glacier-blue-hover)]";

  if (card.external) {
    return (
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {card.ctaLabel} →
      </a>
    );
  }

  return (
    <Link href={card.url} className={linkClassName}>
      {card.ctaLabel} →
    </Link>
  );
}

function PortExcursionBlock({
  portDisplayName,
  portGuideHref,
  excursionHubHref,
  scheduleHref,
  excursions,
  hasMappedExcursions,
}: {
  portDisplayName: string;
  portGuideHref: string;
  excursionHubHref: string;
  scheduleHref: string | null;
  excursions: readonly RecommendedExcursionCard[];
  hasMappedExcursions: boolean;
}) {
  return (
    <article className="premium-card overflow-hidden">
      <div className="border-b border-[var(--border-light)] bg-slate-50/80 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-900">{portDisplayName}</h3>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href={portGuideHref} className="content-link">
              Port guide
            </Link>
            {scheduleHref ? (
              <Link href={scheduleHref} className="content-link">
                Schedule
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-5">
        {hasMappedExcursions && excursions.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {excursions.map((card) => (
              <li
                key={card.title}
                className="rounded-xl border border-[var(--border-light)] bg-white p-4"
              >
                <p className="font-semibold text-slate-900">{card.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {card.benefit}
                </p>
                <div className="mt-3">
                  <ExcursionCardLink card={card} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-slate-600">
            Browse independent shore excursions for {portDisplayName} on our
            authority site.
          </p>
        )}

        <p className="mt-4 text-sm">
          <a
            href={excursionHubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link font-medium"
          >
            All {portDisplayName} shore excursions →
          </a>
        </p>
      </div>
    </article>
  );
}

export function CruiseLineExcursionsByPort({
  line,
  schedulePorts,
  className = "",
}: CruiseLineExcursionsByPortProps) {
  const entries = getLinePortExcursionEntries(line, schedulePorts);

  if (entries.length === 0) return null;

  return (
    <section className={className}>
      <h2>Recommended excursions by port</h2>
      <p>
        Deep links to port guides and local tours for {line.shortName}&apos;s
        typical Norway stops. Independent operators, not cruise line packages.
      </p>

      <div className="not-prose mt-6 space-y-6">
        {entries.map((entry) => (
          <PortExcursionBlock
            key={entry.portSlug}
            portDisplayName={entry.portDisplayName}
            portGuideHref={entry.portGuideHref}
            excursionHubHref={entry.excursionHubHref}
            scheduleHref={entry.scheduleHref}
            excursions={entry.excursions}
            hasMappedExcursions={entry.hasMappedExcursions}
          />
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Match tours to your sailing with the{" "}
        <Link href="/norway-cruise-planner" className="content-link font-medium">
          Norway Cruise Planner
        </Link>
        . For exact port times,{" "}
        <Link
          href={shipScheduleSearchPathForLine(line.scheduleKey)}
          className="content-link font-medium"
        >
          see live port times in Ship Schedules
        </Link>
        .
      </p>
    </section>
  );
}
