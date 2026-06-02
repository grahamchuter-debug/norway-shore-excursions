import Link from "next/link";

import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import type { FindYourShipEntry } from "@/lib/find-your-ship";

type FindYourShipCardProps = {
  ship: FindYourShipEntry;
  priority?: boolean;
};

export function FindYourShipCard({ ship, priority = false }: FindYourShipCardProps) {
  const primaryShipHref = ship.shipPageHref ?? ship.cruiseLineHref;

  return (
    <article className="premium-card overflow-hidden">
      <Link href={primaryShipHref} className="group block">
        <ShipImage
          slug={ship.slug}
          shipName={ship.shipName}
          cruiseLine={ship.cruiseLine}
          className="aspect-[16/9] rounded-none border-0 border-b border-[var(--border-light)]"
          priority={priority}
          capacityLabel={ship.capacityLabel}
          callCount={ship.callCount}
          badgeInput={ship.badgeInput}
        />
      </Link>
      <div className="p-4 sm:p-5">
        <ShipCardBadges input={ship.badgeInput} className="mb-3" />
        <h3 className="text-xl font-bold text-slate-900">
          <Link
            href={primaryShipHref}
            className="transition hover:text-[var(--glacier-blue)]"
          >
            {ship.shipName}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-slate-600">{ship.cruiseLine}</p>
        {ship.summary ? (
          <p className="mt-3 text-sm leading-6 text-slate-600">{ship.summary}</p>
        ) : null}
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Passenger capacity</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">{ship.capacityLabel}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Typical Norway cruise length</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              {ship.typicalNorwayCruiseLength}
            </dd>
          </div>
          {ship.commonPortsLabel ? (
            <div className="sm:col-span-2">
              <dt className="font-medium text-slate-500">Common ports visited</dt>
              <dd className="mt-0.5 font-semibold text-slate-900">{ship.commonPortsLabel}</dd>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-500">Recommended excursion types</dt>
            <dd className="mt-0.5 text-slate-800">{ship.recommendedExcursionTypes}</dd>
          </div>
        </dl>
        <ul className="mt-5 flex flex-col gap-2 border-t border-[var(--border-light)] pt-4 text-sm font-semibold">
          <li>
            <Link href={ship.cruiseLineHref} className="content-link">
              {ship.cruiseLine} Norway guide →
            </Link>
          </li>
          <li>
            <Link href={ship.schedulesHref} className="content-link">
              {ship.shipName} ship schedules →
            </Link>
          </li>
          <li>
            <Link href={ship.plannerHref} className="content-link">
              Norway Cruise Planner →
            </Link>
          </li>
          {ship.shipPageHref ? (
            <li>
              <Link href={ship.shipPageHref} className="content-link">
                Full {ship.shipName} ship page →
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
