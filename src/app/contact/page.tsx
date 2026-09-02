import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { siteImages, imageAlts } from "@/lib/site-images";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact | Norway Shore Excursions",
  description:
    "Contact Norway Shore Excursions for help planning a Norway cruise port day, comparing ports or finding the right local destination guide.",
  path: "/contact",
  ogImage: siteImages.bergen,
  ogImageAlt: imageAlts.bergen,
});

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      lead="Need help planning your Norway port day? Write to our concierge team, or start with the port guides, schedules and cruise planner."
      heroImage={siteImages.bergen}
      heroImageAlt={imageAlts.bergen}
      pagePath="/contact"
      pageDescription="Contact Norway Shore Excursions for cruise port planning questions."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]}
      ctaTitle="Prefer to plan yourself first?"
      ctaText="Use the cruise planner and ship schedules for immediate answers."
      ctaHref={siteConfig.plannerPath}
      ctaButtonLabel="Open cruise planner"
      showShipReassurance={false}
      relatedLinks={[
        { label: "About", href: "/about" },
        { label: "Cruise ports", href: "/norway-cruise-ports" },
        { label: "Ship schedules", href: "/ship-schedules" },
        { label: "Privacy", href: "/privacy" },
      ]}
    >
      <section>
        <h2>How we can help</h2>
        <ul>
          <li>Understanding which Norway port your ship visits</li>
          <li>Choosing between excursion ideas for a limited day ashore</li>
          <li>Finding the right dedicated local destination guide</li>
          <li>General questions about using this planning site</li>
        </ul>
      </section>

      <section>
        <h2>Concierge contact</h2>
        {siteConfig.contactEmailVerified ? (
          <>
            <p>
              Email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
            <p>
              We respond to cruise-passenger planning questions about Norway
              ports, schedules and excursion ideas. Please include your cruise
              dates and ports where relevant.
            </p>
          </>
        ) : (
          <p>
            A destination concierge email channel is being prepared for Norway
            Shore Excursions. In the meantime, please use the planning tools on
            this site — they cover ports, ship schedules and excursion ideas for
            a day ashore.
          </p>
        )}
      </section>

      <section>
        <h2>Self-serve planning</h2>
        <p>
          Many passengers find what they need through the{" "}
          <Link href="/norway-cruise-ports">port directory</Link>,{" "}
          <Link href="/ship-schedules">ship schedules</Link> and{" "}
          <Link href={siteConfig.plannerPath}>cruise planner</Link>.
        </p>
      </section>

      <section>
        <h2>What we cannot do</h2>
        <ul>
          <li>Confirm your ship’s official arrival or all aboard time</li>
          <li>Guarantee excursion availability or pricing</li>
          <li>Process bookings or payments on this national site</li>
        </ul>
      </section>
    </ContentPage>
  );
}
