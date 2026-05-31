import Link from "next/link";

import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";

export type ShipCardProps = {
  slug: string;
  shipName: string;
  cruiseLine: string;
  capacityLabel: string;
  callCount: number;
  topPortsLabel?: string;
  badgeInput: ShipCardBadgeInput;
  href: string;
  priority?: boolean;
  ctaLabel?: string;
};

export function ShipCard({
  slug,
  shipName,
  cruiseLine,
  capacityLabel,
  callCount,
  topPortsLabel,
  badgeInput,
  href,
  priority = false,
  ctaLabel = "View ship page",
}: ShipCardProps) {
  return (
    <Link
      href={href}
      className="premium-card group block overflow-hidden transition hover:border-[var(--glacier-blue)]"
    >
      <ShipImage
        slug={slug}
        shipName={shipName}
        cruiseLine={cruiseLine}
        className="aspect-[16/9] rounded-none border-0 border-b border-[var(--border-light)]"
        priority={priority}
        capacityLabel={capacityLabel}
        callCount={callCount}
        badgeInput={badgeInput}
      />
      <div className="p-4 sm:p-5">
        <ShipCardBadges input={badgeInput} className="mb-3" />
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--glacier-blue)]">
          {shipName}
        </h3>
        <p className="mt-1 text-sm text-slate-600">{cruiseLine}</p>
        <dl className="mt-3 space-y-1 text-sm text-slate-700">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-slate-500">Capacity</dt>
            <dd>{capacityLabel}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-slate-500">Norway calls</dt>
            <dd>{callCount}</dd>
          </div>
          {topPortsLabel ? (
            <div>
              <dt className="font-medium text-slate-500">Most visited ports</dt>
              <dd className="mt-0.5">{topPortsLabel}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 text-xs font-semibold text-[var(--glacier-blue)]">
          {ctaLabel} →
        </p>
      </div>
    </Link>
  );
}
