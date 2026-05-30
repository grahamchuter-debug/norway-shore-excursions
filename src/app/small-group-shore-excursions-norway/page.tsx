import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Small Group Shore Excursions Norway",
  description:
    "Small group shore excursions in Norway, alternatives to large ship coach tours in fjord and city ports with independent local operators.",
  path: "/small-group-shore-excursions-norway",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
});

const faqs = [
  {
    question: "What counts as a small group excursion?",
    answer: "Typically 6 to 16 passengers per vehicle or boat, compared to 40+ on many ship contracted coaches.",
  },
  {
    question: "Are small group tours safer for return timing?",
    answer: "They can be more flexible, but distance and traffic still matter, always confirm end times in writing.",
  },
] as const;

export default function SmallGroupShoreExcursionsPage() {
  return (
    <ContentPage
      title="Small Group Shore Excursions in Norway"
      lead="Smaller independent groups offer closer guide access and quicker embark/disembark, ideal when ship coaches feel too large or impersonal."
      heroImage={siteImages.hero}
      heroImageAlt={imageAlts.hero}
      pagePath="/small-group-shore-excursions-norway"
      pageDescription={metadata.description as string}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Small Group Tours" },
      ]}
      faqs={faqs}
      relatedLinks={[
        { label: "Private excursions", href: "/private-shore-excursions-norway" },
        { label: "Flåm port", href: "/ports/flam" },
        { label: "Geiranger port", href: "/ports/geiranger" },
      ]}
    >
      <section>
        <h2>Where small groups work best</h2>
        <p>
          Viewpoint drives from Flåm and Geiranger, walking tours in Bergen and
          Stavanger, and RIB boats from Skjolden benefit from smaller participant
          counts. Local port sites list group size limits per tour.
        </p>
      </section>

      <section>
        <h2>Booking independently</h2>
        <p>
          Use our <Link href="/norway-cruise-ports">port authority pages</Link>{" "}
          to reach local specialists. Compare stated group sizes and return
          policies before paying a deposit.
        </p>
      </section>
    </ContentPage>
  );
}
