import Link from "next/link";

import { CompareNorwayCruiseLines } from "@/components/compare-norway-cruise-lines";
import { ContentPage } from "@/components/content-page";
import { CruiseLineComparisonMatrix } from "@/components/cruise-line-comparison-matrix";
import { JsonLd } from "@/components/json-ld";
import { ShipCard } from "@/components/ship-card";
import { cruiseLines } from "@/lib/cruise-lines-data";
import { primaryNorwayComparisonSlugs } from "@/lib/cruise-line-comparison";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import { getPopularNorwayShipCards } from "@/lib/ships-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Cruise Lines Visiting Norway",
  description:
    "Independent planning guides for MSC, P&O, Princess, Royal Caribbean, Disney, NCL, Celebrity, Cunard, Viking and Holland America Norway cruises with 2026 ship schedule data.",
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
        lead="Independent planning guides for major cruise lines sailing Norway, with real 2026 ship call data where available."
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
        <CruiseLineComparisonMatrix
          slugs={primaryNorwayComparisonSlugs}
          className="my-10"
        />

        <section>
          <h2>Choose your cruise line</h2>
          <p>
            Independent guides with 2026 ship schedules, Norway ports and
            excursion planning tools. Not affiliated with any cruise line.
          </p>
          <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2">
            {cruiseLines.map((line) => {
              const stats = getCruiseLineScheduleSummary(line.scheduleKey);
              return (
                <li key={line.slug}>
                  <Link
                    href={`/cruise-lines/${line.slug}`}
                    className="premium-card block p-5 transition hover:border-[var(--glacier-blue)]"
                  >
                    <h3 className="text-lg font-bold text-slate-900">
                      {line.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {line.lead}
                    </p>
                    {stats.shipCount > 0 ? (
                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--glacier-blue)]">
                        {stats.shipCount}{" "}
                        {stats.shipCount === 1 ? "ship" : "ships"} ·{" "}
                        {stats.portCount}{" "}
                        {stats.portCount === 1 ? "port" : "ports"} ·{" "}
                        {stats.totalCalls} calls in 2026 data
                      </p>
                    ) : (
                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Planning guide
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {popularShips.length > 0 ? (
          <section>
            <h2>Ships Sailing Norway</h2>
            <p>Busy 2026 Norway programmes in our schedule data.</p>
            <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularShips.map((ship) => (
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
                    ctaLabel="View cruise line guide"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <Link href="/ships" className="content-link font-medium">
                Browse Norway ship schedule pages →
              </Link>
            </p>
          </section>
        ) : null}

        <CompareNorwayCruiseLines className="mt-10" />

        <section>
          <h2>Norway Cruise Planner</h2>
          <p>
            Enter your sailing in the{" "}
            <Link href="/norway-cruise-planner">Norway Cruise Planner™</Link> for
            port matched recommendations.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
