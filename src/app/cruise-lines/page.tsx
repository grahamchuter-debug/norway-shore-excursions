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
        <section>
          <h2>How cruise lines experience Norway differently</h2>
          <p>
            Norway Shore Excursions is not affiliated with any cruise line. Each
            operator brings different ship sizes, passenger profiles and typical
            port lists to the fjords. MSC and P&O run busy classic fjord loops,
            Viking and Holland America favour longer in depth routes, while
            Princess, Royal Caribbean, Disney and NCL appear on select Northern
            Europe sailings in our 2026 schedule data.
          </p>
          <p>
            Select your cruise line below for ship schedules, Norway ports
            visited, recommended shore excursion styles and planning tools matched
            to how that line typically sails western Norway.
          </p>
        </section>

        <section>
          <h2>Choose Your Cruise Line</h2>
          <p>
            Select your operator for ship schedules, Norway ports visited,
            recommended shore excursion styles and planning tools matched to how
            that line typically sails western Norway.
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
                      {line.overview}
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

        <CruiseLineComparisonMatrix
          slugs={primaryNorwayComparisonSlugs}
          className="my-10"
        />

        {popularShips.length > 0 ? (
          <section>
            <h2>Ships Sailing Norway</h2>
            <p>
              Headline ships with busy 2026 Norway programmes in our schedule
              data. Each card opens the cruise line planning guide for that
              operator.
            </p>
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
            Enter your specific sailing into the{" "}
            <Link href="/norway-cruise-planner">Norway Cruise Planner™</Link> for
            personalised AI style recommendations across all ports.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
