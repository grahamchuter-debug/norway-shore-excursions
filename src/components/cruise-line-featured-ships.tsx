import Link from "next/link";

import { ShipCard } from "@/components/ship-card";
import type { CruiseLineScheduleKey, CruiseLineShipSummary } from "@/lib/cruise-line-schedules";
import { shipScheduleSearchPathForLine } from "@/lib/cruise-line-schedules";
import { getFeaturedShipSummary } from "@/lib/cruise-line-ship-summaries";
import { shipCardBadgeInputFromCruiseLineShip } from "@/lib/ship-card-badges";
import {
  cruiseLinePopularShipsAnchor,
  resolveFeaturedShipCardHref,
} from "@/lib/cruise-lines-data";

type CruiseLineFeaturedShipsProps = {
  cruiseLineSlug: string;
  cruiseLineShortName: string;
  scheduleKey: CruiseLineScheduleKey;
  ships: readonly CruiseLineShipSummary[];
  typicalCruiseLengthLabel?: string;
  className?: string;
};

export const CRUISE_LINE_POPULAR_SHIPS_SECTION_ID = cruiseLinePopularShipsAnchor;

export function CruiseLineFeaturedShips({
  cruiseLineSlug,
  cruiseLineShortName,
  scheduleKey,
  ships,
  typicalCruiseLengthLabel,
  className = "",
}: CruiseLineFeaturedShipsProps) {
  if (ships.length === 0) return null;

  const lineSearchHref = shipScheduleSearchPathForLine(scheduleKey);

  return (
    <section id={CRUISE_LINE_POPULAR_SHIPS_SECTION_ID} className={className}>
      <h2>Popular ships sailing Norway</h2>
      <p>
        Featured {cruiseLineShortName} vessels with capacity, typical Norway length
        and top ports from our 2026 schedule data.
      </p>
      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2">
        {ships.map((ship, index) => {
          const href = resolveFeaturedShipCardHref(ship.slug, cruiseLineSlug);
          const variant = index === 0 ? "hero" : "featured";
          const summary = getFeaturedShipSummary(ship.slug);

          return (
            <li
              key={ship.slug}
              className={index === 0 && ships.length > 1 ? "sm:col-span-2" : undefined}
            >
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
                variant={variant}
                priority={index === 0}
                summary={summary}
                ctaLabel={
                  ship.shipPageHref ? "View ship page" : "View cruise line guide"
                }
              />
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm">
        <Link href={lineSearchHref} className="content-link font-medium">
          See all {cruiseLineShortName} ship schedules in Norway →
        </Link>
        {" · "}
        <Link href="/ships" className="content-link font-medium">
          Browse ship pages →
        </Link>
      </p>
    </section>
  );
}
