import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { PortCard } from "@/components/port-card";
import { cruiseLineBySlug, cruiseLineSlugs } from "@/lib/cruise-lines-data";
import { portBySlug } from "@/lib/ports-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { siteImages, imageAlts } from "@/lib/site-images";

type CruiseLinePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return cruiseLineSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CruiseLinePageProps) {
  const { slug } = await params;
  const line = cruiseLineBySlug[slug];
  if (!line) return {};

  return buildPageMetadata({
    title: line.headline,
    description: line.metaDescription,
    path: `/cruise-lines/${slug}`,
    ogImage: siteImages.hero,
    ogImageAlt: imageAlts.hero,
  });
}

export default async function CruiseLinePage({ params }: CruiseLinePageProps) {
  const { slug } = await params;
  const line = cruiseLineBySlug[slug];
  if (!line) notFound();

  const itemList = buildItemListSchema(
    line.recommendedPortSlugs.map((s) => {
      const port = portBySlug[s];
      return {
        name: port.displayName,
        description: port.bestFor,
      };
    }),
    `Recommended Norway ports for ${line.shortName} passengers`,
  );

  return (
    <>
      <JsonLd data={itemList} />
      <ContentPage
        title={line.headline}
        lead={line.lead}
        heroImage={siteImages.hero}
        heroImageAlt={imageAlts.hero}
        pagePath={`/cruise-lines/${slug}`}
        pageDescription={line.metaDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Lines", href: "/cruise-lines" },
          { label: line.shortName },
        ]}
        faqs={line.faqs}
        ctaTitle="Build your Norway excursion plan"
        ctaText="Use the Norway Cruise Planner for smart, rules based recommendations matched to your ports and interests."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Norway Cruise Planner"
        relatedLinks={line.recommendedPortSlugs.map((s) => ({
          label: portBySlug[s].displayName,
          href: `/ports/${s}`,
        }))}
        relatedSectionTitle="Key Norway ports for this cruise line"
      >
        <section>
          <h2>Independent shore excursion planning guide</h2>
          <p>
            This page helps {line.name} passengers plan Norway shore excursions
            independently. We are not affiliated with {line.name} and do not
            represent ship sponsored tour programmes.
          </p>
        </section>

        <section>
          <h2>How {line.shortName} passengers can plan Norway excursions</h2>
          <ul>
            {line.planningTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Recommended Norway cruise ports</h2>
          <div className="not-prose -mx-2 grid gap-4 sm:grid-cols-2">
            {line.recommendedPortSlugs.map((s) => (
              <PortCard key={s} port={portBySlug[s]} />
            ))}
          </div>
        </section>

        <section>
          <h2>Norway Cruise Planner</h2>
          <p>
            Enter your {line.shortName} itinerary into our{" "}
            <Link href="/norway-cruise-planner">Norway Cruise Planner™</Link> for
            personalised AI style recommendations with cruise fit scores and
            return to ship confidence labels.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
