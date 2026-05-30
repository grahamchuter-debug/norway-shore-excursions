import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Private Shore Excursions Norway",
  description:
    "Private shore excursions in Norway for cruise passengers, flexible touring in Bergen, Stavanger, Tromsø, Olden and Flåm with independent local operators.",
  path: "/private-shore-excursions-norway",
  ogImage: siteImages.bergen,
  ogImageAlt: imageAlts.bergen,
});

const faqs = [
  {
    question: "Are private excursions allowed on Norway cruise ports?",
    answer: "Yes on virtually all commercial cruise calls, subject to your responsibility for return to ship timing.",
  },
  {
    question: "Does Norway Shore Excursions sell private tours?",
    answer: "No. We link to independent local port sites where private options may be listed.",
  },
] as const;

export default function PrivateShoreExcursionsPage() {
  return (
    <ContentPage
      title="Private Shore Excursions in Norway"
      lead="Flexible private touring for cruise passengers who want custom routing, smaller groups and control over pacing, booked independently via local specialists."
      heroImage={siteImages.bergen}
      heroImageAlt={imageAlts.bergen}
      pagePath="/private-shore-excursions-norway"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Private Excursions" },
      ]}
      faqs={faqs}
      relatedLinks={[
        { label: "Best private tours theme guide", href: "/best-private-tours-norway" },
        { label: "Bergen port", href: "/ports/bergen" },
        { label: "Stavanger port", href: "/ports/stavanger" },
        { label: "Return to ship guide", href: "/return-to-ship-guide" },
      ]}
    >
      <section>
        <h2>Why choose private touring</h2>
        <p>
          Private excursions suit families, photographers and passengers with
          specific interests. You set the pace, but must still respect all aboard
          deadlines and road transfer times in fjord country.
        </p>
      </section>

      <section>
        <h2>Best ports for private excursions</h2>
        <ul>
          <li>
            <Link href="/ports/bergen">Bergen</Link>, city, fjord and Fløyen
            combinations
          </li>
          <li>
            <Link href="/ports/stavanger">Stavanger</Link>, city walks and
            Lysefjord charters
          </li>
          <li>
            <Link href="/ports/tromso">Tromsø</Link>, Arctic culture and photo
            routes
          </li>
          <li>
            <Link href="/ports/olden">Olden</Link>, glacier transfers on your
            schedule
          </li>
          <li>
            <Link href="/ports/flam">Flåm</Link>, viewpoint drives with flexible
            stops
          </li>
        </ul>
      </section>

      <section>
        <h2>Independent booking reminder</h2>
        <p>
          Confirm total duration including traffic buffers. See our{" "}
          <Link href="/return-to-ship-guide">return to ship guide</Link> and use
          the <Link href="/norway-cruise-planner">Cruise Planner</Link> for
          confidence labels.
        </p>
      </section>
    </ContentPage>
  );
}
