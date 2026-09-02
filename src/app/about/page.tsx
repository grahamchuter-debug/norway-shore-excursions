import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { siteImages, imageAlts } from "@/lib/site-images";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "About Norway Shore Excursions",
  description:
    "What Norway Shore Excursions is: an independent cruise-port planning resource for Norway, covering ports, schedules and shore excursion ideas.",
  path: "/about",
  ogImage: siteImages.planner,
  ogImageAlt: imageAlts.planner,
});

export default function AboutPage() {
  return (
    <ContentPage
      title="About Norway Shore Excursions"
      lead="An independent planning resource for cruise passengers visiting Norway — focused on port days, ship schedules and shore excursion ideas."
      heroImage={siteImages.planner}
      heroImageAlt={imageAlts.planner}
      pagePath="/about"
      pageDescription="About Norway Shore Excursions independent cruise planning."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About" },
      ]}
      ctaTitle="Start with your port"
      ctaText="Browse Norway cruise ports, check schedules, or open the cruise planner."
      ctaHref="/norway-cruise-ports"
      ctaButtonLabel="Explore cruise ports"
      showShipReassurance={false}
      relatedLinks={[
        { label: "Contact", href: "/contact" },
        { label: "Cruise planner", href: siteConfig.plannerPath },
        { label: "Ship schedules", href: "/ship-schedules" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ]}
    >
      <section>
        <h2>What this site is</h2>
        <p>
          Norway Shore Excursions helps cruise passengers make better use of a
          day ashore in Norway. It brings together national port context,
          published ship schedule information and excursion discovery — then
          connects you to dedicated local port guides when you need deeper
          destination detail.
        </p>
      </section>

      <section>
        <h2>What this site is not</h2>
        <ul>
          <li>Not a cruise line or port authority.</li>
          <li>Not an official tourism board.</li>
          <li>Not a live booking checkout on this national site.</li>
          <li>Not a guarantee of ship timings, berth arrangements or tour availability.</li>
        </ul>
      </section>

      <section>
        <h2>How the network works</h2>
        <p>
          Use this national site to answer “which port?”, “when does my ship
          call?” and “what kind of day makes sense?”. Dedicated destination
          sites — such as Bergen, Flåm or Geiranger — focus on that port’s day
          ashore in more detail.
        </p>
      </section>

      <section>
        <h2>Schedules and planning tools</h2>
        <p>
          The master Norway schedule dataset covers published calls through 31
          December 2027 across 15 ports. Always confirm arrival, departure and
          all aboard times with your cruise line before finalising plans.
        </p>
        <p>
          <Link href="/ship-schedules">Ship schedules</Link>
          {" · "}
          <Link href="/norway-cruise-calendar">Cruise calendar</Link>
          {" · "}
          <Link href={siteConfig.plannerPath}>Cruise planner</Link>
        </p>
      </section>
    </ContentPage>
  );
}
