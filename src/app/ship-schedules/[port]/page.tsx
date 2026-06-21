import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { PortScheduleInsightsSection } from "@/components/port-schedule-insights";
import { RecommendedPortExcursions } from "@/components/recommended-port-excursions";
import { ShipScheduleHubCard } from "@/components/ship-schedule-hub-card";
import { ShipScheduleInternalLinks } from "@/components/ship-schedule-internal-links";
import {
  cruiseScheduleDisclaimer,
  getScheduleMonthLabelFromSlug,
  parseScheduleMonthSlug,
  scheduledPortSlugs,
  shipScheduleHubPath,
  shipScheduleMonthPath,
} from "@/lib/cruise-schedule-config";
import {
  getScheduleHubPortSummary,
  hasRealScheduleData,
} from "@/lib/cruiseSchedules";
import { getPortScheduleInsights } from "@/lib/schedule-insights";
import { portBySlug } from "@/lib/ports-data";
import { getPortImage } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

type ShipSchedulePortPageProps = {
  params: Promise<{ port: string }>;
};

export async function generateStaticParams() {
  return scheduledPortSlugs.map((port) => ({ port }));
}

export async function generateMetadata({ params }: ShipSchedulePortPageProps) {
  const { port } = await params;
  const portData = portBySlug[port];
  const scheduleAvailable = hasRealScheduleData(port);
  const insights = scheduleAvailable ? getPortScheduleInsights(port) : null;
  const peakMonth = insights
    ? [...insights.busiestMonths].sort((a, b) => b.shipCalls - a.shipCalls)[0]
    : null;

  const yearsLabel =
    insights?.yearsAvailable.join(" and ") ?? "2026 and 2027";

  return buildPageMetadata({
    title: `${portData?.displayName ?? port} Cruise Ship Schedule`,
    description:
      scheduleAvailable && insights
        ? `${portData?.displayName ?? port} cruise schedule: ${insights.totalCalls} ship calls across ${yearsLabel}${peakMonth ? `, busiest month ${peakMonth.monthLabel}` : ""}. Monthly arrivals and shore excursion planning.`
        : `${portData?.displayName ?? port} cruise ship arrival schedule hub with monthly pages.`,
    path: `${shipScheduleHubPath}/${port}`,
  });
}

export default async function ShipSchedulePortPage({ params }: ShipSchedulePortPageProps) {
  const { port } = await params;

  if (!scheduledPortSlugs.includes(port as (typeof scheduledPortSlugs)[number])) {
    notFound();
  }

  const portData = portBySlug[port];
  if (!portData) notFound();

  const scheduleAvailable = hasRealScheduleData(port);
  const summary = getScheduleHubPortSummary(port);
  const insights = scheduleAvailable ? getPortScheduleInsights(port) : null;
  const hero = getPortImage(port);

  const yearsLabel =
    insights?.yearsAvailable.join(" and ") ?? "2026 and 2027";

  return (
    <ContentPage
      title={`${portData.displayName} Cruise Ship Schedule`}
      lead={
        scheduleAvailable && insights
          ? `Published ${portData.displayName} cruise ship calls from approved CSV imports across ${yearsLabel}. ${insights.totalCalls} verified calls with peak activity in ${[...insights.busiestMonths].sort((a, b) => b.shipCalls - a.shipCalls)[0]?.monthLabel ?? "summer"}.`
          : `The ${portData.displayName} schedule hub is live while full CSV data is prepared. Monthly pages show a coming soon message until real ship calls are imported.`
      }
      heroImage={hero.url}
      heroImageAlt={hero.alt}
      pagePath={`${shipScheduleHubPath}/${port}`}
      pageDescription={`${portData.displayName} cruise ship schedule hub.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ship Schedules", href: shipScheduleHubPath },
        { label: portData.displayName },
      ]}
      ctaTitle="Build your port day plan"
      ctaText="Generate personalised excursion recommendations for your Norway cruise itinerary."
      ctaHref="/norway-cruise-planner"
      ctaButtonLabel="Open Cruise Planner"
    >
      <section>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {cruiseScheduleDisclaimer}
        </p>
      </section>

      <section>
        <ShipScheduleHubCard summary={summary} />
      </section>

      {insights ? <PortScheduleInsightsSection insights={insights} /> : null}

      <section>
        <h2>Monthly schedule pages</h2>
        <ul className="card-grid grid gap-2 sm:grid-cols-2">
          {summary.months.map((monthSummary) => {
            const callCount = monthSummary.shipCallCount;
            const year = parseScheduleMonthSlug(monthSummary.slug)?.year ?? "2026";
            return (
              <li key={monthSummary.slug}>
                <Link
                  href={shipScheduleMonthPath(port, monthSummary.slug)}
                  className="content-link font-medium"
                >
                  {monthSummary.label} {year}
                  {callCount !== null && callCount !== undefined
                    ? ` · ${callCount} ship call${callCount === 1 ? "" : "s"}`
                    : ""}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <RecommendedPortExcursions
        portSlug={port}
        portDisplayName={portData.displayName}
        fitExcursionHref="/return-to-ship-guide"
      />

      <ShipScheduleInternalLinks portSlug={port} portName={portData.displayName} />
    </ContentPage>
  );
}
