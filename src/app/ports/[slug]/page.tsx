import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { WillThisExcursionFit } from "@/components/will-this-excursion-fit";
import {
  getScheduleMonthLabelFromSlug,
  scheduledPortSlugs,
  scheduleMonthSlugs2026,
  shipScheduleHubPath,
  shipScheduleMonthPath,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import { hasRealScheduleData } from "@/lib/cruiseSchedules";
import { buildItemListSchema } from "@/lib/site-schema";
import { portBySlug, portSlugs } from "@/lib/ports-data";
import { getPortImage } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";

type PortPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return portSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PortPageProps) {
  const { slug } = await params;
  const port = portBySlug[slug];
  if (!port) return {};

  const img = getPortImage(slug);
  return buildPageMetadata({
    title: `${port.displayName} Cruise Port Shore Excursions`,
    description: `Independent ${port.displayName} cruise port guide with shore excursion recommendations, return to ship tips and link to local specialists.`,
    path: `/ports/${slug}`,
    ogImage: img.url,
    ogImageAlt: img.alt,
  });
}

export default async function PortPage({ params }: PortPageProps) {
  const { slug } = await params;
  const port = portBySlug[slug];
  if (!port) notFound();

  const img = getPortImage(slug);
  const isScheduledPort = scheduledPortSlugs.includes(
    slug as (typeof scheduledPortSlugs)[number],
  );
  const hasImportedSchedule = hasRealScheduleData(slug);
  const itemList = buildItemListSchema(
    port.sampleTours.map((t) => ({
      name: t.name,
      description: t.description,
    })),
    `Recommended ${port.displayName} shore excursions`,
  );

  return (
    <>
      <JsonLd data={itemList} />
      <ContentPage
        title={`${port.displayName} Cruise Port`}
        lead={port.intro}
        heroImage={img.url}
        heroImageAlt={img.alt}
        pagePath={`/ports/${slug}`}
        pageDescription={`${port.displayName} shore excursion authority page for cruise passengers.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Ports", href: "/norway-cruise-ports" },
          { label: port.displayName },
        ]}
        faqs={port.faqs}
        ctaTitle={`Plan ${port.displayName} shore excursions`}
        ctaText={`Explore independently operated tours via the local ${port.displayName} specialist site.`}
        ctaHref={port.localSiteUrl}
        ctaButtonLabel={`Visit ${port.displayName} local site`}
        relatedLinks={[
          { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
          { label: "All cruise ports", href: "/norway-cruise-ports" },
          { label: "Return to ship guide", href: "/return-to-ship-guide" },
          ...(isScheduledPort
            ? [{ label: `${port.displayName} ship schedules`, href: shipSchedulePortPath(slug) }]
            : []),
        ]}
      >
        <section>
          <h2>Best excursions in {port.displayName}</h2>
          <p>
            Headline tour: <strong>{port.heroTour}</strong>. Also consider{" "}
            {port.secondaryTours.join(", ")}.
          </p>
          <ul>
            {port.sampleTours.map((tour) => (
              <li key={tour.name}>
                <strong>{tour.name}</strong>, {tour.description}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Who {port.displayName} is best for</h2>
          <p>{port.whoBestFor}</p>
          <p>
            <strong>Best for:</strong> {port.bestFor}
          </p>
        </section>

        <section>
          <h2>Typical time needed</h2>
          <p>{port.typicalTimeNeeded}</p>
          <p>
            <strong>Minimum suggested port time:</strong> {port.minimumPortTime}
          </p>
          <p>
            <strong>Typical difficulty:</strong>{" "}
            {port.difficulty.charAt(0).toUpperCase() + port.difficulty.slice(1)}
          </p>
        </section>

        <section className="!mt-0">
          <WillThisExcursionFit defaultPortSlug={slug} />
        </section>

        {isScheduledPort ? (
          <section>
            <h2>{port.displayName} cruise ship schedule</h2>
            <p>
              {hasImportedSchedule
                ? `Published 2026 arrival times for ${port.displayName} are available from approved CSV imports. Pick a month to plan shore excursions around your ship's port call.`
                : `The ${port.displayName} 2026 schedule hub is live while CSV data is prepared. Monthly pages show a coming soon message until real ship calls are imported.`}
            </p>
            <p>
              <Link href={shipSchedulePortPath(slug)} className="content-link font-medium">
                View {port.displayName} schedule hub
              </Link>
              {" · "}
              <Link href={shipScheduleHubPath} className="content-link font-medium">
                All Norway ship schedules
              </Link>
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {scheduleMonthSlugs2026.map((monthSlug) => (
                <li key={monthSlug}>
                  <Link
                    href={shipScheduleMonthPath(slug, monthSlug)}
                    className="content-link font-medium"
                  >
                    {getScheduleMonthLabelFromSlug(monthSlug)} 2026 schedule
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>Cruise passenger tips</h2>
          <ul>
            {port.cruiseTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <p>{port.cruiseFitNotes}</p>
        </section>

        <section>
          <h2>Local {port.displayName} shore excursion site</h2>
          <p>
            For detailed tour listings and port specific planning, visit the
            independent local specialist at{" "}
            <a href={port.localSiteUrl} target="_blank" rel="noopener noreferrer">
              {port.localSiteUrl.replace("https://", "")}
            </a>
            . Norway Shore Excursions is a national planning authority, not a
            booking agent.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
