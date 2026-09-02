import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { WillThisExcursionFit } from "@/components/will-this-excursion-fit";
import {
  parseScheduleMonthSlug,
  scheduledPortSlugs,
  shipScheduleHubPath,
  shipScheduleMonthPath,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import { getScheduleHubPortSummary, hasRealScheduleData } from "@/lib/cruiseSchedules";
import { getPortScheduleInsights } from "@/lib/schedule-insights";
import { buildItemListSchema } from "@/lib/site-schema";
import { portBySlug, portSlugs } from "@/lib/ports-data";
import { getRelatedPorts } from "@/lib/related-ports";
import { getPortImage } from "@/lib/site-images";
import { buildPageMetadata } from "@/lib/site-metadata";
import {
  getPortRecommendedExcursions,
  usesFallbackExcursionCards,
} from "@/lib/port-recommended-excursions";

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
  const scheduleSummary = isScheduledPort ? getScheduleHubPortSummary(slug) : null;
  const scheduleInsights = hasImportedSchedule ? getPortScheduleInsights(slug) : null;
  const yearsLabel =
    scheduleInsights?.yearsAvailable.join(" and ") ?? "2026 and 2027";
  const itemList = buildItemListSchema(
    port.sampleTours.map((t) => ({
      name: t.name,
      description: t.description,
    })),
    `Recommended ${port.displayName} shore excursions`,
  );
  const relatedPorts = getRelatedPorts(slug);
  const recommended = getPortRecommendedExcursions(slug);
  const usesFallback = usesFallbackExcursionCards(slug);

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
        ctaTitle={`Explore the ${port.displayName} local guide`}
        ctaText={`Continue to the dedicated ${port.displayName} port site for deeper day-ashore detail and excursion ideas.`}
        ctaHref={port.localSiteUrl}
        ctaButtonLabel={`Explore ${port.displayName} local guide`}
        relatedLinks={[
          { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
          { label: "All cruise ports", href: "/norway-cruise-ports" },
          { label: "Return to ship guide", href: "/return-to-ship-guide" },
          { label: "Norway cruise calendar", href: "/norway-cruise-calendar" },
          { label: "Cruise lines", href: "/cruise-lines" },
          { label: "All ships", href: "/ships" },
          ...(isScheduledPort
            ? [{ label: `${port.displayName} ship schedules`, href: shipSchedulePortPath(slug) }]
            : []),
        ]}
      >
        <section>
          <h2>What makes {port.displayName} distinctive</h2>
          <p>{port.whoBestFor}</p>
          <p>
            <strong>Best for:</strong> {port.bestFor}
          </p>
        </section>

        <section>
          <h2>Shore excursion ideas</h2>
          <p>
            National summary only; not a full duplicate of the local destination
            site. Headline focus: <strong>{port.heroTour}</strong>. Also consider{" "}
            {port.secondaryTours.join(", ")}.
          </p>
          <ul>
            {port.sampleTours.map((tour) => (
              <li key={tour.name}>
                <strong>{tour.name}</strong>, {tour.description}
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-3">
            {recommended.map((card) => (
              <li key={`${card.title}-${card.url}`}>
                <a
                  href={card.url}
                  {...(card.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="font-semibold"
                >
                  {card.title}
                </a>
                <span className="block text-sm text-slate-600">{card.benefit}</span>
                <span className="text-sm font-medium text-[var(--fjord)]">
                  {card.ctaLabel}
                </span>
              </li>
            ))}
          </ul>
          {usesFallback ? (
            <p className="text-sm text-slate-600">
              Curated deep tour links are not listed here yet. Use the local{" "}
              {port.displayName} guide for current excursion detail.
            </p>
          ) : null}
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
                ? `Published arrival times for ${port.displayName} are available from approved CSV imports across ${yearsLabel}. Pick a month to plan shore excursions around your ship's port call.`
                : `The ${port.displayName} schedule hub is live while CSV data is prepared. Monthly pages show a coming soon message until real ship calls are imported.`}
            </p>
            <p>
              <Link href={shipSchedulePortPath(slug)} className="content-link font-medium">
                View {port.displayName} schedule hub
              </Link>
              {" · "}
              <Link href={shipScheduleHubPath} className="content-link font-medium">
                All Norway ship schedules
              </Link>
              {" · "}
              <Link href="/norway-cruise-planner" className="content-link font-medium">
                Cruise planner
              </Link>
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {(scheduleSummary?.months ?? []).map((monthSummary) => {
                const year = parseScheduleMonthSlug(monthSummary.slug)?.year ?? "2026";
                return (
                <li key={monthSummary.slug}>
                  <Link
                    href={shipScheduleMonthPath(slug, monthSummary.slug)}
                    className="content-link font-medium"
                  >
                    {monthSummary.label} {year} schedule
                    {monthSummary.shipCallCount != null
                      ? ` · ${monthSummary.shipCallCount} calls`
                      : ""}
                  </Link>
                </li>
                );
              })}
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

        {relatedPorts.length > 0 ? (
          <section>
            <h2>Related Norway ports</h2>
            <ul>
              {relatedPorts.map((item) => (
                <li key={item.slug}>
                  <Link href={`/ports/${item.slug}`} className="font-semibold">
                    {portBySlug[item.slug]?.displayName ?? item.slug}
                  </Link>
                  <span className="block text-sm text-slate-600">{item.reason}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>Local {port.displayName} shore excursion guide</h2>
          <p>
            For deeper day-ashore detail, visit the dedicated local guide at{" "}
            <a href={port.localSiteUrl} target="_blank" rel="noopener noreferrer">
              {port.localSiteUrl.replace("https://", "")}
            </a>
            . This national site summarises the port and routes you onward. It is
            not a booking checkout.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
