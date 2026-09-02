import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { ShipScheduleHubCard } from "@/components/ship-schedule-hub-card";
import {
  cruiseScheduleDisclaimer,
  shipScheduleHubPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { getScheduleHubSummariesByRegion } from "@/lib/cruiseSchedules";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Ship Schedules 2026–2027",
  description:
    "Master Norway cruise ship schedule hub for 15 ports across fjord, coastal, Arctic and southern Norway. Verified 2026 and 2027 CSV imports only.",
  path: shipScheduleHubPath,
});

export default function ShipSchedulesHubPage() {
  const regionGroups = getScheduleHubSummariesByRegion();

  return (
    <ContentPage
      title="Norway Cruise Ship Schedules"
      lead="Central Norway schedule database for key cruise ports. Published ship calls come from approved CSV imports for 2026 and 2027, never sample or demo data."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath={shipScheduleHubPath}
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ship Schedules" },
      ]}
      ctaTitle="Match excursions to your ship times"
      ctaText="Use the Norway Cruise Planner and Will This Excursion Fit My Cruise? tool with your ship times."
      ctaHref="/norway-cruise-planner"
      ctaButtonLabel="Open cruise planner"
      relatedLinks={[
        { label: "Norway Cruise Calendar", href: "/norway-cruise-calendar" },
        { label: "Search by Ship", href: shipScheduleSearchPath },
        { label: "Cruise Lines", href: "/cruise-lines" },
        { label: "All Ships", href: "/ships" },
      ]}
    >
      <section>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {cruiseScheduleDisclaimer}
        </p>
      </section>

      <section>
        <div className="rounded-2xl border border-[var(--border-light)] bg-surface-muted p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--navy-deep)]">Search by ship name</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Look up your cruise ship across all published Norway port calls, then jump to the
              matching schedule and excursion guides.
            </p>
          </div>
          <Link
            href={shipScheduleSearchPath}
            className="btn-primary mt-4 inline-flex shrink-0 sm:mt-0"
          >
            Search by Ship
          </Link>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-[var(--border-light)] bg-surface-muted p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--navy-deep)]">Norway Cruise Calendar</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Browse verified port calls by month, port, cruise line and ship. See peak months and
              busiest cruise days across all Norway schedules.
            </p>
          </div>
          <Link
            href="/norway-cruise-calendar"
            className="btn-primary mt-4 inline-flex shrink-0 sm:mt-0"
          >
            Open Cruise Calendar
          </Link>
        </div>
      </section>

      <section>
        <h2>Schedules by port</h2>
        <p className="mb-4 text-sm text-slate-600">
          Sample schedule data must never be used on live production schedule pages.
          Ports without a real CSV show a coming soon message instead of placeholder ship calls.
        </p>
        <div className="space-y-10">
          {regionGroups.map((group) => (
            <div key={group.region}>
              <h3 className="mb-4 text-lg font-bold text-[var(--navy-deep)]">
                {group.region}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.ports.map((summary) => (
                  <ShipScheduleHubCard key={summary.portSlug} summary={summary} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </ContentPage>
  );
}
