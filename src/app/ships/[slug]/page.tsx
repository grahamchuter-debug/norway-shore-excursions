import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { CruisePlanningTools } from "@/components/cruise-planning-tools";
import { JsonLd } from "@/components/json-ld";
import {
  ReturnToShipConfidence,
  fitTierToReturnLevel,
} from "@/components/return-to-ship-confidence";
import { ShipCardBadges } from "@/components/ship-card-badges";
import { ShipImage } from "@/components/ship-image";
import { shipCardBadgeInputFromSummary } from "@/lib/ship-card-badges";
import {
  formatScheduleDateLabel,
  formatScheduleTime,
  getPortExcursionLink,
  getPortExcursionLinkLabel,
  shipSchedulePortPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
import {
  getDefaultExcursionConfidenceForPort,
  estimatePortReturnConfidence,
} from "@/lib/ship-excursion-confidence";
import {
  getAllShipSlugs,
  getShipScheduleSummaryBySlug,
  shipPagePath,
} from "@/lib/ship-schedules";
import { shipPageFaqs } from "@/lib/ships-data";
import {
  getPortRecommendedExcursions,
  isMappedExcursionPort,
} from "@/lib/port-recommended-excursions";
import { buildPageMetadata } from "@/lib/site-metadata";
import {
  buildFaqSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

type ShipPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllShipSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ShipPageProps) {
  const { slug } = await params;
  const ship = getShipScheduleSummaryBySlug(slug);
  if (!ship) return {};

  return buildPageMetadata({
    title: `${ship.ship} Norway Cruise Schedule 2026`,
    description: `${ship.ship} (${ship.cruiseLine}) Norway 2026 port schedule: ${ship.callCount} calls, ${ship.capacityLabel}, top ports ${ship.topPorts.map((p) => p.portDisplayName).join(", ")} and shore excursion planning.`,
    path: shipPagePath(slug),
    ogImage: siteImages.hero,
    ogImageAlt: imageAlts.hero,
  });
}

export default async function ShipPage({ params }: ShipPageProps) {
  const { slug } = await params;
  const ship = getShipScheduleSummaryBySlug(slug);
  if (!ship) notFound();

  const excursionPorts = ship.topPorts.slice(0, 4);
  const pageTitle = `${ship.ship} Norway Cruises`;
  const pageDescription = `${ship.ship} on ${ship.cruiseLine}: ${ship.callCount} Norway port calls in our 2026 schedule data, ${ship.capacityLabel}, and independent shore excursion planning.`;

  const portItemList = buildItemListSchema(
    ship.ports.map((p) => ({
      name: p.portDisplayName,
      description: `${p.callCount} scheduled calls`,
    })),
    `Norway ports visited by ${ship.ship}`,
  );

  const webPageSchema = buildWebPageSchema({
    path: shipPagePath(slug),
    title: pageTitle,
    description: pageDescription,
  });

  const faqSchema = buildFaqSchema(shipPageFaqs);

  const relatedLinks = [
    { label: "Search by Ship", href: `${shipScheduleSearchPath}?q=${encodeURIComponent(ship.ship)}` },
    { label: "Ship Schedules Hub", href: "/ship-schedules" },
    { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
    { label: "Return to Ship Confidence", href: "/return-to-ship-confidence" },
    ...ship.topPorts
      .filter((p) => hasRealScheduleData(p.portSlug))
      .slice(0, 4)
      .map((p) => ({
        label: `${p.portDisplayName} Schedule`,
        href: shipSchedulePortPath(p.portSlug),
      })),
  ];

  return (
    <>
      <JsonLd data={[webPageSchema, faqSchema, portItemList]} />
      <ContentPage
        title={pageTitle}
        lead={`${ship.cruiseLine} · ${ship.capacityLabel} · ${ship.callCount} Norway port calls in 2026 schedule data`}
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath={shipPagePath(slug)}
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
              slug={slug}
              shipName={ship.ship}
              cruiseLine={ship.cruiseLine}
              className="aspect-[16/9]"
              priority
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
                {ship.cruiseLine}
              </p>
            </li>
            <li className="premium-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Norway port calls (2026 data)
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

        <section>
          <h2>Norway cruise schedule</h2>
          <p>
            All imported 2026 Norway port calls for {ship.ship} in our database.
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
                      <Link
                        href={`/ports/${row.port}`}
                        className="content-link font-medium"
                      >
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
              const sampleRow = portRows.find(
                (r) => r.arrival_time && r.all_aboard_time,
              );
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
            <Link
              href="/return-to-ship-guide#will-this-excursion-fit"
              className="content-link font-medium"
            >
              Will This Excursion Fit?
            </Link>{" "}
            for your exact tour duration.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
