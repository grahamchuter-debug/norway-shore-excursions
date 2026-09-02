import { ContentPage } from "@/components/content-page";
import { CruisePlanningTools } from "@/components/cruise-planning-tools";
import { JsonLd } from "@/components/json-ld";
import { ShipCard } from "@/components/ship-card";
import { shipScheduleSearchPath } from "@/lib/cruise-schedule-config";
import { shipCardBadgeInputFromSummary } from "@/lib/ship-card-badges";
import { buildShipScheduleSummaries } from "@/lib/ship-schedules";
import { getAuthorityShipSlugs } from "@/lib/ship-authority";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Ships",
  description:
    "Norway cruise ship guides with 2026–2027 port schedules, passenger capacity, ports visited and independent shore excursion planning.",
  path: "/ships",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

const faqs = [
  {
    question: "How are Norway cruise ships listed here?",
    answer:
      "Ships appear when they have published Norway port calls in our imported 2026–2027 schedule database for verified ports.",
  },
  {
    question: "Where does passenger capacity come from?",
    answer:
      "Capacity figures come from our manual ship capacity lookup when published. If unknown, we show Not published rather than guessing.",
  },
  {
    question: "Can I search for my exact sailing?",
    answer:
      "Yes. Use ship search to filter calls by ship name, then open monthly port schedules for arrival and departure times.",
  },
] as const;

export default function ShipsHubPage() {
  const summaries = buildShipScheduleSummaries();
  const authoritySet = new Set(getAuthorityShipSlugs());
  const authority = summaries.filter((s) => authoritySet.has(s.slug));
  const other = summaries.filter((s) => !authoritySet.has(s.slug));

  const itemList = buildItemListSchema(
    summaries.slice(0, 20).map((s) => ({
      name: s.ship,
      description: `${s.callCount} Norway port calls in schedule data · ${s.cruiseLine}`,
    })),
    "Norway cruise ships with verified schedule data",
  );

  return (
    <>
      <JsonLd data={itemList} />
      <ContentPage
        title="Norway Cruise Ships"
        lead="Ship guides drawn from verified 2026–2027 Norway port call data: capacity, schedules, ports visited and excursion planning tools."
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath="/ships"
        pageDescription={metadata.description as string}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Ships" },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Search by Ship", href: shipScheduleSearchPath },
          { label: "Norway Cruise Calendar", href: "/norway-cruise-calendar" },
          { label: "Cruise Lines", href: "/cruise-lines" },
          { label: "Ship Schedules", href: "/ship-schedules" },
          { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
        ]}
        ctaTitle="Plan your port days"
        ctaText="Match excursions to your ship timetable with the Norway Cruise Planner."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open cruise planner"
      >
        <section>
          <h2>Top Norway cruise ships</h2>
          <p>
            The 20 busiest ships in our combined 2026–2027 schedule data receive
            enhanced authority guides with itinerary patterns, schedule insights
            and port-by-port excursion planning.
          </p>
          <ul className="card-grid mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authority.map((ship) => (
              <li key={ship.slug}>
                <ShipCard
                  slug={ship.slug}
                  shipName={ship.ship}
                  cruiseLine={ship.cruiseLine}
                  capacityLabel={ship.capacityLabel}
                  callCount={ship.callCount}
                  topPortsLabel={ship.topPorts
                    .slice(0, 3)
                    .map((p) => p.portDisplayName)
                    .join(", ")}
                  badgeInput={shipCardBadgeInputFromSummary(ship)}
                  href={`/ships/${ship.slug}`}
                  priority
                />
              </li>
            ))}
          </ul>
        </section>

        {other.length > 0 ? (
          <section>
            <h2>More ships in Norway schedule data</h2>
            <ul className="card-grid mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {other.map((ship) => (
                <li key={ship.slug}>
                  <ShipCard
                    slug={ship.slug}
                    shipName={ship.ship}
                    cruiseLine={ship.cruiseLine}
                    capacityLabel={ship.capacityLabel}
                    callCount={ship.callCount}
                    topPortsLabel={ship.topPorts
                      .slice(0, 3)
                      .map((p) => p.portDisplayName)
                      .join(", ")}
                    badgeInput={shipCardBadgeInputFromSummary(ship)}
                    href={`/ships/${ship.slug}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>Cruise planning tools</h2>
          <CruisePlanningTools />
        </section>
      </ContentPage>
    </>
  );
}
