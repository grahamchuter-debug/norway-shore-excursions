import Link from "next/link";

import type { CruiseLineData } from "@/lib/cruise-lines-data";
import {
  getLinePortExcursionEntries,
  type LinePortExcursionEntry,
} from "@/lib/cruise-line-port-planning";
import { shipScheduleSearchPathForLine } from "@/lib/cruise-line-schedules";
import type { ExcursionPick } from "@/lib/port-recommended-excursions";
import { getPortImage } from "@/lib/site-images";

type CruiseLineExcursionsByPortProps = {
  line: CruiseLineData;
  className?: string;
};

function ExcursionPickLink({ pick }: { pick: ExcursionPick }) {
  const linkClassName =
    "font-semibold text-[var(--glacier-blue)] hover:text-[var(--glacier-blue-hover)]";

  if (pick.external) {
    return (
      <a
        href={pick.url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {pick.title}
      </a>
    );
  }

  return (
    <Link href={pick.url} className={linkClassName}>
      {pick.title}
    </Link>
  );
}

function ExcursionPickRow({
  label,
  pick,
}: {
  label: string;
  pick: ExcursionPick;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-sm leading-6">
        <ExcursionPickLink pick={pick} />
      </dd>
    </div>
  );
}

function PortExcursionCard({ entry }: { entry: LinePortExcursionEntry }) {
  const img = getPortImage(entry.portSlug);

  return (
    <li>
      <article className="premium-card flex h-full flex-col overflow-hidden">
        <div
          className="h-36 bg-cover bg-center sm:h-40"
          style={{ backgroundImage: `url(${img.url})` }}
          role="img"
          aria-label={img.alt}
        />
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
            {entry.portRegion}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {entry.portDisplayName}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {entry.description}
          </p>

          <dl className="mt-4 space-y-2.5 border-t border-[var(--border-light)] pt-4">
            <ExcursionPickRow label="Best pick" pick={entry.best} />
            <ExcursionPickRow label="Small group" pick={entry.smallGroup} />
            <ExcursionPickRow label="Scenic" pick={entry.scenic} />
          </dl>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--border-light)] pt-4 text-sm font-semibold">
            <Link href={entry.portGuideHref} className="content-link">
              Port guide
            </Link>
            <a
              href={entry.excursionHubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              Shore excursions
            </a>
            {entry.scheduleHref ? (
              <Link href={entry.scheduleHref} className="content-link">
                Schedule
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
}

export function CruiseLineExcursionsByPort({
  line,
  className = "",
}: CruiseLineExcursionsByPortProps) {
  const entries = getLinePortExcursionEntries(line);

  return (
    <section className={className}>
      <h2>Recommended Excursions By Port</h2>
      <p>
        Six headline Norway ports with independent tour picks for{" "}
        {line.shortName} passengers. Port guides, local operators and return to
        ship planning links in one place.
      </p>

      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <PortExcursionCard key={entry.portSlug} entry={entry} />
        ))}
      </ul>

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
