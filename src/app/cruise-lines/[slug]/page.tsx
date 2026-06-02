import Link from "next/link";
import { notFound } from "next/navigation";

import { CompareNorwayCruiseLines } from "@/components/compare-norway-cruise-lines";
import { ContentPage } from "@/components/content-page";
import { CruiseLineComparisonMatrix } from "@/components/cruise-line-comparison-matrix";
import { CruiseLineExcursionStyles } from "@/components/cruise-line-excursion-styles";
import { CruiseLineFeaturedShips } from "@/components/cruise-line-featured-ships";
import { CruiseLineLogo } from "@/components/cruise-line-logo";
import { CruiseLineNorwayPorts } from "@/components/cruise-line-norway-ports";
import { CruisePassengerSnapshot } from "@/components/cruise-passenger-snapshot";
import { CruisePlanningTools } from "@/components/cruise-planning-tools";
import { JsonLd } from "@/components/json-ld";
import { ShipCard } from "@/components/ship-card";
import { ShipCardBadges } from "@/components/ship-card-badges";
import {
  ReturnToShipConfidence,
  fitTierToReturnLevel,
} from "@/components/return-to-ship-confidence";
import {
  cruiseLineBySlug,
  cruiseLineSlugs,
} from "@/lib/cruise-lines-data";
import { comparisonSlugsForLinePage } from "@/lib/cruise-line-comparison";
import {
  getCruiseLineScheduleSummary,
  getFeaturedCruiseLineShips,
} from "@/lib/cruise-line-schedules";
import { shipCardBadgeInputFromCruiseLineShip } from "@/lib/ship-card-badges";
import {
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipScheduleHubPath,
  shipSchedulePortPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import {
  getSchedulesByPort,
  hasRealScheduleData,
} from "@/lib/cruiseSchedules";
import {
  getDefaultExcursionConfidenceForPort,
  estimatePortReturnConfidence,
} from "@/lib/ship-excursion-confidence";
import {
  getPortRecommendedExcursions,
  isMappedExcursionPort,
} from "@/lib/port-recommended-excursions";
import { portBySlug } from "@/lib/ports-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

type CruiseLinePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return cruiseLineSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CruiseLinePageProps) {
  const { slug } = await params;
  const line = cruiseLineBySlug[slug];
  if (!line) return {};

  return buildPageMetadata({
    title: line.headline,
    description: line.metaDescription,
    path: `/cruise-lines/${slug}`,
    ogImage: siteImages.hero,
    ogImageAlt: imageAlts.hero,
  });
}

export default async function CruiseLinePage({ params }: CruiseLinePageProps) {
  const { slug } = await params;
  const line = cruiseLineBySlug[slug];
  if (!line) notFound();

  const scheduleStats = getCruiseLineScheduleSummary(line.scheduleKey);
  const featuredShips =
    line.featuredShipSlugs && line.featuredShipSlugs.length > 0
      ? getFeaturedCruiseLineShips(line.scheduleKey, line.featuredShipSlugs)
      : scheduleStats.ships.slice(0, 4);

  const popularPortsLabel =
    scheduleStats.ports.length > 0
      ? scheduleStats.ports
          .slice(0, 4)
          .map((p) => p.portDisplayName)
          .join(", ")
      : line.recommendedPortSlugs
          .slice(0, 4)
          .map((s) => portBySlug[s].displayName)
          .join(", ");

  const excursionPorts = scheduleStats.ports.length
    ? scheduleStats.ports.slice(0, 3)
    : line.recommendedPortSlugs.slice(0, 3).map((portSlug) => ({
        portSlug,
        portDisplayName: portBySlug[portSlug].displayName,
        callCount: 0,
      }));

  const itemList = buildItemListSchema(
    scheduleStats.ports.slice(0, 8).map((port) => ({
      name: port.portDisplayName,
      description: `${port.callCount} scheduled calls in 2026 data`,
    })),
    `Norway ports for ${line.shortName}`,
  );

  const planningLinks = [
    { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
    { label: "Ship Schedules Hub", href: shipScheduleHubPath },
    { label: "Search by Ship", href: shipScheduleSearchPath },
    { label: "Norway Cruise Ports", href: "/norway-cruise-ports" },
    { label: "Shore Excursions Hub", href: "/norway-shore-excursions" },
    { label: "All Cruise Lines", href: "/cruise-lines" },
    { label: "Compare Cruise Lines", href: "/cruise-lines#compare-norway-cruise-lines" },
    ...scheduleStats.ports
      .filter((p) => hasRealScheduleData(p.portSlug))
      .slice(0, 3)
      .map((p) => ({
        label: `${p.portDisplayName} Schedule`,
        href: shipSchedulePortPath(p.portSlug),
      })),
  ];

  const otherScheduleShips = scheduleStats.ships.filter(
    (ship) => !featuredShips.some((f) => f.slug === ship.slug),
  );

  return (
    <>
      <JsonLd data={itemList} />
      <ContentPage
        title={line.headline}
        lead={line.lead}
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath={`/cruise-lines/${slug}`}
        pageDescription={line.metaDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Lines", href: "/cruise-lines" },
          { label: line.shortName },
        ]}
        faqs={line.faqs}
        belowHero={
          <div className="mx-auto flex max-w-3xl justify-center pb-2">
            <CruiseLineLogo cruiseLine={line.name} variant="hero" />
          </div>
        }
        ctaTitle="Build your Norway excursion plan"
        ctaText="Use the Norway Cruise Planner for smart, rules based recommendations matched to your ports and interests."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Norway Cruise Planner"
        relatedLinks={planningLinks}
        relatedSectionTitle="More Norway cruise planning tools"
      >
        <section>
          <h2>Why {line.name} Works Well In Norway</h2>
          <p>{line.overview}</p>
          <p>
            This page helps {line.name} passengers plan Norway shore excursions
            independently. We are not affiliated with {line.name} and do not
            represent ship sponsored tour programmes.
          </p>
          <h3>Typical Norway itineraries</h3>
          <p>{line.typicalItineraries}</p>
          <h3>Fjord destinations</h3>
          <p>{line.fjordDestinations}</p>
          <h3>Popular ports in our schedule data</h3>
          <p>
            {scheduleStats.portCount > 0
              ? `${line.shortName} ships in our 2026 Norway database call at ${popularPortsLabel}.`
              : `Typical ${line.shortName} Norway itineraries include ${popularPortsLabel}. Confirm your sailing against our ship search.`}
          </p>
          <h3>Typical shore time</h3>
          <p>{line.typicalShoreTime}</p>
          <h3>Cruise style</h3>
          <p>{line.cruiseStyle}</p>
        </section>

        <CruisePassengerSnapshot
          snapshot={line.passengerSnapshot}
          cruiseLineName={line.name}
          className="my-10"
        />

        <CruiseLineNorwayPorts
          cruiseLineShortName={line.shortName}
          ports={scheduleStats.ports}
          className="my-10"
        />

        <CruiseLineFeaturedShips
          cruiseLineSlug={slug}
          cruiseLineShortName={line.shortName}
          ships={featuredShips}
          typicalCruiseLengthLabel={line.passengerSnapshot.typicalCruiseLength}
          className="my-10"
        />

        <CruiseLineComparisonMatrix
          slugs={comparisonSlugsForLinePage(slug)}
          currentSlug={slug}
          className="my-10"
        />

        {otherScheduleShips.length > 0 ? (
          <section>
            <h2>More {line.shortName} ships in Norway</h2>
            <p>
              Additional vessels from our 2026 Norway schedule database, sorted by
              port call frequency.
            </p>
            <ul className="card-grid mt-4 grid gap-4 sm:grid-cols-2">
              {otherScheduleShips.map((ship) => (
                <li key={ship.ship}>
                  {ship.shipPageHref ? (
                    <ShipCard
                      slug={ship.slug}
                      shipName={ship.ship}
                      cruiseLine={ship.cruiseLine}
                      capacityLabel={ship.capacityLabel}
                      callCount={ship.callCount}
                      topPortsLabel={ship.topPortNames || undefined}
                      badgeInput={shipCardBadgeInputFromCruiseLineShip(ship)}
                      href={ship.shipPageHref}
                    />
                  ) : (
                    <Link
                      href={`${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}`}
                      className="premium-card block p-4 transition hover:border-[var(--glacier-blue)]"
                    >
                      <ShipCardBadges
                        input={shipCardBadgeInputFromCruiseLineShip(ship)}
                        className="mb-3"
                      />
                      <span className="font-semibold text-slate-900">
                        {ship.ship}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {ship.capacityLabel} · {ship.callCount}{" "}
                        {ship.callCount === 1 ? "port call" : "port calls"}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>Best Excursions For This Cruise Line</h2>
          <p>
            Excursion styles that suit {line.shortName} passengers on Norway port
            days. These are planning guides only, not booking pages.
          </p>
          <CruiseLineExcursionStyles styles={line.excursionStyles} />
        </section>

        {scheduleStats.ports.length > 0 ? (
          <section>
            <h2>All Norway ports visited by {line.shortName}</h2>
            <p>
              Full list from our 2026 Norway schedule database, sorted by call
              frequency.
            </p>
            <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2">
              {scheduleStats.ports.map((port) => (
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
                      {port.callCount === 1
                        ? "scheduled call"
                        : "scheduled calls"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      {hasRealScheduleData(port.portSlug) ? (
                        <Link
                          href={shipSchedulePortPath(port.portSlug)}
                          className="content-link font-medium"
                        >
                          View schedule
                        </Link>
                      ) : null}
                      <Link
                        href={getPortExcursionLink(port.portSlug)}
                        className="content-link font-medium"
                      >
                        {getPortExcursionLinkLabel(port.portDisplayName)}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {excursionPorts.length > 0 ? (
          <section>
            <h2>Port by port excursion timing</h2>
            <p>
              Sample return to ship confidence for {line.shortName} at busy Norway
              ports. Always confirm against your sailing&apos;s all aboard time.
            </p>
            <div className="space-y-8">
              {excursionPorts.map((port) => {
                const lineRows = getSchedulesByPort(port.portSlug).filter(
                  (row) =>
                    scheduleStats.ships.some(
                      (s) => s.ship.toLowerCase() === row.ship.toLowerCase(),
                    ),
                );
                const sampleRow = lineRows.find(
                  (r) => r.arrival_time && r.all_aboard_time,
                );
                const tier =
                  (sampleRow && estimatePortReturnConfidence(sampleRow)) ||
                  getDefaultExcursionConfidenceForPort();
                const cards = getPortRecommendedExcursions(port.portSlug, {
                  fitExcursionHref:
                    "/return-to-ship-guide#will-this-excursion-fit",
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
                              <p className="font-semibold text-slate-900">
                                {card.title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {card.benefit}
                              </p>
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
                                <Link
                                  href={card.url}
                                  className="mt-3 inline-flex text-sm font-semibold text-[var(--glacier-blue)]"
                                >
                                  {card.ctaLabel} →
                                </Link>
                              )}
                            </article>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        <Link
                          href={getPortExcursionLink(port.portSlug)}
                          className="content-link font-medium"
                        >
                          {getPortExcursionLinkLabel(port.portDisplayName)}
                        </Link>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section>
          <h2>Planning Your Norway Cruise</h2>
          <p>
            Use these tools to plan {line.shortName} port days before you sail,
            from ship schedules to port guides and excursion themes.
          </p>
          <CruisePlanningTools />
          <ul className="mt-6 space-y-2">
            {line.planningTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <CompareNorwayCruiseLines currentSlug={slug} className="mt-10" />
      </ContentPage>
    </>
  );
}
