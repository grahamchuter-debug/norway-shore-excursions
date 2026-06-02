import Link from "next/link";

import type { CruiseLinePortSummary } from "@/lib/cruise-line-schedules";
import {
  portVisitFrequencyBadge,
  type PortVisitFrequencyBadge,
} from "@/lib/cruise-line-port-frequency";
import { FEATURED_CRUISE_LINE_PORT_SLUGS } from "@/lib/cruise-lines-data";
import {
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
import { portBySlug, type PortData } from "@/lib/ports-data";
import { getPortImage } from "@/lib/site-images";

type CruiseLineNorwayPortsProps = {
  cruiseLineShortName: string;
  ports: readonly CruiseLinePortSummary[];
  className?: string;
};

function badgeOverlayClassName(badge: PortVisitFrequencyBadge): string {
  if (badge.frequency === "frequent") {
    return "bg-emerald-600/95 text-white";
  }
  if (badge.frequency === "occasional") {
    return "bg-sky-600/95 text-white";
  }
  return "bg-amber-600/95 text-white";
}

function badgeInlineClassName(badge: PortVisitFrequencyBadge): string {
  if (badge.frequency === "frequent") {
    return "bg-emerald-50 text-emerald-800";
  }
  if (badge.frequency === "occasional") {
    return "bg-sky-50 text-sky-800";
  }
  return "bg-amber-50 text-amber-800";
}

function CruiseLinePortCard({
  port,
  badge,
  callCount,
}: {
  port: PortData;
  badge: PortVisitFrequencyBadge | null;
  callCount: number;
}) {
  const img = getPortImage(port.slug);
  const hasSchedule = hasRealScheduleData(port.slug);

  return (
    <article className="premium-card flex h-full flex-col overflow-hidden">
      <Link href={`/ports/${port.slug}`} className="group block flex-1">
        <div className="relative">
          <div
            className="h-36 bg-cover bg-center transition group-hover:scale-[1.02] sm:h-40"
            style={{ backgroundImage: `url(${img.url})` }}
            role="img"
            aria-label={img.alt}
          />
          {badge ? (
            <span
              className={`absolute left-3 top-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${badgeOverlayClassName(badge)}`}
            >
              {badge.label}
            </span>
          ) : (
            <span className="absolute left-3 top-3 inline-flex rounded-full bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              Not in 2026 data
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
            {port.region}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-[var(--glacier-blue)]">
            {port.displayName}
          </h3>
          {callCount > 0 ? (
            <p className="mt-1 text-sm text-slate-600">
              {callCount} {callCount === 1 ? "scheduled call" : "scheduled calls"}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Typical stop, not in 2026 data</p>
          )}
        </div>
      </Link>
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--border-light)] px-4 py-3 text-sm font-semibold">
        {hasSchedule ? (
          <Link href={shipSchedulePortPath(port.slug)} className="content-link">
            View schedule
          </Link>
        ) : null}
        <Link href={getPortExcursionLink(port.slug)} className="content-link">
          {getPortExcursionLinkLabel(port.displayName)}
        </Link>
      </div>
    </article>
  );
}

export function CruiseLineNorwayPorts({
  cruiseLineShortName,
  ports,
  className = "",
}: CruiseLineNorwayPortsProps) {
  const portBySlugMap = new Map(ports.map((p) => [p.portSlug, p]));
  const maxCalls = ports.reduce((max, p) => Math.max(max, p.callCount), 0);
  const featuredSet = new Set<string>(FEATURED_CRUISE_LINE_PORT_SLUGS);
  const additionalPorts = ports.filter((port) => !featuredSet.has(port.portSlug));

  return (
    <section className={className}>
      <h2>Norway ports commonly visited</h2>
      <p>
        Headline fjord and city stops with frequency badges from our 2026 schedule
        data. Open a port for guides, schedules and excursions.
      </p>

      <div className="not-prose mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURED_CRUISE_LINE_PORT_SLUGS.map((portSlug) => {
          const schedulePort = portBySlugMap.get(portSlug);
          const callCount = schedulePort?.callCount ?? 0;
          const badge = portVisitFrequencyBadge(callCount, maxCalls);

          return (
            <CruiseLinePortCard
              key={portSlug}
              port={portBySlug[portSlug]}
              badge={badge}
              callCount={callCount}
            />
          );
        })}
      </div>

      {additionalPorts.length > 0 ? (
        <div className="not-prose mt-8">
          <h3 className="text-lg font-semibold text-slate-900">
            More {cruiseLineShortName} ports in 2026 data
          </h3>
          <ul className="card-grid mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {additionalPorts.map((port) => {
              const badge = portVisitFrequencyBadge(port.callCount, maxCalls);

              return (
                <li key={port.portSlug}>
                  <article className="premium-card h-full p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Link
                        href={`/ports/${port.portSlug}`}
                        className="font-semibold text-slate-900 hover:text-[var(--glacier-blue)]"
                      >
                        {port.portDisplayName}
                      </Link>
                      {badge ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badgeInlineClassName(badge)}`}
                        >
                          {badge.label}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {port.callCount}{" "}
                      {port.callCount === 1 ? "scheduled call" : "scheduled calls"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                      {hasRealScheduleData(port.portSlug) ? (
                        <Link
                          href={shipSchedulePortPath(port.portSlug)}
                          className="content-link"
                        >
                          Schedule
                        </Link>
                      ) : null}
                      <Link
                        href={getPortExcursionLink(port.portSlug)}
                        className="content-link"
                      >
                        Excursions
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-sm">
        <Link href="/norway-cruise-ports" className="content-link font-medium">
          Browse all Norway cruise ports →
        </Link>
      </p>
    </section>
  );
}
