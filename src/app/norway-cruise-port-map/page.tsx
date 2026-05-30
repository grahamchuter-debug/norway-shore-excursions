import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { NorwayCruiseMap } from "@/components/norway-cruise-map";
import { PortsGrid } from "@/components/ports-grid";
import { PlannerPromoBanner } from "@/components/planner/planner-promo-banner";
import { classicFjordsRoutePorts } from "@/lib/map-data";
import { norwayDestinationConfig } from "@/lib/destination-config";
import { buildPageMetadata } from "@/lib/site-metadata";
import { ports } from "@/lib/ports-data";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Port Map | Visual Port Explorer",
  description:
    "Optional Norway cruise port map for browsing fjord, glacier and Arctic ports. Start with the Norway Cruise Planner for personalised shore excursion recommendations.",
  path: "/norway-cruise-port-map",
  ogImage: siteImages.sognefjord,
  ogImageAlt: imageAlts.sognefjord,
});

const faqs = [
  {
    question: "Which Norway cruise ports are in the Arctic?",
    answer:
      "Honningsvåg (North Cape gateway) and Tromsø lie above the Arctic Circle on many northern itineraries.",
  },
  {
    question: "Are Geiranger and Hellesylt the same port?",
    answer:
      "No. They are separate villages at opposite ends of Geirangerfjord; some ships visit one, both, or sail the fjord between them.",
  },
] as const;

export default function NorwayCruisePortMapPage() {
  return (
    <ContentPage
      title="Norway Cruise Port Map"
      lead="Optional visual explorer for Norway cruise ports. For personalised excursion recommendations, start with the Norway Cruise Planner."
      heroImage={siteImages.sognefjord}
      heroImageAlt={imageAlts.sognefjord}
      pagePath="/norway-cruise-port-map"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Port Map" },
      ]}
      faqs={faqs}
      ctaTitle="Want personalised port recommendations?"
      ctaText="The Norway Cruise Planner matches your itinerary and traveller style to shore excursions with Cruise Match scores."
      ctaHref="/norway-cruise-planner"
      ctaButtonLabel="Start Cruise Planner"
      belowHero={
        <>
          <PlannerPromoBanner config={norwayDestinationConfig} compact />
          <NorwayCruiseMap
            variant="secondary"
            routePorts={classicFjordsRoutePorts}
            routeLabel="Example cruise route: Classic Fjords Route (Stavanger, Bergen, Flam, Olden, Geiranger)"
            showFooterLink={false}
          />
          <PortsGrid />
        </>
      }
    >
      <section>
        <h2>Regional clusters</h2>
        <ul>
          <li>
            <strong>Sognefjord:</strong> Flåm, Skjolden, deep fjord scenery
          </li>
          <li>
            <strong>UNESCO fjords:</strong> Geiranger, Hellesylt, waterfall
            and viewpoint drives
          </li>
          <li>
            <strong>Nordfjord:</strong> Olden, Nordfjordeid, glacier gateways
          </li>
          <li>
            <strong>Hardanger:</strong> Eidfjord, waterfalls and plateau nature
          </li>
          <li>
            <strong>City ports:</strong> Bergen, Stavanger, Trondheim,
            Kristiansand, Ålesund, Molde
          </li>
          <li>
            <strong>Arctic:</strong> Honningsvåg, Tromsø, North Cape and
            aurora
          </li>
        </ul>
      </section>

      <section>
        <h2>{ports.length} authority port pages</h2>
        <p>
          Select any port below or use the{" "}
          <Link href="/norway-cruise-planner">Norway Cruise Planner</Link> to
          match excursions to your route.
        </p>
      </section>
    </ContentPage>
  );
}
