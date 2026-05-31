import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { PortCard } from "@/components/port-card";
import { cruiseLineBySlug, cruiseLineSlugs } from "@/lib/cruise-lines-data";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import {
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipScheduleHubPath,
  shipSchedulePortPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
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

  const excursionPorts = scheduleStats.ports.length
    ? scheduleStats.ports.slice(0, 3)
    : line.recommendedPortSlugs.slice(0, 3).map((portSlug) => ({
        portSlug,
        portDisplayName: portBySlug[portSlug].displayName,
        callCount: 0,
      }));

  const itemList = buildItemListSchema(
    line.recommendedPortSlugs.map((s) => {
      const port = portBySlug[s];
      return {
        name: port.displayName,
        description: port.bestFor,
      };
    }),
    `Recommended Norway ports for ${line.shortName} passengers`,
  );

  const internalLinks = [
    { label: "Ship Schedules Hub", href: shipScheduleHubPath },
    { label: "Search by Ship", href: shipScheduleSearchPath },
    { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
    { label: "Shore Excursions Hub", href: "/norway-shore-excursions" },
    { label: "Norway Cruise Ports", href: "/norway-cruise-ports" },
    { label: "Return to Ship Guide", href: "/return-to-ship-guide" },
    ...scheduleStats.ports
      .filter((p) => hasRealScheduleData(p.portSlug))
      .slice(0, 4)
      .map((p) => ({
        label: `${p.portDisplayName} Schedule`,
        href: shipSchedulePortPath(p.portSlug),
      })),
  ];

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
        ctaTitle="Build your Norway excursion plan"
        ctaText="Use the Norway Cruise Planner for smart, rules based recommendations matched to your ports and interests."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Norway Cruise Planner"
        relatedLinks={internalLinks}
        relatedSectionTitle="More Norway cruise planning tools"
      >
        <section>
          <h2>About {line.shortName} in Norway</h2>
          <p>{line.overview}</p>
          <p>
            This page helps {line.name} passengers plan Norway shore excursions
            independently. We are not affiliated with {line.name} and do not
            represent ship sponsored tour programmes.
          </p>
        </section>

        {scheduleStats.ships.length > 0 ? (
          <section>
            <h2>Popular {line.shortName} ships in Norway</h2>
            <p>
              Based on imported 2026 schedule data for Norway ports with
              verified timings. Ship call counts reflect total port visits in
              our database.
            </p>
            <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2">
              {scheduleStats.ships.map((ship) => (
                <li key={ship.ship}>
                  <Link
                    href={`${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}`}
                    className="premium-card block p-4 transition hover:border-[var(--glacier-blue)]"
                  >
                    <span className="font-semibold text-slate-900">
                      {ship.ship}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {ship.callCount}{" "}
                      {ship.callCount === 1 ? "port call" : "port calls"} in
                      2026 data
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {scheduleStats.ports.length > 0 ? (
          <section>
            <h2>Norway ports visited by {line.shortName}</h2>
            <p>
              Ports where {line.shortName} ships appear in our 2026 Norway
              schedule data, sorted by call frequency.
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
                      {port.callCount === 1 ? "scheduled call" : "scheduled calls"}
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
        ) : (
          <section>
            <h2>Recommended Norway cruise ports</h2>
            <div className="not-prose -mx-2 grid gap-4 sm:grid-cols-2">
              {line.recommendedPortSlugs.map((s) => (
                <PortCard key={s} port={portBySlug[s]} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2>Recommended shore excursions</h2>
          <p>
            Top excursion picks for {line.shortName} passengers at Norway ports
            on your itinerary. Browse all themes on our{" "}
            <Link href="/norway-shore-excursions">shore excursions hub</Link>.
          </p>
          <div className="space-y-8">
            {excursionPorts.map((port) => {
              const cards = getPortRecommendedExcursions(port.portSlug);
              return (
                <div key={port.portSlug}>
                  <h3>{port.portDisplayName}</h3>
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

        <section>
          <h2>Cruise planning tools</h2>
          <p>
            Use these tools to plan {line.shortName} port days before you sail.
          </p>
          <ul className="card-grid mt-4 grid gap-3 sm:grid-cols-2">
            <li>
              <Link
                href="/norway-cruise-planner"
                className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
              >
                Norway Cruise Planner™
                <span className="mt-1 block text-sm font-normal text-slate-600">
                  Personalised port recommendations matched to your itinerary
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/return-to-ship-guide#will-this-excursion-fit"
                className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
              >
                Will This Excursion Fit?
                <span className="mt-1 block text-sm font-normal text-slate-600">
                  Test tour duration against your port window and all aboard time
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={shipScheduleSearchPath}
                className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
              >
                Search by Ship
                <span className="mt-1 block text-sm font-normal text-slate-600">
                  Find your {line.shortName} ship&apos;s Norway port calls
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={shipScheduleHubPath}
                className="premium-card block p-4 font-medium text-slate-900 transition hover:border-[var(--glacier-blue)]"
              >
                Ship Schedules Hub
                <span className="mt-1 block text-sm font-normal text-slate-600">
                  Browse 2026 Norway port schedules by month
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2>How {line.shortName} passengers can plan Norway excursions</h2>
          <ul>
            {line.planningTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      </ContentPage>
    </>
  );
}
