import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { WillThisExcursionFit } from "@/components/will-this-excursion-fit";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Return to Ship Guide Norway",
  description:
    "Return to ship guide for Norway cruise passengers, all aboard timing, tender buffers, traffic margins and independent excursion safety tips.",
  path: "/return-to-ship-guide",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

const faqs = [
  {
    question: "How early should I return to the ship in Norway?",
    answer: "Allow 45 to 60 minutes before published all aboard on most ports; add extra time for Geiranger tenders and large ship gangway queues.",
  },
  {
    question: "What happens if an independent tour runs late?",
    answer: "The ship may sail without you. Independent excursion contracts rarely guarantee ship waiting, unlike some ship sponsored tours with limited protection.",
  },
  {
    question: "Is ship time the same as local time?",
    answer: "Norway uses Central European Time. Confirm whether your cruise line displays port local time on daily programmes.",
  },
] as const;

export default function ReturnToShipGuidePage() {
  return (
    <ContentPage
      title="Return to Ship Guide for Norway"
      lead="Practical timing guidance for cruise passengers planning independent shore excursions: buffers, tenders and port-specific risks."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/return-to-ship-guide"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Return to Ship Guide" },
      ]}
      faqs={faqs}
      ctaTitle="Understand confidence labels"
      ctaText="Our Norway Cruise Planner shows return-to-ship confidence for each port recommendation. Read how we calculate Very High through Not Recommended labels."
      ctaHref="/return-to-ship-confidence"
      ctaButtonLabel="Return to ship confidence"
    >
      <section>
        <h2>Know your all aboard time</h2>
        <p>
          All aboard is usually 30 to 60 minutes before sailing, not the published
          departure time on your itinerary. Check the daily programme every
          morning; times can change.
        </p>
      </section>

      <section id="will-this-excursion-fit" className="!mt-0">
        <WillThisExcursionFit />
      </section>

      <section>
        <h2>Standard buffers by port type</h2>
        <ul>
          <li>
            <strong>Walkable city ports</strong> (Bergen, Stavanger, Trondheim):
            45 minutes minimum
          </li>
          <li>
            <strong>Fjord villages</strong> (Flåm, Olden): 45 to 60 minutes; coach
            traffic on narrow roads
          </li>
          <li>
            <strong>Tender ports</strong> (Geiranger): add 30 to 45 minutes for
            tender queues both ways
          </li>
          <li>
            <strong>Arctic coaches</strong> (North Cape from Honningsvåg): use
            operator-scheduled returns only
          </li>
        </ul>
      </section>

      <section>
        <h2>Excursions to treat with caution on short calls</h2>
        <p>
          Flåm Railway, Atlantic Ocean Road from Molde, cross-region glacier
          combos and aurora evening tours need long port windows. Our planner
          marks these with amber or red confidence when time is tight.
        </p>
      </section>

      <section>
        <h2>Use the Cruise Planner confidence labels</h2>
        <p>
          <span className="confidence-green rounded-full px-2 py-0.5 text-xs font-semibold">
            Green, Comfortable
          </span>{" "}
          <span className="confidence-amber ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
            Amber, Check timing
          </span>{" "}
          <span className="confidence-red ml-2 rounded-full px-2 py-0.5 text-xs font-semibold">
            Red, Avoid longer tour
          </span>
        </p>
        <p className="mt-3">
          Generate your plan on the{" "}
          <Link href="/norway-cruise-planner">Norway Cruise Planner™</Link>.
        </p>
      </section>
    </ContentPage>
  );
}
