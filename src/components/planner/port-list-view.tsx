"use client";

import Image from "next/image";
import Link from "next/link";

import { getConfidenceClass } from "@/lib/norway-cruise-planner-engine";
import type { DestinationConfig, DestinationPort } from "@/lib/destination-port-types";

type PortListViewProps = {
  ports: readonly DestinationPort[];
  config: DestinationConfig;
  routePorts?: readonly string[];
  dimmedSlugs?: ReadonlySet<string>;
  onSelectPort?: (slug: string) => void;
  selectedSlug?: string;
};

function routeStopIndex(
  slug: string,
  routePorts?: readonly string[],
): number | null {
  if (!routePorts?.length) return null;
  const index = routePorts.indexOf(slug);
  return index >= 0 ? index + 1 : null;
}

export function PortListView({
  ports,
  config,
  routePorts,
  dimmedSlugs,
  onSelectPort,
  selectedSlug,
}: PortListViewProps) {
  if (ports.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
        No ports match the current filter. Try another interest or reset filters.
      </p>
    );
  }

  return (
    <ul className="card-grid grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {ports.map((port) => {
        const dimmed = dimmedSlugs?.has(port.slug) ?? false;
        const stop = routeStopIndex(port.slug, routePorts);
        const ctaLabel = config.exploreCtaTemplate.replace(
          "{port}",
          port.shortLabel,
        );
        const selected = selectedSlug === port.slug;

        return (
          <li
            key={port.slug}
            className={`premium-card overflow-hidden transition ${
              dimmed ? "opacity-35" : ""
            } ${selected ? "ring-2 ring-[var(--gold)] ring-offset-2" : ""}`}
          >
            <button
              type="button"
              className="relative block h-40 w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glacier-blue)] sm:h-44"
              onClick={() => onSelectPort?.(port.slug)}
              aria-pressed={selected}
            >
              <Image
                src={port.imageUrl}
                alt={port.imageAlt}
                fill
                className="object-cover transition duration-300 hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 360px"
                unoptimized
              />
              {stop ? (
                <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--navy-deep)]">
                  Stop {stop}
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--navy-deep)]/90 to-transparent p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">
                  {port.region}
                </p>
                <h3 className="text-lg font-bold text-white">{port.name}</h3>
              </div>
            </button>

            <div className="p-5">
              {port.description ? (
                <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                  {port.description}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {port.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-sm text-slate-700">
                <strong className="text-slate-900">Best for:</strong>{" "}
                {port.bestFor}
              </p>
              <p className="mt-1 text-sm text-slate-800">
                <strong className="text-slate-900">Top excursion:</strong>{" "}
                {port.topExcursion}
              </p>

              {port.matchReason ? (
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  <strong className="text-slate-900">Why it matches:</strong>{" "}
                  {port.matchReason}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="score-badge bg-[var(--navy-deep)] text-white">
                  Cruise fit {port.fitScore}/100
                </span>
                {port.returnLabel && port.returnConfidence ? (
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs ${getConfidenceClass(port.returnConfidence)}`}
                  >
                    {port.returnLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={port.localSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-on-light inline-flex min-h-11 items-center justify-center text-xs"
                >
                  {ctaLabel}
                </a>
                <Link
                  href={port.authorityPortPath}
                  className="text-center text-xs font-medium text-[var(--glacier-blue)] underline"
                >
                  Authority port guide
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
