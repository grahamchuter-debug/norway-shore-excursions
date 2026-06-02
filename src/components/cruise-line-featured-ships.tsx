import Link from "next/link";

import { ShipCard } from "@/components/ship-card";
import { ShipCardBadges } from "@/components/ship-card-badges";
import type { CruiseLineShipSummary } from "@/lib/cruise-line-schedules";
import { shipCardBadgeInputFromCruiseLineShip } from "@/lib/ship-card-badges";
import {
  cruiseLinePopularShipsAnchor,
  resolveFeaturedShipCardHref,
} from "@/lib/cruise-lines-data";
import { shipScheduleSearchPath } from "@/lib/cruise-schedule-config";

type CruiseLineFeaturedShipsProps = {
  cruiseLineSlug: string;
  cruiseLineShortName: string;
  ships: readonly CruiseLineShipSummary[];
  className?: string;
};

export const CRUISE_LINE_POPULAR_SHIPS_SECTION_ID = cruiseLinePopularShipsAnchor;

export function CruiseLineFeaturedShips({
  cruiseLineSlug,
  cruiseLineShortName,
  ships,
  className = "",
}: CruiseLineFeaturedShipsProps) {
  if (ships.length === 0) return null;

  return (
    <section id={CRUISE_LINE_POPULAR_SHIPS_SECTION_ID} className={className}>
      <h2>Popular Ships Sailing Norway</h2>
      <p>
        Featured {cruiseLineShortName} ships on Norway itineraries in our 2026
        schedule data, with capacity, call counts and common ports.
      </p>
      <ul className="card-grid mt-4 grid gap-4 sm:grid-cols-2">
        {ships.map((ship) => {
          const href =
            ship.shipPageHref ??
            resolveFeaturedShipCardHref(ship.slug, cruiseLineSlug);
          const useShipCard = Boolean(ship.shipPageHref);

          return (
            <li key={ship.slug}>
              {useShipCard ? (
                <ShipCard
                  slug={ship.slug}
                  shipName={ship.ship}
                  cruiseLine={ship.cruiseLine}
                  capacityLabel={ship.capacityLabel}
                  callCount={ship.callCount}
                  topPortsLabel={ship.topPortNames || undefined}
                  badgeInput={shipCardBadgeInputFromCruiseLineShip(ship)}
                  href={href}
                  ctaLabel={
                    ship.shipPageHref ? "View ship page" : "View cruise line guide"
                  }
                />
              ) : (
                <Link
                  href={href}
                  className="premium-card block p-4 transition hover:border-[var(--glacier-blue)]"
                >
                  <ShipCardBadges
                    input={shipCardBadgeInputFromCruiseLineShip(ship)}
                    className="mb-3"
                  />
                  <span className="font-semibold text-slate-900">{ship.ship}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {ship.capacityLabel}
                    {ship.callCount > 0
                      ? ` · ${ship.callCount} ${
                          ship.callCount === 1 ? "port call" : "port calls"
                        }`
                      : " · Search schedules for Norway calls"}
                  </span>
                  {ship.topPortNames ? (
                    <span className="mt-2 block text-sm text-slate-600">
                      Common ports: {ship.topPortNames}
                    </span>
                  ) : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm">
        <Link href={shipScheduleSearchPath} className="content-link font-medium">
          Search all {cruiseLineShortName} ship schedules →
        </Link>
      </p>
    </section>
  );
}
