import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { cruiseLines } from "@/lib/cruise-lines-data";
import { getCruiseLineScheduleSummary } from "@/lib/cruise-line-schedules";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Cruise Lines Visiting Norway",
  description:
    "Independent planning guides for MSC, P&O, Celebrity, Cunard, Viking and Holland America Norway cruises with 2026 ship schedule data.",
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
          { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
          { label: "Ship Schedules", href: "/ship-schedules" },
          { label: "Norway Cruise Ports", href: "/norway-cruise-ports" },
          { label: "Shore Excursions", href: "/norway-shore-excursions" },
        ]}
        relatedSectionTitle="Plan your Norway cruise"
      >
        <section>
          <h2>Independent planning, not official partnerships</h2>
          <p>
            Norway Shore Excursions is not affiliated with any cruise line. These
            guides help passengers understand typical Norway itineraries, show
            real ship call data where available, and link to local port
            specialists for independent booking.
          </p>
        </section>

        <section>
          <h2>Major cruise lines in Norway</h2>
          <p>
            Select your cruise line for ship schedules, Norway ports visited,
            recommended shore excursions and planning tools.
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
