import { notFound } from "next/navigation";

import { CompareNorwayCruiseLines } from "@/components/compare-norway-cruise-lines";
import { CruiseLineScheduleStats } from "@/components/cruise-line-schedule-stats";
import { ContentPage } from "@/components/content-page";
import { CruiseLineComparisonMatrix } from "@/components/cruise-line-comparison-matrix";
import { CruiseLineExcursionsByPort } from "@/components/cruise-line-excursions-by-port";
import { CruiseLineExcursionStyles } from "@/components/cruise-line-excursion-styles";
import { CruiseLineTimeAshore } from "@/components/cruise-line-time-ashore";
import { CruiseLineFeaturedShips } from "@/components/cruise-line-featured-ships";
import { CruiseLineItineraryTimeline } from "@/components/cruise-line-itinerary-timeline";
import { CruiseLineLogo } from "@/components/cruise-line-logo";
import { CruiseLineNorwayPorts } from "@/components/cruise-line-norway-ports";
import { CruiseLinePlanDashboard } from "@/components/cruise-line-plan-dashboard";
import { CruisePassengerSnapshot } from "@/components/cruise-passenger-snapshot";
import { JsonLd } from "@/components/json-ld";
import { RelatedCruiseLines } from "@/components/related-cruise-lines";
import {
  cruiseLineBySlug,
  cruiseLineSlugs,
} from "@/lib/cruise-lines-data";
import { comparisonSlugsForLinePage } from "@/lib/cruise-line-comparison";
import { getNorwayItineraryForLine } from "@/lib/cruise-line-itineraries";
import {
  getCruiseLineScheduleSummary,
  getFeaturedCruiseLineShips,
} from "@/lib/cruise-line-schedules";
import {
  shipScheduleHubPath,
  shipSchedulePortPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
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

  const itinerary = getNorwayItineraryForLine(slug);

  const itemList = buildItemListSchema(
    scheduleStats.ports.slice(0, 8).map((port) => ({
      name: port.portDisplayName,
      description: `${port.callCount} scheduled calls in verified schedule data`,
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
        <CruisePassengerSnapshot
          snapshot={line.passengerSnapshot}
          cruiseLineName={line.name}
          className="my-10"
        />

        <CruiseLineFeaturedShips
          cruiseLineSlug={slug}
          cruiseLineShortName={line.shortName}
          scheduleKey={line.scheduleKey}
          ships={featuredShips}
          typicalCruiseLengthLabel={line.passengerSnapshot.typicalCruiseLength}
          className="my-10"
        />

        {itinerary ? (
          <CruiseLineItineraryTimeline
            cruiseLineShortName={line.shortName}
            itinerary={itinerary}
            className="my-10"
          />
        ) : null}

        <CruiseLineScheduleStats
          scheduleKey={line.scheduleKey}
          cruiseLineShortName={line.shortName}
          className="my-10"
        />

        <CruiseLineNorwayPorts
          cruiseLineShortName={line.shortName}
          ports={scheduleStats.ports}
          className="my-10"
        />

        <CruiseLineTimeAshore
          line={line}
          schedulePorts={scheduleStats.ports}
          className="my-10"
        />

        <CruiseLineExcursionsByPort line={line} className="my-10" />

        <CruiseLineExcursionStyles
          styles={line.excursionStyles}
          cruiseLineShortName={line.shortName}
          className="my-10"
        />

        <div className="not-prose my-10 rounded-2xl border border-[var(--border-light)] bg-slate-50/80 p-6 sm:p-8">
          <CruiseLineComparisonMatrix
            slugs={comparisonSlugsForLinePage(slug)}
            currentSlug={slug}
          />
          <CompareNorwayCruiseLines currentSlug={slug} className="mt-10" />
        </div>

        <CruiseLinePlanDashboard
          cruiseLineShortName={line.shortName}
          scheduleKey={line.scheduleKey}
          className="my-10"
        />

        <RelatedCruiseLines currentSlug={slug} className="my-10" />

        <section className="my-10 border-t border-[var(--border-light)] pt-8">
          <h2>About this guide</h2>
          <p>{line.overview}</p>
          <p className="text-sm text-slate-600">
            Independent planning for {line.name} passengers. We are not affiliated
            with {line.name}.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
