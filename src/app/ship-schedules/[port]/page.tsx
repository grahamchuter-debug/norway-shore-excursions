import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { RecommendedPortExcursions } from "@/components/recommended-port-excursions";
import { ShipScheduleHubCard } from "@/components/ship-schedule-hub-card";
import { ShipScheduleInternalLinks } from "@/components/ship-schedule-internal-links";
import {
  cruiseScheduleDisclaimer,
  scheduledPortSlugs,
  scheduleMonthSlugs2026,
  shipScheduleHubPath,
  shipScheduleMonthPath,
} from "@/lib/cruise-schedule-config";
import {
  getScheduleHubPortSummary,
  hasRealScheduleData,
} from "@/lib/cruiseSchedules";
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

  return buildPageMetadata({
    title: `${portData?.displayName ?? port} Cruise Ship Schedule 2026`,
    description: `${portData?.displayName ?? port} 2026 cruise ship arrival schedule hub with June to September monthly pages.`,
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

  const summary = getScheduleHubPortSummary(port);
  const hero = getPortImage(port);
  const scheduleAvailable = hasRealScheduleData(port);

  return (
    <ContentPage
      title={`${portData.displayName} Cruise Ship Schedule 2026`}
      lead={
        scheduleAvailable
          ? `Published ${portData.displayName} cruise ship calls for June to September 2026 from approved CSV imports.`
          : `The ${portData.displayName} 2026 schedule hub is live while full CSV data is prepared. Monthly pages show a coming soon message until real ship calls are imported.`
      }
      heroImage={hero.url}
      heroImageAlt={hero.alt}
      pagePath={`${shipScheduleHubPath}/${port}`}
      pageDescription={`${portData.displayName} cruise ship schedule hub for 2026.`}
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

      <section>
        <h2>Monthly schedule pages</h2>
        <ul className="card-grid grid gap-2 sm:grid-cols-2">
          {scheduleMonthSlugs2026.map((monthSlug) => {
            const monthSummary = summary.months.find((item) => item.slug === monthSlug);
            const callCount = monthSummary?.shipCallCount;
            return (
              <li key={monthSlug}>
                <Link
                  href={shipScheduleMonthPath(port, monthSlug)}
                  className="content-link font-medium"
                >
                  {monthSummary?.label ?? monthSlug} 2026
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
