import Link from "next/link";
import { notFound } from "next/navigation";

import { CruiseScheduleComingSoon } from "@/components/cruise-schedule-coming-soon";
import { CruiseScheduleTable } from "@/components/cruise-schedule-table";
import { RecommendedPortExcursions } from "@/components/recommended-port-excursions";
import { WillThisExcursionFit } from "@/components/will-this-excursion-fit";
import { ContentPage } from "@/components/content-page";
import { ShipScheduleInternalLinks } from "@/components/ship-schedule-internal-links";
import {
  cruiseScheduleDisclaimer,
  getScheduleMonthLabelFromSlug,
  parseScheduleMonthSlug,
  scheduledPortSlugs,
  allScheduleMonthSlugs,
  shipScheduleHubPath,
  shipScheduleMonthPath,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import {
  getSchedulesByMonthSlug,
  hasRealScheduleData,
} from "@/lib/cruiseSchedules";
import { portBySlug } from "@/lib/ports-data";
import { getPortImage } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

type ShipScheduleMonthPageProps = {
  params: Promise<{ port: string; monthSlug: string }>;
};

export async function generateStaticParams() {
  return scheduledPortSlugs.flatMap((port) =>
    allScheduleMonthSlugs.map((monthSlug) => ({
      port,
      monthSlug,
    })),
  );
}

export async function generateMetadata({ params }: ShipScheduleMonthPageProps) {
  const { port, monthSlug } = await params;
  const portData = portBySlug[port];
  const parsed = parseScheduleMonthSlug(monthSlug);
  const monthName = getScheduleMonthLabelFromSlug(monthSlug);
  const year = parsed?.year ?? "2026";

  return buildPageMetadata({
    title: `${portData?.displayName ?? port} Cruise Schedule ${monthName} ${year}`,
    description: `${portData?.displayName ?? port} cruise ship arrival schedule for ${monthName} ${year}.`,
    path: shipScheduleMonthPath(port, monthSlug),
  });
}

export default async function ShipScheduleMonthPage({ params }: ShipScheduleMonthPageProps) {
  const { port, monthSlug } = await params;

  if (
    !scheduledPortSlugs.includes(port as (typeof scheduledPortSlugs)[number]) ||
    !allScheduleMonthSlugs.includes(monthSlug as (typeof allScheduleMonthSlugs)[number])
  ) {
    notFound();
  }

  const parsedMonth = parseScheduleMonthSlug(monthSlug);
  if (!parsedMonth) {
    notFound();
  }

  const portData = portBySlug[port];
  if (!portData) notFound();

  const monthName = getScheduleMonthLabelFromSlug(monthSlug);
  const year = parsedMonth.year;
  const scheduleAvailable = hasRealScheduleData(port);
  const rows = scheduleAvailable ? getSchedulesByMonthSlug(port, monthSlug) : [];
  const hero = getPortImage(port);

  return (
    <ContentPage
      title={`${portData.displayName} Cruise Schedule — ${monthName} ${year}`}
      lead={
        scheduleAvailable
          ? `Imported cruise ship calls for ${monthName} ${year}. Confirm latest all aboard times with your cruise line before booking excursions.`
          : `The ${portData.displayName} ${monthName} ${year} schedule page is live while CSV data is prepared.`
      }
      heroImage={hero.url}
      heroImageAlt={hero.alt}
      pagePath={shipScheduleMonthPath(port, monthSlug)}
      pageDescription={`${portData.displayName} cruise schedule for ${monthName} ${year}.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ship Schedules", href: shipScheduleHubPath },
        { label: portData.displayName, href: shipSchedulePortPath(port) },
        { label: `${monthName} ${year}` },
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
        <h2>
          {monthName} {year} ship calls
        </h2>
        {scheduleAvailable ? (
          <>
            <p className="text-sm text-slate-600">
              Showing {rows.length} published ship call{rows.length === 1 ? "" : "s"} for{" "}
              {portData.displayName} in {monthName} {year}.
            </p>
            <CruiseScheduleTable rows={rows} portSlug={port} />
          </>
        ) : (
          <CruiseScheduleComingSoon />
        )}
      </section>

      <RecommendedPortExcursions
        portSlug={port}
        portDisplayName={portData.displayName}
      />

      <section id="will-this-excursion-fit" className="!mt-0">
        <h2 className="sr-only">Will This Excursion Fit My Cruise?</h2>
        <WillThisExcursionFit defaultPortSlug={port} />
      </section>

      <ShipScheduleInternalLinks portSlug={port} portName={portData.displayName} />

      <section>
        <h2>Other months</h2>
        <ul className="card-grid grid gap-2 sm:grid-cols-2">
          {allScheduleMonthSlugs
            .filter((item) => item !== monthSlug)
            .map((item) => {
              const itemYear = parseScheduleMonthSlug(item)?.year ?? "2026";
              return (
              <li key={item}>
                <Link
                  href={shipScheduleMonthPath(port, item)}
                  className="content-link font-medium"
                >
                  {getScheduleMonthLabelFromSlug(item)} {itemYear}
                </Link>
              </li>
              );
            })}
        </ul>
      </section>
    </ContentPage>
  );
}
