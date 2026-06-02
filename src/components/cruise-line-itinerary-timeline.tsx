import Link from "next/link";

import type { CruiseLineNorwayItinerary } from "@/lib/cruise-line-itineraries";
import { portBySlug } from "@/lib/ports-data";

type CruiseLineItineraryTimelineProps = {
  cruiseLineShortName: string;
  itinerary: CruiseLineNorwayItinerary;
  className?: string;
};

function stopIcon(kind: CruiseLineNorwayItinerary["stops"][number]["kind"]) {
  if (kind === "embark" || kind === "return") {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--glacier-blue)] text-xs font-bold text-white"
        aria-hidden
      >
        ⚓
      </span>
    );
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--glacier-blue)] bg-white text-xs font-bold text-[var(--glacier-blue)]"
      aria-hidden
    >
      ◆
    </span>
  );
}

export function CruiseLineItineraryTimeline({
  cruiseLineShortName,
  itinerary,
  className = "",
}: CruiseLineItineraryTimelineProps) {
  return (
    <section className={className}>
      <h2>Typical Norway itinerary</h2>
      <p>{itinerary.summary}</p>
      <ol
        className="not-prose mt-6 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-start sm:gap-2"
        aria-label={`Typical ${cruiseLineShortName} Norway route`}
      >
        {itinerary.stops.map((stop, index) => {
          const isLast = index === itinerary.stops.length - 1;
          const port = stop.portSlug ? portBySlug[stop.portSlug] : null;

          return (
            <li
              key={`${stop.label}-${index}`}
              className="flex min-w-0 flex-1 flex-col items-stretch sm:min-w-[7.5rem] sm:max-w-[11rem]"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center">
                {stopIcon(stop.kind)}
                <div className="min-w-0 flex-1 sm:mt-2">
                  {port ? (
                    <Link
                      href={`/ports/${port.slug}`}
                      className="text-sm font-bold text-slate-900 hover:text-[var(--glacier-blue)]"
                    >
                      {stop.label}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold text-slate-900">
                      {stop.label}
                    </span>
                  )}
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {stop.kind === "embark"
                      ? "Departure"
                      : stop.kind === "return"
                        ? "Return"
                        : "Port day"}
                  </span>
                </div>
              </div>
              {!isLast ? (
                <span
                  className="my-2 ml-4 hidden h-px flex-1 bg-[var(--border-light)] sm:ml-0 sm:mt-3 sm:block sm:h-8 sm:w-px sm:flex-none sm:self-center"
                  aria-hidden
                />
              ) : null}
              {!isLast ? (
                <span
                  className="ml-4 text-lg text-slate-300 sm:hidden"
                  aria-hidden
                >
                  ↓
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm">
        <Link href="/norway-cruise-ports" className="content-link font-medium">
          Browse Norway port guides →
        </Link>
      </p>
    </section>
  );
}
