import Link from "next/link";

import { CompareNorwayCruiseLines } from "@/components/compare-norway-cruise-lines";
import { ContentPage } from "@/components/content-page";
import { CruiseLineHubGrid } from "@/components/cruise-line-hub-grid";
import { CruiseLineHubPlanDashboard } from "@/components/cruise-line-hub-plan-dashboard";
import { FindYourShip } from "@/components/find-your-ship";
import { JsonLd } from "@/components/json-ld";
import { ShipCard } from "@/components/ship-card";
import { cruiseLines } from "@/lib/cruise-lines-data";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import { buildFindYourShipEntries } from "@/lib/find-your-ship";
import { getPopularNorwayShipCards } from "@/lib/ships-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Cruise Lines Visiting Norway",
  description:
    "Independent Norway planning dashboards for MSC, P&O, Princess, Cunard, Celebrity, Holland America, Royal Caribbean, Disney, NCL and Viking with 2026 ship schedule data.",
  path: "/cruise-lines",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

const faqs = [
  {
    question: "Are these official cruise line excursion pages?",
    answer: "No. Each page is an independent shore excursion planning guide with no partnership or endorsement from the cruise line named.",
  },
  {
    question: "Where does the ship schedule data come from?",
    answer: "Ship counts and port lists are pulled from our imported 2026 Norway cruise schedule database for ports with verified data.",
  },
  {
    question: "Can I use these guides if I booked through any travel agent?",
    answer: "Yes. The port and theme advice applies to all passengers regardless of how the cruise was booked.",
  },
] as const;

export default function CruiseLinesPage() {
  const findYourShipEntries = buildFindYourShipEntries();
  const popularShips = getPopularNorwayShipCards();

  const itemList = buildItemListSchema(
    cruiseLines.map((line) => {
      const stats = getCruiseLineScheduleSummary(line.scheduleKey);
      const shipNote =
        stats.shipCount > 0
          ? `${stats.shipCount} ships tracked in 2026 schedule data`
          : "Norway planning guide";
      return {
        name: line.headline,
        description: shipNote,
      };
    }),
    "Major cruise lines visiting Norway",
  );

  return (
    <>
      <JsonLd data={itemList} />
      <ContentPage
        title="Cruise Lines Visiting Norway"
        lead="Visual planning dashboards for every major operator sailing Norway, with 2026 ship call data where available."
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath="/cruise-lines"
        pageDescription={metadata.description as string}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Lines" },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Cruise Ships", href: "/ships" },
          { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
          { label: "Ship Schedules", href: "/ship-schedules" },
          { label: "Norway Cruise Ports", href: "/norway-cruise-ports" },
          { label: "Shore Excursions", href: "/norway-shore-excursions" },
        ]}
        relatedSectionTitle="Plan your Norway cruise"
      >
        <FindYourShip ships={findYourShipEntries} className="my-10" />

        <section className="my-10">
          <h2>Choose your cruise line</h2>
          <p>
            Open a line dashboard for schedules, ports, ships and excursion tools.
            Not affiliated with any cruise line.
          </p>
          <CruiseLineHubGrid lines={cruiseLines} className="mt-6" />
        </section>

        {popularShips.length > 0 ? (
          <section className="my-10">
            <h2>Popular ships sailing Norway</h2>
            <p>Iona, Queen Anne, MSC Euribia, Sky Princess and Celebrity Apex in our data.</p>
            <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularShips.map((ship, index) => (
                <li key={ship.slug}>
                  <ShipCard
                    slug={ship.slug}
                    shipName={ship.ship}
                    cruiseLine={ship.cruiseLine}
                    capacityLabel={ship.capacityLabel}
                    callCount={ship.callCount}
                    topPortsLabel={ship.topPortsLabel}
                    typicalCruiseLengthLabel={ship.typicalCruiseLengthLabel}
                    badgeInput={ship.badgeInput}
                    href={ship.href}
                    variant={index === 0 ? "featured" : "default"}
                    ctaLabel="View cruise line guide"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/ships" className="content-link font-medium">
                Browse Norway ship schedule pages →
              </Link>
            </p>
          </section>
        ) : null}

        <CompareNorwayCruiseLines className="my-10" />

        <CruiseLineHubPlanDashboard className="my-10" />
      </ContentPage>
    </>
  );
}
