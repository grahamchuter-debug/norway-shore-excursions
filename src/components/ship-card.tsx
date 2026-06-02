import Link from "next/link";

import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";

export type ShipCardVariant = "default" | "featured" | "hero";

export type ShipCardProps = {
  slug: string;
  shipName: string;
  cruiseLine: string;
  capacityLabel: string;
  callCount: number;
  topPortsLabel?: string;
  typicalCruiseLengthLabel?: string;
  badgeInput: ShipCardBadgeInput;
  href: string;
  priority?: boolean;
  ctaLabel?: string;
  variant?: ShipCardVariant;
  summary?: string;
};

export function ShipCard({
  slug,
  shipName,
  cruiseLine,
  capacityLabel,
  callCount,
  topPortsLabel,
  typicalCruiseLengthLabel,
  badgeInput,
  href,
  priority = false,
  ctaLabel = "View ship page",
  variant = "default",
  summary,
}: ShipCardProps) {
  const isHero = variant === "hero";
  const isFeatured = variant === "featured" || isHero;
  const imageAspect = isHero ? "aspect-[21/9]" : "aspect-[16/9]";

  return (
    <Link
      href={href}
      className={`premium-card group block overflow-hidden transition hover:border-[var(--glacier-blue)] ${
        isFeatured ? "shadow-md" : ""
      }`}
    >
      <ShipImage
        slug={slug}
        shipName={shipName}
        cruiseLine={cruiseLine}
        className={`${imageAspect} rounded-none border-0 border-b border-[var(--border-light)]`}
        priority={priority}
        showOverlayLabels={isHero}
        capacityLabel={capacityLabel}
        callCount={callCount}
        badgeInput={badgeInput}
      />
      <div className={isHero ? "p-5 sm:p-6" : isFeatured ? "p-4 sm:p-5" : "p-4 sm:p-5"}>
        <ShipCardBadges input={badgeInput} className="mb-3" />
        <h3
          className={`font-bold text-slate-900 group-hover:text-[var(--glacier-blue)] ${
            isHero ? "text-2xl sm:text-3xl" : isFeatured ? "text-xl" : "text-lg"
          }`}
        >
          {shipName}
        </h3>
        <p className={`mt-1 text-slate-600 ${isHero ? "text-base" : "text-sm"}`}>
          {cruiseLine}
        </p>
        {summary ? (
          <p
            className={`mt-3 leading-6 text-slate-600 ${
              isHero ? "text-sm sm:text-base" : "text-sm"
            }`}
          >
            {summary}
          </p>
        ) : null}
        <dl
          className={`mt-3 text-slate-700 ${
            isHero
              ? "grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"
              : isFeatured
                ? "grid gap-2 text-sm sm:grid-cols-2"
                : "space-y-1 text-sm"
          }`}
        >
          <div className={isHero || isFeatured ? "" : "flex flex-wrap gap-x-2"}>
            <dt className="font-medium text-slate-500">Capacity</dt>
            <dd className={isHero || isFeatured ? "mt-0.5 font-semibold text-slate-900" : ""}>
              {capacityLabel}
            </dd>
          </div>
          <div className={isHero || isFeatured ? "" : "flex flex-wrap gap-x-2"}>
            <dt className="font-medium text-slate-500">Norway calls</dt>
            <dd className={isHero || isFeatured ? "mt-0.5 font-semibold text-slate-900" : ""}>
              {callCount}
            </dd>
          </div>
          {typicalCruiseLengthLabel ? (
            <div className={isHero || isFeatured ? "" : "flex flex-wrap gap-x-2"}>
              <dt className="font-medium text-slate-500">Typical Norway length</dt>
              <dd className={isHero || isFeatured ? "mt-0.5 font-semibold text-slate-900" : ""}>
                {typicalCruiseLengthLabel}
              </dd>
            </div>
          ) : null}
          {topPortsLabel ? (
            <div className={isHero ? "sm:col-span-2 lg:col-span-1" : ""}>
              <dt className="font-medium text-slate-500">Most visited ports</dt>
              <dd className={`${isHero || isFeatured ? "mt-0.5 font-semibold text-slate-900" : "mt-0.5"}`}>
                {topPortsLabel}
              </dd>
            </div>
          ) : null}
        </dl>
        <p
          className={`mt-4 font-semibold text-[var(--glacier-blue)] ${
            isHero ? "text-sm sm:text-base" : "text-xs"
          }`}
        >
          {ctaLabel} →
        </p>
      </div>
    </Link>
  );
}
