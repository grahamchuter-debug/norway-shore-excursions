import Link from "next/link";

import {
  shipScheduleHubPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import {
  shipScheduleSearchPathForLine,
  type CruiseLineScheduleKey,
  type CruiseLineShipSummary,
} from "@/lib/cruise-line-schedules";

type CruiseLineScheduleLinksProps = {
  cruiseLineShortName: string;
  scheduleKey: CruiseLineScheduleKey;
  ships: readonly CruiseLineShipSummary[];
  shipCount: number;
  totalCalls: number;
  className?: string;
};

export function CruiseLineScheduleLinks({
  cruiseLineShortName,
  scheduleKey,
  ships,
  shipCount,
  totalCalls,
  className = "",
}: CruiseLineScheduleLinksProps) {
  if (shipCount === 0) return null;

  const lineSearchHref = shipScheduleSearchPathForLine(scheduleKey);
  const headlineShips = ships.slice(0, 4);

  return (
    <section
      className={`not-prose rounded-2xl border-2 border-[var(--glacier-blue)]/30 bg-gradient-to-br from-slate-50 via-white to-sky-50/40 p-6 shadow-sm sm:p-8 ${className}`.trim()}
    >
      <h2 className="text-2xl font-bold text-slate-900">
        {cruiseLineShortName} ship schedules in Norway
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {shipCount} {shipCount === 1 ? "ship" : "ships"} and {totalCalls}{" "}
        {totalCalls === 1 ? "port call" : "port calls"} in our verified Norway schedule database.
        Filter the schedule search to this line or open a ship directly.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={lineSearchHref} className="btn-primary-on-light inline-flex min-h-11 items-center px-5 py-2.5 text-sm">
          See {cruiseLineShortName} ship schedules in Norway
        </Link>
        <Link
          href={shipScheduleHubPath}
          className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[var(--glacier-blue)] hover:text-[var(--glacier-blue)]"
        >
          All Norway schedules
        </Link>
      </div>

      {headlineShips.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {headlineShips.map((ship) => (
            <li key={ship.slug}>
              <Link
                href={`${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}`}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--glacier-blue)] hover:text-[var(--glacier-blue)]"
              >
                {ship.ship}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
