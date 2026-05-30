import { ContentPage } from "@/components/content-page";
import { ShipScheduleHubCard } from "@/components/ship-schedule-hub-card";
import {
  cruiseScheduleDisclaimer,
  shipScheduleHubPath,
} from "@/lib/cruise-schedule-config";
import { getAllScheduleHubSummaries } from "@/lib/cruiseSchedules";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Ship Schedules 2026",
  description:
    "Master Norway cruise ship schedule hub for Flåm, Bergen, Stavanger, Eidfjord, Olden, Geiranger and Nordfjordeid. Real imported CSV data only — reusable by port sites.",
  path: shipScheduleHubPath,
});

export default function ShipSchedulesHubPage() {
  const portSummaries = getAllScheduleHubSummaries();

  return (
    <ContentPage
      title="Norway Cruise Ship Schedules 2026"
      lead="Central Norway schedule database for key cruise ports. Published ship calls come from approved CSV imports only — never sample or demo data. Individual port sites can reuse the same schedule files."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath={shipScheduleHubPath}
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ship Schedules" },
      ]}
      ctaTitle="Plan excursions with confidence"
      ctaText="Use the Norway Cruise Planner and Will This Excursion Fit My Cruise? tool with your ship times."
      ctaHref="/norway-cruise-planner"
      ctaButtonLabel="Open Cruise Planner"
    >
      <section>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {cruiseScheduleDisclaimer}
        </p>
      </section>

      <section>
        <h2>2026 schedules by port</h2>
        <p className="mb-4 text-sm text-slate-600">
          Sample schedule data must never be used on live production schedule pages.
          Ports without a real CSV show a coming soon message instead of placeholder ship calls.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {portSummaries.map((summary) => (
            <ShipScheduleHubCard key={summary.portSlug} summary={summary} />
          ))}
        </div>
      </section>
    </ContentPage>
  );
}
