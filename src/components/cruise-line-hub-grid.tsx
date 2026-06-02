import Link from "next/link";

import { CruiseLineLogo } from "@/components/cruise-line-logo";
import type { CruiseLineData } from "@/lib/cruise-lines-data";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";

type CruiseLineHubGridProps = {
  lines: readonly CruiseLineData[];
  className?: string;
};

export function CruiseLineHubGrid({ lines, className = "" }: CruiseLineHubGridProps) {
  return (
    <ul
      className={`card-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
    >
      {lines.map((line) => {
        const stats = getCruiseLineScheduleSummary(line.scheduleKey);
        return (
          <li key={line.slug}>
            <Link
              href={`/cruise-lines/${line.slug}`}
              className="premium-card flex h-full flex-col p-5 transition hover:border-[var(--glacier-blue)]"
            >
              <CruiseLineLogo cruiseLine={line.name} variant="badge" />
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {line.shortName}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {line.lead}
              </p>
              {stats.shipCount > 0 ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--glacier-blue)]">
                  {stats.shipCount} {stats.shipCount === 1 ? "ship" : "ships"} ·{" "}
                  {stats.portCount} {stats.portCount === 1 ? "port" : "ports"}
                </p>
              ) : (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Planning guide
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
