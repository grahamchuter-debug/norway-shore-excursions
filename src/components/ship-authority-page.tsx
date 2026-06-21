import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { CruisePlanningTools } from "@/components/cruise-planning-tools";
import { JsonLd } from "@/components/json-ld";
import {
  ReturnToShipConfidence,
  fitTierToReturnLevel,
} from "@/components/return-to-ship-confidence";
import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import { ShipScheduleInsightsSection } from "@/components/ship-schedule-insights";
import { shipCardBadgeInputFromSummary } from "@/lib/ship-card-badges";
import {
  formatScheduleDateLabel,
  formatScheduleTime,
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipSchedulePortPath,
  shipScheduleSearchPath,
  shipScheduleMonthPath,
  buildScheduleMonthSlug,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
import { matchCruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { cruiseLineBySlug, cruiseLinePagePath } from "@/lib/cruise-lines-data";
import {
  getPortRecommendedExcursions,
  isMappedExcursionPort,
} from "@/lib/port-recommended-excursions";
import {
  getDefaultExcursionConfidenceForPort,
  estimatePortReturnConfidence,
} from "@/lib/ship-excursion-confidence";
import {
  getShipScheduleInsights,
  getUpcomingShipCalls,
} from "@/lib/schedule-insights";
import {
  buildShipAuthorityFaqs,
  buildShipOverviewNarrative,
  detectItineraryPatterns,
  detectRegionFocus,
  getAuthorityShipRank,
} from "@/lib/ship-authority";
import type { ShipScheduleSummary } from "@/lib/ship-schedules";
import { shipPagePath } from "@/lib/ship-schedules";
import {
  buildFaqSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

type ShipAuthorityPageProps = {
  ship: ShipScheduleSummary;
};

export function ShipAuthorityPage({ ship }: ShipAuthorityPageProps) {
  const insights = getShipScheduleInsights(ship.slug);
  if (!insights) return null;

  const excursionPorts = ship.topPorts.slice(0, 4);
  const upcomingCalls = getUpcomingShipCalls(ship.slug, 6);
  const lineKey = matchCruiseLineScheduleKey(ship.cruiseLine);
  const lineGuide = lineKey
    ? Object.values(cruiseLineBySlug).find((line) => line.scheduleKey === lineKey)
    : undefined;
  const yearsLabel = insights.yearsAvailable.join(" and ") || "2026 and 2027";
  const rank = getAuthorityShipRank(ship.slug);
  const overview = buildShipOverviewNarrative(ship, insights);
  const patterns = detectItineraryPatterns(ship);
  const regions = detectRegionFocus(ship);
  const faqs = buildShipAuthorityFaqs(ship, insights);
  const pageTitle = `${ship.ship} Norway Cruise Guide`;
  const pageDescription = `${ship.ship} (${ship.cruiseLine}) Norway authority guide: ${ship.callCount} port calls (${yearsLabel}), ${ship.capacityLabel}, itinerary patterns, schedule insights and shore excursion planning.`;

  const portItemList = buildItemListSchema(
    ship.ports.map((p) => ({
      name: p.portDisplayName,
      description: `${p.callCount} scheduled calls`,
    })),
    `Norway ports visited by ${ship.ship}`,
  );

  const relatedLinks = [
    { label: "Search by Ship", href: `${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}` },
    { label: "Ship Schedules Hub", href: "/ship-schedules" },
    { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
    { label: "Return to Ship Confidence", href: "/return-to-ship-confidence" },
    ...(lineGuide
      ? [{ label: `${lineGuide.shortName} Norway guide`, href: cruiseLinePagePath(lineGuide.slug) }]
      : []),
    { label: "Norway Cruise Calendar", href: "/norway-cruise-calendar" },
    ...ship.topPorts
      .filter((p) => hasRealScheduleData(p.portSlug))
      .slice(0, 5)
      .map((p) => ({
        label: `${p.portDisplayName} Schedule`,
        href: shipSchedulePortPath(p.portSlug),
      })),
  ];

  return (
    <>
      <JsonLd data={[buildWebPageSchema({ path: shipPagePath(ship.slug), title: pageTitle, description: pageDescription }), buildFaqSchema(faqs), portItemList]} />
      <ContentPage
        title={pageTitle}
        lead={`${ship.cruiseLine} · ${ship.capacityLabel} · #${rank} busiest Norway ship · ${ship.callCount} port calls (${yearsLabel})`}
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath={shipPagePath(ship.slug)}
        pageDescription={pageDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Ships", href: "/ships" },
          { label: ship.ship },
        ]}
        faqs={faqs}
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
        ctaText="Use the Norway Cruise Planner to match shore excursions to your ship timetable and traveller style."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Cruise Planner"
        relatedLinks={relatedLinks}
        relatedSectionTitle="More Norway cruise planning"
      >
        <section>
          <h2>Ship overview</h2>
          <p>{overview}</p>
          {regions.length > 0 ? (
            <p className="mt-3 text-sm text-slate-600">
              Regional focus: {regions.join(" · ")}
            </p>
          ) : null}
        </section>

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
                Norway activity rank
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                #{rank} of {yearsLabel} schedule data
              </p>
            </li>
            <li className="premium-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Visits by year
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {Object.entries(insights.callsByYear)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([year, count]) => `${year}: ${count}`)
                  .join(" · ")}
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
                Distinct ports
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {ship.portCount}
              </p>
            </li>
          </ul>
        </section>

        {patterns.length > 0 ? (
          <section>
            <h2>Norway itinerary patterns</h2>
            <p>
              Recurring port sequences detected from {ship.ship}&apos;s published
              timetable — useful for guessing which excursions to pre research.
            </p>
            <ul className="card-grid mt-4 grid gap-3">
              {patterns.map((pattern) => (
                <li key={pattern.label} className="premium-card p-4">
                  <p className="font-semibold text-slate-900">{pattern.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {pattern.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <ShipScheduleInsightsSection insights={insights} shipName={ship.ship} />

        {upcomingCalls.length > 0 ? (
          <section>
            <h2>Upcoming Norway port calls</h2>
            <p>
              Next scheduled {ship.ship} arrivals in our verified database. Confirm
              timings with {ship.cruiseLine} before booking excursions.
            </p>
            <ul className="card-grid mt-4 grid gap-3">
              {upcomingCalls.map((row) => {
                const monthSlug = buildScheduleMonthSlug(
                  row.arrival_date.slice(5, 7),
                  row.arrival_date.slice(0, 4),
                );
                const portName =
                  ship.ports.find((p) => p.portSlug === row.port)?.portDisplayName ??
                  row.port;
                return (
                  <li key={`${row.arrival_date}-${row.port}`} className="premium-card p-4">
                    <p className="font-semibold text-slate-900">
                      {formatScheduleDateLabel(row.arrival_date)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{portName}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <Link
                        href={shipScheduleMonthPath(row.port, monthSlug)}
                        className="content-link font-medium"
                      >
                        View month schedule
                      </Link>
                      <Link href={`/ports/${row.port}`} className="content-link font-medium">
                        Port guide
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>Norway cruise schedule</h2>
          <p>
            All imported Norway port calls for {ship.ship} in our database ({yearsLabel}).
            Confirm timings with {ship.cruiseLine} before booking excursions.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Port</th>
                  <th className="px-4 py-3 font-semibold">Arrival</th>
                  <th className="px-4 py-3 font-semibold">Departure</th>
                  <th className="px-4 py-3 font-semibold">All aboard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {ship.rows.map((row) => (
                  <tr key={`${row.arrival_date}-${row.port}-${row.arrival_time ?? "tbc"}`}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatScheduleDateLabel(row.arrival_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/ports/${row.port}`} className="content-link font-medium">
                        {ship.ports.find((p) => p.portSlug === row.port)?.portDisplayName ?? row.port}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatScheduleTime(row.arrival_time)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatScheduleTime(row.departure_time)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatScheduleTime(row.all_aboard_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Ports visited</h2>
          <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2">
            {ship.ports.map((port) => (
              <li key={port.portSlug}>
                <div className="premium-card p-4">
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
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {hasRealScheduleData(port.portSlug) ? (
                      <Link href={shipSchedulePortPath(port.portSlug)} className="content-link font-medium">
                        View schedule
                      </Link>
                    ) : null}
                    <Link href={getPortExcursionLink(port.portSlug)} className="content-link font-medium">
                      {getPortExcursionLinkLabel(port.portDisplayName)}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Recommended shore excursions</h2>
          <p>
            Excursion ideas for ports {ship.ship} visits most often. Return to Ship
            Confidence uses typical tour length against your published port times
            when available.
          </p>
          <div className="space-y-8">
            {excursionPorts.map((port) => {
              const portRows = ship.rows.filter((r) => r.port === port.portSlug);
              const sampleRow = portRows.find((r) => r.arrival_time && r.all_aboard_time);
              const tier =
                (sampleRow && estimatePortReturnConfidence(sampleRow)) ||
                getDefaultExcursionConfidenceForPort();
              const cards = getPortRecommendedExcursions(port.portSlug, {
                fitExcursionHref: "/return-to-ship-guide#will-this-excursion-fit",
              });

              return (
                <div key={port.portSlug}>
                  <h3>{port.portDisplayName}</h3>
                  <ReturnToShipConfidence
                    level={fitTierToReturnLevel(tier)}
                    compact
                    showLink
                    className="mb-3"
                  />
                  {isMappedExcursionPort(port.portSlug) ? (
                    <ul className="card-grid mt-3 grid gap-3 sm:grid-cols-2">
                      {cards.slice(0, 2).map((card) => (
                        <li key={card.title}>
                          <article className="premium-card p-4">
                            <p className="font-semibold text-slate-900">{card.title}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{card.benefit}</p>
                            {card.external ? (
                              <a
                                href={card.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex text-sm font-semibold text-[var(--glacier-blue)]"
                              >
                                {card.ctaLabel} →
                              </a>
                            ) : (
                              <Link href={card.url} className="mt-3 inline-flex text-sm font-semibold text-[var(--glacier-blue)]">
                                {card.ctaLabel} →
                              </Link>
                            )}
                          </article>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      <Link href={getPortExcursionLink(port.portSlug)} className="content-link font-medium">
                        {getPortExcursionLinkLabel(port.portDisplayName)}
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2>Cruise line and port guides</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3>Cruise line</h3>
              {lineGuide ? (
                <p>
                  <Link href={cruiseLinePagePath(lineGuide.slug)} className="content-link font-medium">
                    {lineGuide.name} Norway guide
                  </Link>{" "}
                  — fleet overview, typical cruise length and line wide schedule stats.
                </p>
              ) : (
                <p className="text-slate-600">{ship.cruiseLine}</p>
              )}
            </div>
            <div>
              <h3>Port authority pages</h3>
              <ul className="mt-2 space-y-1">
                {ship.ports.slice(0, 6).map((port) => (
                  <li key={port.portSlug}>
                    <Link href={`/ports/${port.portSlug}`} className="content-link">
                      {port.portDisplayName}
                    </Link>
                    <span className="ml-2 text-sm text-slate-500">
                      ({port.callCount} calls)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>Cruise planning tools</h2>
          <CruisePlanningTools shipName={ship.ship} />
        </section>

        <section>
          <h2>Return to Ship Confidence methodology</h2>
          <p>
            Confidence labels on this page estimate how comfortably a typical 4 hour
            independent tour fits your port window when arrival and all aboard times
            are published. We add 15 minute check in and 45 minute safety buffers.
          </p>
          <p>
            <Link href="/return-to-ship-confidence" className="content-link font-medium">
              Read the full Return to Ship Confidence guide
            </Link>{" "}
            or use{" "}
            <Link href="/return-to-ship-guide#will-this-excursion-fit" className="content-link font-medium">
              Will This Excursion Fit?
            </Link>{" "}
            for your exact tour duration.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
