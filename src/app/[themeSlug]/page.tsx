import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { PortCard } from "@/components/port-card";
import { themeBySlug, themeSlugs } from "@/lib/themes-data";
import { portBySlug } from "@/lib/ports-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { getThemeImage } from "@/lib/site-images";

type ThemePageProps = {
  params: Promise<{ themeSlug: string }>;
};

export async function generateStaticParams() {
  return themeSlugs.map((themeSlug) => ({ themeSlug }));
}

export async function generateMetadata({ params }: ThemePageProps) {
  const { themeSlug } = await params;
  const theme = themeBySlug[themeSlug];
  if (!theme) return {};

  const img = getThemeImage(themeSlug);
  return buildPageMetadata({
    title: theme.title,
    description: theme.metaDescription,
    path: `/${themeSlug}`,
    ogImage: img.url,
    ogImageAlt: img.alt,
  });
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { themeSlug } = await params;
  const theme = themeBySlug[themeSlug];
  if (!theme) notFound();

  const img = getThemeImage(themeSlug);
  const itemList = buildItemListSchema(
    theme.tourExamples.map((t) => ({
      name: t.name,
      description: t.description,
    })),
    theme.headline,
  );

  return (
    <>
      <JsonLd data={itemList} />
      <ContentPage
        title={theme.headline}
        lead={theme.lead}
        heroImage={img.url}
        heroImageAlt={img.alt}
        pagePath={`/${themeSlug}`}
        pageDescription={theme.metaDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shore Excursions", href: "/norway-shore-excursions" },
          { label: theme.headline },
        ]}
        faqs={theme.faqs}
        relatedLinks={theme.recommendedPortSlugs.map((s) => ({
          label: portBySlug[s].displayName,
          href: `/ports/${s}`,
        }))}
        relatedSectionTitle="Recommended Norway cruise ports"
      >
        <section>
          <h2>About this excursion theme</h2>
          {theme.explanation.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>

        <section>
          <h2>Recommended ports</h2>
          <div className="not-prose -mx-2 grid gap-4 sm:grid-cols-2">
            {theme.recommendedPortSlugs.map((s) => (
              <PortCard key={s} port={portBySlug[s]} />
            ))}
          </div>
        </section>

        <section>
          <h2>Suitable tour examples</h2>
          <ul>
            {theme.tourExamples.map((t) => (
              <li key={`${t.portSlug}-${t.name}`}>
                <strong>{t.name}</strong> ({portBySlug[t.portSlug].displayName}) , {" "}
                {t.description}. Book via{" "}
                <a
                  href={portBySlug[t.portSlug].localSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  local {portBySlug[t.portSlug].displayName} site
                </a>
                .
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Plan with the Norway Cruise Planner</h2>
          <p>
            Match this theme to your actual itinerary using the{" "}
            <Link href="/norway-cruise-planner">Norway Cruise Planner™</Link> , 
            a smart personalised planning tool with cruise fit scores.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
