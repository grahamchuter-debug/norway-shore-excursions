import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "When to Cruise Norway",
  description:
    "Best time to cruise Norway, summer fjord season, midnight sun, northern lights windows and month by month port planning for cruise passengers.",
  path: "/when-to-cruise-norway",
  ogImage: siteImages.northernLights,
  ogImageAlt: imageAlts.northernLights,
});

const faqs = [
  {
    question: "What is the best month to cruise Norway fjords?",
    answer: "June through August offers the longest days and calmest weather for fjord ports. May and September are quieter with lower prices.",
  },
  {
    question: "When can I see the northern lights on a Norway cruise?",
    answer: "Typically October to March on sailings that include Tromsø or Honningsvåg with dark evening hours.",
  },
  {
    question: "Is Norway cruising weather unpredictable?",
    answer: "Yes. Pack layers and waterproofs even in summer; fog can affect Geiranger viewpoints.",
  },
] as const;

export default function WhenToCruiseNorwayPage() {
  return (
    <ContentPage
      title="When to Cruise Norway"
      lead="Month by month guidance for Norway cruise itineraries, fjord season, Arctic sailings, crowds and excursion availability."
      heroImage={siteImages.northernLights}
      heroImageAlt={imageAlts.northernLights}
      pagePath="/when-to-cruise-norway"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Travel Guides" },
      ]}
      faqs={faqs}
      relatedLinks={[
        { label: "Norway cruise ports", href: "/norway-cruise-ports" },
        { label: "Northern lights excursions", href: "/northern-lights-shore-excursions-norway" },
        { label: "Cruise Planner", href: "/norway-cruise-planner" },
      ]}
      relatedSectionTitle="Related planning guides"
    >
      <section>
        <h2>Summer fjord season (May to September)</h2>
        <p>
          Peak season for Geiranger, Flåm, Bergen and Olden. Book Stegastein,
          Briksdal and Geiranger viewpoints early on multi-ship days. Long daylight
          hours maximise port time.
        </p>
      </section>

      <section>
        <h2>Midnight sun (May to July)</h2>
        <p>
          Arctic ports including Honningsvåg and Tromsø experience continuous
          daylight. Excursions run on extended schedules; sleep masks recommended
          onboard.
        </p>
      </section>

      <section>
        <h2>Northern lights season (October to March)</h2>
        <p>
          Winter and shoulder-season sailings to Tromsø focus on aurora chasing.
          See our{" "}
          <Link href="/northern-lights-shore-excursions-norway">
            northern lights excursion guide
          </Link>
          .
        </p>
      </section>

      <section>
        <h2>Shoulder seasons (April, October)</h2>
        <p>
          Fewer ships and lower prices, but some attractions reduce hours. Glacier
          tours and city walks remain viable with flexible packing.
        </p>
      </section>
    </ContentPage>
  );
}
