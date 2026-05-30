import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { cruiseLines } from "@/lib/cruise-lines-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Cruise Lines Norway Shore Excursions",
  description:
    "Independent shore excursion planning guides for P&O, MSC, Princess, Celebrity, Royal Caribbean, Holland America, Cunard and NCL Norway sailings.",
  path: "/cruise-lines",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

const faqs = [
  {
    question: "Are these official cruise line excursion pages?",
    answer: "No. Each page is an independent shore excursion planning guide with no partnership or endorsement from the cruise line named.",
  },
  {
    question: "Can I use these guides if I booked through any travel agent?",
    answer: "Yes. The port and theme advice applies to all passengers regardless of how the cruise was booked.",
  },
] as const;

export default function CruiseLinesPage() {
  return (
    <ContentPage
      title="Cruise Line Norway Planning Guides"
      lead="Independent shore excursion planning guides for major cruise lines visiting Norway, plan ports, themes and timing before you sail."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/cruise-lines"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Cruise Lines" },
      ]}
      faqs={faqs}
    >
      <section>
        <h2>Independent planning, not official partnerships</h2>
        <p>
          Norway Shore Excursions is not affiliated with any cruise line. These
          guides help passengers understand typical Norway itineraries and link
          to local port specialists for independent booking.
        </p>
      </section>

      <section>
        <h2>Cruise line guides</h2>
        <ul>
          {cruiseLines.map((line) => (
            <li key={line.slug}>
              <Link href={`/cruise-lines/${line.slug}`}>
                {line.name}, independent shore excursion planning guide
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Norway Cruise Planner</h2>
        <p>
          Enter your specific sailing into the{" "}
          <Link href="/norway-cruise-planner">Norway Cruise Planner™</Link> for
          personalised AI style recommendations across all ports.
        </p>
      </section>
    </ContentPage>
  );
}
