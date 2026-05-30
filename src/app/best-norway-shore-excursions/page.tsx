import Link from "next/link";

import { CompareNorwayCruisePorts } from "@/components/compare-norway-cruise-ports";
import { ContentPage } from "@/components/content-page";
import { DontWastePortDay } from "@/components/dont-waste-port-day";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildItemListSchema } from "@/lib/site-schema";
import { portBySlug, ports } from "@/lib/ports-data";
import { interestThemeLinks } from "@/lib/themes-data";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Best Norway Shore Excursions | Top Tours by Port & Theme",
  description:
    "Curated best Norway shore excursions by port and theme, Stegastein, Briksdal, Geiranger viewpoints, Mostraumen and Arctic highlights. Compare Norway cruise excursions by port.",
  path: "/best-norway-shore-excursions",
  ogImage: siteImages.geiranger,
  ogImageAlt: imageAlts.geiranger,
});

const bestTours = [
  { port: "flam", tour: "Stegastein Viewpoint", note: "Iconic fjord panorama" },
  { port: "flam", tour: "Fjord Cruise", note: "UNESCO Nærøyfjord waters" },
  { port: "bergen", tour: "Mostraumen Fjord Cruise", note: "Best from Bergen" },
  { port: "geiranger", tour: "Dalsnibba", note: "Summit view over Geirangerfjord" },
  { port: "olden", tour: "Briksdal Glacier", note: "Norway's favourite glacier tour" },
  { port: "eidfjord", tour: "Vøringsfossen", note: "Powerful waterfall platforms" },
  { port: "honningsvag", tour: "North Cape VIP", note: "Arctic bucket list" },
  { port: "tromso", tour: "Reindeer Sami Experience", note: "Arctic culture" },
] as const;

const faqs = [
  {
    question: "What is the single best Norway shore excursion?",
    answer:
      "There is no universal winner, Flåm viewpoints suit first timers; Olden glaciers suit adventure seekers; Honningsvåg suits Arctic routes.",
  },
  {
    question: "Are these tours bookable on this site?",
    answer:
      "We link to independent local port sites where you can explore operators. We are a planning authority, not a booking platform.",
  },
] as const;

export default function BestNorwayShoreExcursionsPage() {
  return (
    <>
      <JsonLd
        data={buildItemListSchema(
          bestTours.map((t) => ({
            name: t.tour,
            description: `${t.note}, ${portBySlug[t.port].displayName}`,
          })),
          "Best Norway shore excursions for cruise passengers",
        )}
      />
      <ContentPage
        title="Best Norway Shore Excursions"
        lead="Editorial picks across Norway's cruise ports, matched to scenery, timing and typical passenger priorities."
        heroImage={siteImages.geiranger}
        heroImageAlt={imageAlts.geiranger}
        pagePath="/best-norway-shore-excursions"
        pageDescription={metadata.description as string}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Best Tours" },
        ]}
        faqs={faqs}
        belowHero={
          <>
            <CompareNorwayCruisePorts />
            <DontWastePortDay compact />
          </>
        }
      >
        <section>
          <h2>Top excursions by port</h2>
          <ul>
            {bestTours.map((t) => (
              <li key={`${t.port}-${t.tour}`}>
                <strong>{t.tour}</strong> ({portBySlug[t.port].displayName}) , {" "}
                {t.note}.{" "}
                <Link href={`/ports/${t.port}`}>Port guide</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Best by interest</h2>
          <ul>
            {interestThemeLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>All ports</h2>
          <p>
            Browse all {ports.length} authority port pages on{" "}
            <Link href="/norway-cruise-ports">Norway cruise ports</Link>.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
