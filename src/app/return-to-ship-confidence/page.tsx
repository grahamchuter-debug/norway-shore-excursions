import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { ReturnToShipConfidence } from "@/components/return-to-ship-confidence";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Return to Ship Confidence",
  description:
    "How Norway Shore Excursions calculates Return to Ship Confidence levels for shore excursions, including buffers, port windows and suitability labels.",
  path: "/return-to-ship-confidence",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

const levels = [
  {
    level: "very-high" as const,
    summary:
      "More than 3 hours remaining after a typical tour, check in and safety buffers.",
  },
  {
    level: "high" as const,
    summary:
      "2 to 3 hours remaining. Comfortable for most independent tours when timings are confirmed.",
  },
  {
    level: "moderate" as const,
    summary:
      "1 to 2 hours remaining. Workable for shorter tours; confirm all aboard with your operator.",
  },
  {
    level: "tight" as const,
    summary:
      "Under 1 hour remaining. Only suitable for very short activities near the pier.",
  },
  {
    level: "not-recommended" as const,
    summary:
      "Tour duration exceeds the available port window with standard buffers.",
  },
];

const faqs = [
  {
    question: "What inputs do you use?",
    answer:
      "When published, we use ship arrival time and all aboard time from imported Norway schedules. For excursion cards without exact ship times, we show Moderate until you run the fit calculator.",
  },
  {
    question: "What buffers are included?",
    answer:
      "Our default estimate adds 15 minutes for gangway check in and 45 minutes safety margin before all aboard. Tender ports like Geiranger need extra time beyond these defaults.",
  },
  {
    question: "Is this a guarantee the ship will wait?",
    answer:
      "No. Confidence describes timing fit only. Independent tours rarely guarantee ship waiting. Always confirm deadlines with your cruise line.",
  },
] as const;

export default function ReturnToShipConfidencePage() {
  return (
    <ContentPage
      title="Return to Ship Confidence"
      lead="How we score whether an independent shore excursion fits your Norway port day, with clear labels from Very High to Not Recommended."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/return-to-ship-confidence"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Return to Ship Confidence" },
      ]}
      faqs={faqs}
      ctaTitle="Test your exact tour"
      ctaText="Use Will This Excursion Fit on the return to ship guide with your arrival and all aboard times."
      ctaHref="/return-to-ship-guide#will-this-excursion-fit"
      ctaButtonLabel="Open fit calculator"
      relatedLinks={[
        { label: "Return to Ship Guide", href: "/return-to-ship-guide" },
        { label: "Norway Cruise Planner", href: "/norway-cruise-planner" },
        { label: "Ship Schedules", href: "/ship-schedules" },
      ]}
    >
      <section>
        <h2>Confidence levels</h2>
        <p>
          Labels appear on excursion cards, cruise line guides, ship pages and the
          Norway Cruise Planner. They are planning aids, not cruise line policies.
        </p>
        <ul className="mt-6 space-y-4">
          {levels.map((item) => (
            <li
              key={item.level}
              className="rounded-xl border border-[var(--border-light)] bg-white p-4"
            >
              <ReturnToShipConfidence level={item.level} />
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Calculation steps</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Measure available port minutes from arrival to all aboard.</li>
          <li>
            Subtract excursion duration, 15 minute check in buffer and 45 minute
            safety buffer.
          </li>
          <li>Map remaining minutes to the confidence level table above.</li>
        </ol>
        <p className="mt-4">
          The same logic powers{" "}
          <Link href="/return-to-ship-guide#will-this-excursion-fit" className="content-link font-medium">
            Will This Excursion Fit?
          </Link>
          , where you can enter your own tour length.
        </p>
      </section>

      <section>
        <h2>Suitability by port type</h2>
        <ul>
          <li>
            <strong>Walkable city ports</strong> (Bergen, Stavanger): standard
            buffers usually suffice.
          </li>
          <li>
            <strong>Fjord coach routes</strong> (Flåm, Olden): allow for narrow
            road delays in summer.
          </li>
          <li>
            <strong>Tender ports</strong> (Geiranger): add 30 to 45 minutes beyond
            default buffers for tender queues.
          </li>
        </ul>
      </section>
    </ContentPage>
  );
}
