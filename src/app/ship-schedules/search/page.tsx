import { Suspense } from "react";

import { ShipScheduleSearch } from "@/components/ship-schedule-search";
import { ContentPage } from "@/components/content-page";
import {
  cruiseScheduleDisclaimer,
  shipScheduleHubPath,
  shipScheduleSearchPath,
} from "@/lib/cruise-schedule-config";
import { buildShipScheduleSearchIndex } from "@/lib/cruiseSchedules";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Find Your Cruise Ship in Norway 2026",
  description:
    "Search Norway cruise ship schedules by ship name and find port calls, arrival times, departure times and recommended shore excursions.",
  path: shipScheduleSearchPath,
});

export default function ShipScheduleSearchPage() {
  const searchIndex = buildShipScheduleSearchIndex();

  return (
    <ContentPage
      title="Find Your Cruise Ship in Norway"
      lead="Search your cruise ship to see published Norway port calls, arrival times, departure times and recommended excursions."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath={shipScheduleSearchPath}
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ship Schedules", href: shipScheduleHubPath },
        { label: "Search by Ship" },
      ]}
      ctaTitle="Plan excursions with confidence"
      ctaText="Use the Norway Cruise Planner to match shore excursions to your ship timetable."
      ctaHref="/norway-cruise-planner"
      ctaButtonLabel="Open Cruise Planner"
    >
      <section>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {cruiseScheduleDisclaimer}
        </p>
      </section>

      <Suspense fallback={null}>
        <ShipScheduleSearch entries={searchIndex} />
      </Suspense>
    </ContentPage>
  );
}
