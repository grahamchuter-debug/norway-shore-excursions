import Link from "next/link";

import type { DestinationConfig } from "@/lib/destination-port-types";

type MapSecondaryTeaserProps = {
  config: DestinationConfig;
};

export function MapSecondaryTeaser({ config }: MapSecondaryTeaserProps) {
  return (
    <section className="border-y bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {config.mapSecondaryEyebrow}
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {config.mapSecondaryTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {config.mapSecondarySubtitle}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            href={config.plannerPath}
            className="btn-primary-on-light inline-flex min-h-11 items-center justify-center text-sm"
          >
            {config.plannerCtaLabel}
          </Link>
          <Link
            href={config.portMapPath}
            className="text-sm font-medium text-[var(--glacier-blue)] underline"
          >
            Open port map →
          </Link>
        </div>
      </div>
    </section>
  );
}
