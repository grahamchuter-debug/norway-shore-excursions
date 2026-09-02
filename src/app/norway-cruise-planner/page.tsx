import { Suspense } from "react";

import { ContentPage } from "@/components/content-page";
import { DontWastePortDay } from "@/components/dont-waste-port-day";
import { PlannerPageClient } from "@/components/planner-page-client";
import { PopularCruiseRoutes } from "@/components/popular-cruise-routes";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata = buildPageMetadata({
  title: "Norway Cruise Planner | Personalised Shore Excursion Plan",
  description:
    "Free Norway cruise planner with AI style shore excursion recommendations. Norway Cruise Match scores, traveller types, popular cruise routes and return to ship confidence for every port.",
  path: "/norway-cruise-planner",
  ogImage: siteImages.planner,
  ogImageAlt: imageAlts.planner,
});

const faqs = [
  {
    question: "Is the Norway Cruise Planner powered by live AI?",
    answer:
      "No. It uses rules based logic to produce AI style recommendations. It is not connected to live availability or a booking database.",
  },
  {
    question: "What is the Norway Cruise Match Score?",
    answer:
      "An overall score out of 100 summarising how well your selected ports, traveller style and time ashore align with recommended Norway shore excursions, including best port and excursion-type highlights.",
  },
  {
    question: "What do return to ship confidence labels mean?",
    answer:
      "Green means comfortable fit; amber means check exact timings with your operator; red means avoid longer tours unless your port call is extended.",
  },
] as const;

export default function NorwayCruisePlannerPage() {
  return (
    <>
      <ContentPage
        title="Norway Cruise Planner™"
        lead="Your personalised Norway cruise recommendation engine. Match ports, traveller style and time ashore to shore excursions with Cruise Match scores and return to ship confidence."
        heroImage={siteImages.planner}
        heroImageAlt={imageAlts.planner}
        pagePath="/norway-cruise-planner"
        pageDescription={metadata.description as string}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cruise Planner" },
        ]}
        faqs={faqs}
        showShipReassurance={false}
        ctaTitle="Generate your Norway Cruise Match plan"
        ctaText="Add your ports and traveller style to receive personalised shore excursion recommendations for every stop."
        ctaHref="/norway-cruise-planner"
        ctaButtonLabel="Open Cruise Planner"
        belowHero={
          <>
            <div className="bg-surface-muted py-12">
              <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <Suspense fallback={null}>
                  <PlannerPageClient />
                </Suspense>
              </div>
            </div>
            <PopularCruiseRoutes linkToPlanner />
            <DontWastePortDay compact />
          </>
        }
      >
        <section>
          <h2>How the planner works</h2>
          <p>
            Choose your traveller type, cruise line, all Norway cruise ports on
            your itinerary, fitness level and typical time ashore. The planner
            generates a Norway Cruise Match summary plus port-by-port plans with
            excursion types, best for tags, local site links and return to ship
            confidence badges.
          </p>
          <p>
            This is a personalised planning tool, not a live AI booking engine.
            Always confirm excursion duration and all aboard times with your
            operator and cruise line.
          </p>
        </section>
      </ContentPage>
    </>
  );
}
