import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { interestThemeLinks, themes } from "@/lib/themes-data";
import { ports } from "@/lib/ports-data";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Shore Excursions",
  description:
    "National directory of Norway shore excursions by port and theme, fjords, glaciers, waterfalls, wildlife and Arctic tours for cruise passengers.",
  path: "/norway-shore-excursions",
  ogImage: siteImages.geiranger,
  ogImageAlt: imageAlts.geiranger,
});

const faqs = [
  {
    question: "Should I book ship excursions or independent tours in Norway?",
    answer:
      "Both are valid. Independent tours via local port sites often offer smaller groups. You are responsible for timely return either way.",
  },
  {
    question: "What is the most popular Norway shore excursion?",
    answer: "Stegastein Viewpoint (Flåm), Briksdal Glacier (Olden) and Geiranger viewpoint drives rank among the most booked experiences.",
  },
] as const;

export default function NorwayShoreExcursionsPage() {
  return (
    <>
      <JsonLd
        data={buildItemListSchema(
          themes.map((t) => ({ name: t.headline, description: t.lead })),
          "Norway shore excursion themes",
        )}
      />
      <ContentPage
        title="Norway Shore Excursions"
        lead="Browse shore excursions by theme and port, the national hub linking cruise passengers to independent local specialists across Norway."
        heroImage={siteImages.geiranger}
        heroImageAlt={imageAlts.geiranger}
        pagePath="/norway-shore-excursions"
        pageDescription={metadata.description as string}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shore Excursions" },
        ]}
        faqs={faqs}
      >
        <section>
          <h2>Excursions by theme</h2>
          <ul>
            {interestThemeLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Excursions by port</h2>
          <p>
            We cover {ports.length} cruise ports with authority pages and links
            to local booking guides. Start from{" "}
            <Link href="/norway-cruise-ports">Norway cruise ports</Link> or use
            the <Link href="/norway-cruise-planner">Cruise Planner</Link>.
          </p>
        </section>

        <section>
          <h2>Private and small group options</h2>
          <p>
            See{" "}
            <Link href="/private-shore-excursions-norway">
              private shore excursions
            </Link>{" "}
            and{" "}
            <Link href="/small-group-shore-excursions-norway">
              small group tours
            </Link>{" "}
            for alternatives to large ship coach programmes.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
