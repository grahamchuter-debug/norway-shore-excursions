import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { siteImages, imageAlts } from "@/lib/site-images";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Norway Shore Excursions: how this independent planning website handles information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      lead="This privacy notice describes the Norway Shore Excursions website as it operates today: an informational cruise planning site without live booking or payment processing."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/privacy"
      pageDescription="Privacy policy for Norway Shore Excursions."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Privacy" },
      ]}
      ctaTitle="Questions about this policy?"
      ctaText="Contact us if you have a privacy question about this website."
      ctaHref="/contact"
      ctaButtonLabel="Contact"
      showShipReassurance={false}
      relatedLinks={[
        { label: "Terms", href: "/terms" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
    >
      <section>
        <h2>Who we are</h2>
        <p>
          This website is operated under the name {siteConfig.name} at{" "}
          {siteConfig.url}. It provides independent cruise-port planning
          information for Norway.
        </p>
      </section>

      <section>
        <h2>What this site does not do</h2>
        <ul>
          <li>It does not process online bookings or payments.</li>
          <li>It does not currently operate a contact form that collects passenger details on this site.</li>
          <li>It does not include first-party analytics packages in the application source reviewed for this policy.</li>
        </ul>
      </section>

      <section>
        <h2>Technical and hosting data</h2>
        <p>
          Like most websites, hosting and content-delivery providers may process
          standard technical data such as IP address, browser type, requested
          pages and timestamps to deliver and secure the site. That processing is
          controlled by the hosting provider’s systems and policies.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          This site does not intentionally set marketing cookies through
          application code reviewed for this notice. Your browser and hosting
          platform may still use essential technical mechanisms required to
          deliver pages.
        </p>
      </section>

      <section>
        <h2>External links</h2>
        <p>
          We link to dedicated local port sites and other third-party resources.
          Those sites have their own privacy practices. Review their policies
          before sharing personal information with them.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          , or see the <Link href="/contact">contact page</Link>. If you email
          us, we process the content of your message and your email address in
          order to respond.
        </p>
      </section>

      <section>
        <h2>Updates</h2>
        <p>
          We may update this notice if the site’s functionality changes, for
          example if a contact form, analytics or booking features are added.
        </p>
      </section>
    </ContentPage>
  );
}
