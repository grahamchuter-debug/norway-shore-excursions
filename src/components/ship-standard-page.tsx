import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { CruisePlanningTools } from "@/components/cruise-planning-tools";
import { JsonLd } from "@/components/json-ld";
import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import { shipCardBadgeInputFromSummary } from "@/lib/ship-card-badges";
import {
  formatScheduleDateLabel,
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipSchedulePortPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
import { matchCruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { cruiseLineBySlug, cruiseLinePagePath } from "@/lib/cruise-lines-data";
import {
  getShipCallsByYear,
  getUpcomingShipCalls,
} from "@/lib/schedule-insights";
import type { ShipScheduleSummary } from "@/lib/ship-schedules";
import { shipPagePath } from "@/lib/ship-schedules";
import { shipPageFaqs } from "@/lib/ships-data";
import {
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

type ShipStandardPageProps = {
  ship: ShipScheduleSummary;
};

export function ShipStandardPage({ ship }: ShipStandardPageProps) {
  const callsByYear = getShipCallsByYear(ship.slug);
  const upcomingCalls = getUpcomingShipCalls(ship.slug, 3);
  const lineKey = matchCruiseLineScheduleKey(ship.cruiseLine);
  const lineGuide = lineKey
    ? Object.values(cruiseLineBySlug).find((line) => line.scheduleKey === lineKey)
    : undefined;
  const yearsLabel = Object.keys(callsByYear).sort().join(" and ") || "2026 and 2027";
  const pageTitle = `${ship.ship} Norway Cruises`;
  const pageDescription = `${ship.ship} on ${ship.cruiseLine}: ${ship.callCount} Norway port calls in our ${yearsLabel} schedule data. Search sailings and plan shore excursions.`;

  const relatedLinks = [
    {
      label: "Search by Ship",
      href: `${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}`,
    },
    { label: "Ship Schedules Hub", href: "/ship-schedules" },
    { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
    ...(lineGuide
      ? [{ label: `${lineGuide.shortName} Norway guide`, href: cruiseLinePagePath(lineGuide.slug) }]
      : []),
    ...ship.topPorts
      .filter((p) => hasRealScheduleData(p.portSlug))
      .slice(0, 3)
      .map((p) => ({
        label: `${p.portDisplayName} Schedule`,
        href: shipSchedulePortPath(p.portSlug),
      })),
  ];

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            path: shipPagePath(ship.slug),
            title: pageTitle,
            description: pageDescription,
          }),
          buildFaqSchema(shipPageFaqs),
        ]}
      />
      <ContentPage
        title={pageTitle}
        lead={`${ship.cruiseLine} · ${ship.capacityLabel} · ${ship.callCount} Norway port calls (${yearsLabel})`}
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath={shipPagePath(ship.slug)}
        pageDescription={pageDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Ships", href: "/ships" },
          { label: ship.ship },
        ]}
        faqs={shipPageFaqs}
        belowHero={
          <div className="mx-auto max-w-3xl space-y-4">
            <ShipImage
              slug={ship.slug}
              shipName={ship.ship}
              cruiseLine={ship.cruiseLine}
              className="aspect-[16/9]"
              priority
              capacityLabel={ship.capacityLabel}
              callCount={ship.callCount}
              badgeInput={shipCardBadgeInputFromSummary(ship)}
            />
            <ShipCardBadges
              input={shipCardBadgeInputFromSummary(ship)}
              className="px-1"
            />
          </div>
        }
        ctaTitle="Plan excursions for your sailing"
        ctaText="Use the Norway Cruise Planner to match shore excursions to your ship timetable."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Cruise Planner"
        relatedLinks={relatedLinks}
        relatedSectionTitle="More Norway cruise planning"
      >
        <section>
          <h2>Quick facts</h2>
          <ul className="card-grid grid gap-3 sm:grid-cols-2">
            <li className="premium-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Passenger capacity
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {ship.capacityLabel}
              </p>
            </li>
            <li className="premium-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cruise line
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {lineGuide ? (
                  <Link href={cruiseLinePagePath(lineGuide.slug)} className="content-link">
                    {ship.cruiseLine}
                  </Link>
                ) : (
                  ship.cruiseLine
                )}
              </p>
            </li>
            <li className="premium-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Norway port calls
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {ship.callCount}
              </p>
            </li>
            <li className="premium-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Top ports
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {ship.topPorts.map((p) => p.portDisplayName).join(", ")}
              </p>
            </li>
          </ul>
        </section>

        {upcomingCalls.length > 0 ? (
          <section>
            <h2>Upcoming port calls</h2>
            <ul className="card-grid mt-4 grid gap-3">
              {upcomingCalls.map((row) => {
                const portName =
                  ship.ports.find((p) => p.portSlug === row.port)?.portDisplayName ??
                  row.port;
                return (
                  <li key={`${row.arrival_date}-${row.port}`} className="premium-card p-4">
                    <p className="font-semibold text-slate-900">
                      {formatScheduleDateLabel(row.arrival_date)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{portName}</p>
                    <Link
                      href={`/ports/${row.port}`}
                      className="content-link mt-2 inline-block text-sm font-medium"
                    >
                      Port guide
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>Ports visited</h2>
          <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2">
            {ship.ports.map((port) => (
              <li key={port.portSlug} className="premium-card p-4">
                <Link
                  href={`/ports/${port.portSlug}`}
                  className="font-semibold text-slate-900 hover:text-[var(--glacier-blue)]"
                >
                  {port.portDisplayName}
                </Link>
                <p className="mt-1 text-sm text-slate-600">
                  {port.callCount}{" "}
                  {port.callCount === 1 ? "scheduled call" : "scheduled calls"}
                </p>
                <Link
                  href={getPortExcursionLink(port.portSlug)}
                  className="content-link mt-2 inline-block text-sm font-medium"
                >
                  {getPortExcursionLinkLabel(port.portDisplayName)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Full schedule</h2>
          <p>
            Search all {ship.ship} Norway sailings with arrival and departure times
            in our ship schedule search.
          </p>
          <p className="mt-3">
            <Link
              href={`${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}`}
              className="content-link font-medium"
            >
              Search {ship.ship} schedule →
            </Link>
          </p>
        </section>

        <section>
          <h2>Cruise planning tools</h2>
          <CruisePlanningTools shipName={ship.ship} />
        </section>
      </ContentPage>
    </>
  );
}
