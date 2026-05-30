import Link from "next/link";

import type { DestinationConfig } from "@/lib/destination-port-types";

type PlannerPromoBannerProps = {
  config: DestinationConfig;
  compact?: boolean;
};

export function PlannerPromoBanner({
  config,
  compact = false,
}: PlannerPromoBannerProps) {
  return (
    <section
      className={
        compact
          ? "border-b bg-navy py-8 text-white"
          : "border-b bg-navy py-10 text-white lg:py-12"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Recommended first
          </p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            {config.plannerTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
            {config.plannerSubtitle}
          </p>
        </div>
        <Link
          href={config.plannerPath}
          className="btn-gold inline-flex min-h-11 shrink-0 items-center justify-center px-6 text-sm"
        >
          {config.plannerCtaLabel}
        </Link>
      </div>
    </section>
  );
}
