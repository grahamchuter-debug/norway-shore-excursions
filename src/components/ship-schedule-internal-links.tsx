import Link from "next/link";

import {
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import { getPortScheduleInsights } from "@/lib/schedule-insights";
import { matchCruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { cruiseLineBySlug, cruiseLinePagePath } from "@/lib/cruise-lines-data";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
import { shipPagePath } from "@/lib/ship-schedules";

type ShipScheduleInternalLinksProps = {
  portSlug: string;
  portName: string;
};

export function ShipScheduleInternalLinks({
  portSlug,
  portName,
}: ShipScheduleInternalLinksProps) {
  const excursionLink = getPortExcursionLink(portSlug);
  const insights = hasRealScheduleData(portSlug)
    ? getPortScheduleInsights(portSlug)
    : null;

  const topLine = insights?.topCruiseLines.find((line) => line.href);
  const topShip = insights?.topShips[0];

  return (
    <>
      <section>
        <h2>Plan your {portName} port day</h2>
        <ul className="card-grid grid gap-2 sm:grid-cols-2">
          <li>
            <Link href={excursionLink} className="content-link font-medium">
              {getPortExcursionLinkLabel(portName)}
            </Link>
          </li>
          <li>
            <Link href="/norway-cruise-planner" className="content-link font-medium">
              Cruise Planner
            </Link>
          </li>
          <li>
            <Link href="#will-this-excursion-fit" className="content-link font-medium">
              Will This Excursion Fit My Cruise?
            </Link>
          </li>
          <li>
            <Link href={`/ports/${portSlug}`} className="content-link font-medium">
              {portName} Port Guide
            </Link>
          </li>
          <li>
            <Link href="/norway-cruise-calendar" className="content-link font-medium">
              Norway Cruise Calendar
            </Link>
          </li>
          <li>
            <Link href="/ships" className="content-link font-medium">
              Browse Cruise Ships
            </Link>
          </li>
        </ul>
      </section>

      {insights && (topLine || topShip) ? (
        <section>
          <h2>Related schedule pages</h2>
          <ul className="card-grid grid gap-2 sm:grid-cols-2">
            {topLine?.href ? (
              <li>
                <Link href={topLine.href} className="content-link font-medium">
                  {topLine.label} Norway guide
                </Link>
              </li>
            ) : null}
            {topShip?.href ? (
              <li>
                <Link href={topShip.href} className="content-link font-medium">
                  {topShip.label} ship schedule
                </Link>
              </li>
            ) : null}
            <li>
              <Link href="/cruise-lines" className="content-link font-medium">
                All cruise line guides
              </Link>
            </li>
            <li>
              <Link href={shipSchedulePortPath(portSlug)} className="content-link font-medium">
                {portName} schedule hub
              </Link>
            </li>
          </ul>
        </section>
      ) : null}
    </>
  );
}

/** Resolve cruise line page href from raw schedule cruise line name. */
export function cruiseLineHrefFromScheduleName(cruiseLine: string): string | null {
  const key = matchCruiseLineScheduleKey(cruiseLine);
  if (!key) return null;
  const line = Object.values(cruiseLineBySlug).find((entry) => entry.scheduleKey === key);
  return line ? cruiseLinePagePath(line.slug) : null;
}

export function shipHrefFromSlug(slug: string): string {
  return shipPagePath(slug);
}
