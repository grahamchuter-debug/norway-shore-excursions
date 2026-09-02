import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { siteImages, imageAlts } from "@/lib/site-images";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for Norway Shore Excursions: independent cruise planning information for Norway port days.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      lead="These terms cover use of the Norway Shore Excursions website as an independent informational planning resource."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/terms"
      pageDescription="Terms of use for Norway Shore Excursions."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Terms" },
      ]}
      ctaTitle="Plan your Norway cruise"
      ctaText="Explore ports and schedules, then verify timings with your cruise line."
      ctaHref="/norway-cruise-ports"
      ctaButtonLabel="Explore cruise ports"
      showShipReassurance={false}
      relatedLinks={[
        { label: "Privacy", href: "/privacy" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <section>
        <h2>Informational purpose</h2>
        <p>
          {siteConfig.name} provides planning information about Norway cruise
          ports, published ship schedule data and shore excursion ideas. Content
          is for general guidance only.
        </p>
      </section>

      <section>
        <h2>No affiliation</h2>
        <p>
          Unless expressly stated, we are not affiliated with cruise lines, port
          authorities, tourism boards or excursion operators. Names of ships,
          lines and places are used for identification and planning context.
        </p>
      </section>

      <section>
        <h2>Schedules and timings</h2>
        <p>
          Cruise schedules can change because of weather, port operations and
          cruise-line updates. Always confirm arrival, departure and all aboard
          times with your cruise line before committing to plans ashore.
        </p>
      </section>

      <section>
        <h2>Excursions and external sites</h2>
        <p>
          Links to local destination sites or other third parties are provided
          for convenience. We do not control those sites and are not responsible
          for their content, availability, pricing or booking terms.
        </p>
      </section>

      <section>
        <h2>No booking or payment services on this site</h2>
        <p>
          This national website does not currently provide checkout, payment
          processing or confirmed tour reservations. Do not treat planning pages
          as a booking confirmation.
        </p>
      </section>

      <section>
        <h2>Your responsibility</h2>
        <ul>
          <li>Verify ship timings and embarkation requirements with your cruise line.</li>
          <li>Allow realistic buffers for transfers, queues and tender operations where relevant.</li>
          <li>Check operator terms before purchasing any excursion elsewhere.</li>
        </ul>
      </section>

      <section>
        <h2>Limitation</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for decisions
          made solely on the basis of planning information on this site,
          including missed ships, changed itineraries or third-party service
          issues.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          See the <Link href="/contact">contact page</Link> for current contact
          status and the <Link href="/privacy">privacy policy</Link> for data
          practices.
        </p>
      </section>
    </ContentPage>
  );
}
