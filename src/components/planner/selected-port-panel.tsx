"use client";

import Image from "next/image";
import Link from "next/link";

import { getConfidenceClass } from "@/lib/norway-cruise-planner-engine";
import type { DestinationConfig, DestinationPort } from "@/lib/destination-port-types";

type SelectedPortPanelProps = {
  port: DestinationPort;
  config: DestinationConfig;
};

export function SelectedPortPanel({ port, config }: SelectedPortPanelProps) {
  const ctaLabel = config.exploreCtaTemplate.replace("{port}", port.shortLabel);

  return (
    <article className="premium-card overflow-hidden lg:sticky lg:top-24">
      <div className="relative h-44 bg-[var(--navy-deep)] sm:h-48">
        <Image
          src={port.imageUrl}
          alt={port.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 400px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
            {port.region}
          </p>
          <h3 className="text-xl font-bold text-white">{port.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5">
          {port.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-700">
          <strong className="text-slate-900">Best for:</strong> {port.bestFor}
        </p>
        <p className="mt-2 text-sm text-slate-800">
          <strong className="text-slate-900">Top excursion:</strong>{" "}
          {port.topExcursion}
        </p>
        {port.matchReason ? (
          <p className="mt-3 text-sm leading-6 text-slate-700">
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
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getConfidenceClass(port.returnConfidence)}`}
            >
              {port.returnLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:border-[var(--glacier-blue)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glacier-blue)]"
          >
            Authority port guide
          </Link>
        </div>
      </div>
    </article>
  );
}
