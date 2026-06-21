import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { NorwayCruiseCalendarClient } from "@/components/norway-cruise-calendar-client";
import { shipScheduleHubPath } from "@/lib/cruise-schedule-config";
import {
  buildGlobalScheduleInsights,
  getVerifiedScheduleRows,
  norwayCalendarFaqs,
} from "@/lib/schedule-insights";
import { buildPageMetadata } from "@/lib/site-metadata";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Calendar 2026–2027",
  description:
    "Norway cruise calendar with 2026 and 2027 busiest months, peak sailing days, port call totals and browse by ship, cruise line or port using verified schedule data.",
  path: "/norway-cruise-calendar",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

export default function NorwayCruiseCalendarPage() {
  const insights = buildGlobalScheduleInsights();
  const rows = getVerifiedScheduleRows();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Ship Schedules", href: shipScheduleHubPath },
    { label: "Norway Cruise Calendar" },
  ];

  const pageDescription = `Browse ${insights.totalCalls.toLocaleString("en-GB")} verified Norway cruise port calls by month, port, cruise line and ship.`;

  const schemas = [
    buildWebPageSchema({
      path: "/norway-cruise-calendar",
      title: "Norway Cruise Calendar",
      description: pageDescription,
    }),
    buildBreadcrumbSchema(breadcrumbs, "/norway-cruise-calendar"),
    buildFaqSchema(norwayCalendarFaqs),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <ContentPage
        title="Norway Cruise Calendar"
        lead={`Interactive calendar of verified Norway cruise ship activity. ${insights.totalCalls.toLocaleString("en-GB")} port calls across ${insights.portCount} ports in our ${insights.yearsAvailable.join(" and ")} database.`}
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath="/norway-cruise-calendar"
        pageDescription={pageDescription}
        breadcrumbs={breadcrumbs}
        faqs={norwayCalendarFaqs}
        ctaTitle="Plan shore excursions around your dates"
        ctaText="Match independent tours to your ship timetable with the Norway Cruise Planner."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Cruise Planner"
        relatedLinks={[
          { label: "Ship Schedules Hub", href: shipScheduleHubPath },
          { label: "Search by Ship", href: "/ship-schedules/search" },
          { label: "Cruise Lines", href: "/cruise-lines" },
          { label: "All Ships", href: "/ships" },
          { label: "When to Cruise Norway", href: "/when-to-cruise-norway" },
        ]}
      >
        <NorwayCruiseCalendarClient rows={rows} insights={insights} />
      </ContentPage>
    </>
  );
}
