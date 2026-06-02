import Link from "next/link";

import { PortCard } from "@/components/port-card";
import type { CruiseLinePortSummary } from "@/lib/cruise-line-schedules";
import { portVisitFrequencyBadge } from "@/lib/cruise-line-port-frequency";
import { FEATURED_CRUISE_LINE_PORT_SLUGS } from "@/lib/cruise-lines-data";
import { portBySlug } from "@/lib/ports-data";

type CruiseLineNorwayPortsProps = {
  cruiseLineShortName: string;
  ports: readonly CruiseLinePortSummary[];
  className?: string;
};

export function CruiseLineNorwayPorts({
  cruiseLineShortName,
  ports,
  className = "",
}: CruiseLineNorwayPortsProps) {
  const portBySlugMap = new Map(ports.map((p) => [p.portSlug, p]));
  const maxCalls = ports.reduce((max, p) => Math.max(max, p.callCount), 0);

  return (
    <section className={className}>
      <h2>Typical Norway Cruise Ports</h2>
      <p>
        Headline fjord and city stops for {cruiseLineShortName} in our 2026 Norway
        schedule data. Visit frequency badges reflect how often this line appears at
        each port in our database.
      </p>
      <div className="not-prose -mx-2 mt-4 grid gap-4 sm:grid-cols-2">
        {FEATURED_CRUISE_LINE_PORT_SLUGS.map((portSlug) => {
          const schedulePort = portBySlugMap.get(portSlug);
          const callCount = schedulePort?.callCount ?? 0;
          const badge = portVisitFrequencyBadge(callCount, maxCalls);

          return (
            <div key={portSlug} className="space-y-2">
              <PortCard port={portBySlug[portSlug]} />
              <div className="flex flex-wrap items-center gap-2 px-2">
                {badge ? (
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      badge.frequency === "frequent"
                        ? "bg-emerald-50 text-emerald-800"
                        : badge.frequency === "occasional"
                          ? "bg-sky-50 text-sky-800"
                          : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {badge.label}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500">
                    Not in our 2026 schedule data
                  </span>
                )}
                {callCount > 0 ? (
                  <span className="text-xs text-slate-500">
                    {callCount}{" "}
                    {callCount === 1 ? "scheduled call" : "scheduled calls"}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm">
        <Link href="/norway-cruise-ports" className="content-link font-medium">
          Browse all Norway cruise ports →
        </Link>
      </p>
    </section>
  );
}
