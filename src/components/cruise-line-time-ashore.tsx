import Link from "next/link";

import { shipScheduleSearchPathForLine } from "@/lib/cruise-line-schedules";
import {
  getLinePortTimeAshoreEntries,
  timeAshoreBadgeClass,
  timeAshoreLabel,
  type PortTimeAshoreEntry,
} from "@/lib/cruise-line-port-planning";
import type { CruiseLineData } from "@/lib/cruise-lines-data";
import type { CruiseLinePortSummary } from "@/lib/cruise-line-schedules";
import { portBySlug } from "@/lib/ports-data";

type CruiseLineTimeAshoreProps = {
  line: CruiseLineData;
  schedulePorts: readonly CruiseLinePortSummary[];
  className?: string;
};

function TimeAshoreCard({ entry }: { entry: PortTimeAshoreEntry }) {
  const port = portBySlug[entry.portSlug];
  if (!port) return null;

  return (
    <li>
      <article className="premium-card flex h-full flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Link
            href={`/ports/${entry.portSlug}`}
            className="text-base font-bold text-slate-900 hover:text-[var(--glacier-blue)]"
          >
            {port.displayName}
          </Link>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${timeAshoreBadgeClass(entry.timeAshore)}`}
          >
            {timeAshoreLabel(entry.timeAshore)}
          </span>
        </div>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
          {entry.planningNote}
        </p>
      </article>
    </li>
  );
}

export function CruiseLineTimeAshore({
  line,
  schedulePorts,
  className = "",
}: CruiseLineTimeAshoreProps) {
  const entries = getLinePortTimeAshoreEntries(line, schedulePorts);

  if (entries.length === 0) return null;

  return (
    <section className={className}>
      <h2>Typical time ashore</h2>
      <p>
        Simple planning guide for {line.shortName} Norway ports. Half day or full
        day labels reflect typical call length, not your ship&apos;s exact
        timetable.
      </p>

      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <TimeAshoreCard key={entry.portSlug} entry={entry} />
        ))}
      </ul>

      <p className="mt-4 text-sm text-slate-600">
        For live arrival and all aboard times,{" "}
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
