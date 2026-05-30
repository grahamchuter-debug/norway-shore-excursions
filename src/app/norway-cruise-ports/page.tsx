import { ContentPage } from "@/components/content-page";
import { CompareNorwayCruisePorts } from "@/components/compare-norway-cruise-ports";
import { PlannerPromoBanner } from "@/components/planner/planner-promo-banner";
import { norwayDestinationConfig } from "@/lib/destination-config";
import { NorwayCruiseMap } from "@/components/norway-cruise-map";
import { PortsGrid } from "@/components/ports-grid";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";
import { ports } from "@/lib/ports-data";
import { buildItemListSchema } from "@/lib/site-schema";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Ports | Compare Shore Excursions by Port",
  description:
    "Complete guide to Norway cruise ports, compare Norway cruise ports, shore excursions by port, time needed and activity level from Flåm and Geiranger to Tromsø and Honningsvåg.",
  path: "/norway-cruise-ports",
  ogImage: siteImages.sognefjord,
  ogImageAlt: imageAlts.sognefjord,
});

const faqs = [
  {
    question: "How many cruise ports does Norway have?",
    answer: `Major cruise itineraries regularly visit ${ports.length}+ ports on our authority site, from southern Kristiansand to Arctic Honningsvåg.`,
  },
  {
    question: "Which Norway ports are UNESCO fjords?",
    answer:
      "Geiranger, Flåm (Nærøyfjord branch) and surrounding fjord transit routes are UNESCO listed waters on many sailings.",
  },
] as const;

export default function NorwayCruisePortsPage() {
  return (
    <>
      <JsonLd
        data={buildItemListSchema(
          ports.map((p) => ({ name: p.displayName, description: p.bestFor })),
          "Norway cruise ports directory",
        )}
      />
      <ContentPage
        title="Norway Cruise Ports"
        lead="Authority port guides for every major Norway cruise stop, compare ports, explore the Norway Cruise Map and book shore excursions via local specialists."
        heroImage={siteImages.sognefjord}
        heroImageAlt={imageAlts.sognefjord}
        pagePath="/norway-cruise-ports"
        pageDescription={metadata.description as string}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Ports" },
        ]}
        faqs={faqs}
        belowHero={
          <>
            <PlannerPromoBanner config={norwayDestinationConfig} />
            <CompareNorwayCruisePorts showAll />
            <NorwayCruiseMap variant="secondary" showFooterLink={false} />
            <PortsGrid />
          </>
        }
      >
        <section>
          <h2>Planning by region</h2>
          <p>
            Western fjord ports, Flåm, Geiranger, Olden and Bergen, dominate
            summer itineraries. Arctic ports Tromsø and Honningsvåg anchor
            northern lights and North Cape routes. Trondheim and Kristiansand
            add cultural variety on repositioning sailings.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
