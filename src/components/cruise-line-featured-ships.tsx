import Link from "next/link";

import { ShipCard } from "@/components/ship-card";
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
  typicalCruiseLengthLabel?: string;
  className?: string;
};

export const CRUISE_LINE_POPULAR_SHIPS_SECTION_ID = cruiseLinePopularShipsAnchor;

export function CruiseLineFeaturedShips({
  cruiseLineSlug,
  cruiseLineShortName,
  ships,
  typicalCruiseLengthLabel,
  className = "",
}: CruiseLineFeaturedShipsProps) {
  if (ships.length === 0) return null;

  return (
    <section id={CRUISE_LINE_POPULAR_SHIPS_SECTION_ID} className={className}>
      <h2>Ships Sailing Norway</h2>
      <p>
        Featured {cruiseLineShortName} ships on Norway itineraries, with capacity,
        typical voyage length, common ports and schedule call counts from our 2026
        database.
      </p>
      <ul className="card-grid mt-4 grid gap-4 sm:grid-cols-2">
        {ships.map((ship) => {
          const href = resolveFeaturedShipCardHref(ship.slug, cruiseLineSlug);

          return (
            <li key={ship.slug}>
              <ShipCard
                slug={ship.slug}
                shipName={ship.ship}
                cruiseLine={ship.cruiseLine}
                capacityLabel={ship.capacityLabel}
                callCount={ship.callCount}
                topPortsLabel={ship.topPortNames || undefined}
                typicalCruiseLengthLabel={typicalCruiseLengthLabel}
                badgeInput={shipCardBadgeInputFromCruiseLineShip(ship)}
                href={href}
                ctaLabel={
                  ship.shipPageHref ? "View ship page" : "View cruise line guide"
                }
              />
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
