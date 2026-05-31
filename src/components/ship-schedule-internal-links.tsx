import Link from "next/link";

import {
  getPortExcursionLink,
  getPortExcursionLinkLabel,
} from "@/lib/cruise-schedule-config";

type ShipScheduleInternalLinksProps = {
  portSlug: string;
  portName: string;
};

export function ShipScheduleInternalLinks({
  portSlug,
  portName,
}: ShipScheduleInternalLinksProps) {
  const excursionLink = getPortExcursionLink(portSlug);

  return (
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
      </ul>
    </section>
  );
}
