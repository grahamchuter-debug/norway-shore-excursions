import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CompareNorwayCruisePorts } from "@/components/compare-norway-cruise-ports";
import { DontWastePortDay } from "@/components/dont-waste-port-day";
import { HomePlanningSections } from "@/components/home-planning-sections";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { PortCard } from "@/components/port-card";
import { cruiseLines } from "@/lib/cruise-lines-data";
import { ports, portBySlug } from "@/lib/ports-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { interestThemeLinks } from "@/lib/themes-data";
import { buildFaqSchema, buildItemListSchema } from "@/lib/site-schema";
import { siteConfig } from "@/lib/site-config";
import { MapSecondaryTeaser } from "@/components/planner/map-secondary-teaser";
import { norwayDestinationConfig } from "@/lib/destination-config";
import { imageAlts, siteImages } from "@/lib/site-images";

export const metadata: Metadata = buildPageMetadata({
  title:
    "Norway Shore Excursions | Norway Cruise Planner & Best Shore Excursions",
  description:
    "Free Norway Cruise Planner with personalised shore excursion recommendations, Norway Cruise Match scores and return to ship confidence. Compare Norway cruise ports and best shore excursions.",
  path: "/",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
  absoluteTitle: true,
});

const featuredPortSlugs = [
  "flam",
  "bergen",
  "geiranger",
  "olden",
  "tromso",
  "honningsvag",
] as const;

const portsByInterest = [
  {
    interest: "Fjords & viewpoints",
    ports: ["flam", "geiranger", "bergen"],
    href: "/fjord-shore-excursions-norway",
  },
  {
    interest: "Glaciers & waterfalls",
    ports: ["olden", "eidfjord", "hellesylt"],
    href: "/glacier-shore-excursions-norway",
  },
  {
    interest: "Arctic & Northern Lights",
    ports: ["tromso", "honningsvag"],
    href: "/northern-lights-shore-excursions-norway",
  },
  {
    interest: "City walks & history",
    ports: ["bergen", "stavanger", "trondheim", "kristiansand"],
    href: "/family-shore-excursions-norway",
  },
  {
    interest: "Wildlife & adventure",
    ports: ["honningsvag", "skjolden", "tromso"],
    href: "/wildlife-shore-excursions-norway",
  },
] as const;

const homeFaqs = [
  {
    question: "What is the Norway Cruise Planner?",
    answer:
      "A smart, rules based Norway cruise planner that matches your ports, traveller style and time ashore to shore excursion types, with Norway Cruise Match scores and return to ship confidence labels.",
  },
  {
    question: "Is Norway Shore Excursions affiliated with cruise lines?",
    answer:
      "No. We are an independent planning platform linking passengers to local port specialists. We have no official partnership with any cruise line.",
  },
  {
    question: "How do I find the best Norway shore excursions?",
    answer:
      "Start with our planner or popular cruise routes, then explore port authority pages and book independently via linked local sites for Flåm, Bergen, Geiranger and every major Norway cruise port.",
  },
  {
    question: "Is the planner powered by live AI?",
    answer:
      "It delivers AI style personalised recommendations using rules based logic, not a live AI booking engine or real time availability database.",
  },
] as const;

export default function HomePage() {
  const itemList = buildItemListSchema(
    featuredPortSlugs.map((s) => ({
      name: portBySlug[s].displayName,
      description: portBySlug[s].bestFor,
    })),
    "Best Norway cruise ports for shore excursions",
  );

  return (
    <>
      <JsonLd data={[itemList, buildFaqSchema(homeFaqs)]} />
      <main>
        <PageHero image={siteImages.hero} imageAlt={imageAlts.hero}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
            {siteConfig.name}
          </p>
          <h1 className="mb-4 max-w-4xl text-3xl font-bold text-white sm:text-5xl md:text-6xl">
            Your Personalised Norway Cruise Plan
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/90 sm:text-xl">
            The Norway Cruise Planner matches your ports, traveller style and
            time ashore to shore excursions with Cruise Match scores and return
            to ship confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#norway-cruise-planner" className="btn-gold min-h-11">
              Start Cruise Planner
            </a>
            <Link
              href="/best-norway-shore-excursions"
              className="btn-secondary min-h-11"
            >
              Browse best excursions
            </Link>
          </div>
        </PageHero>

        <HomePlanningSections />

        <CompareNorwayCruisePorts />

        <section className="border-b bg-navy py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Best Norway shore excursions by interest
            </h2>
            <p className="mt-2 max-w-2xl text-white/75">
              Match your priorities to the ports where Norway cruise excursions
              work best, then dive into authority guides and local specialists.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {portsByInterest.map((group) => (
                <div
                  key={group.interest}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="font-semibold text-[var(--gold)]">
                    {group.interest}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    {group.ports
                      .map((s) => portBySlug[s].displayName)
                      .join(" · ")}
                  </p>
                  <Link
                    href={group.href}
                    className="mt-3 inline-block text-sm font-medium text-[var(--glacier-blue)] underline"
                  >
                    Theme guide →
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-8">
              <Link
                href="/best-norway-shore-excursions"
                className="text-sm font-medium text-white/90 underline hover:text-white"
              >
                See all best Norway shore excursions →
              </Link>
            </p>
          </div>
        </section>

        <DontWastePortDay />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Featured Norway cruise ports
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Authority port guides for Norway cruise excursions, each linking
              to an independent local booking specialist.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPortSlugs.map((slug) => (
                <PortCard key={slug} port={portBySlug[slug]} />
              ))}
            </div>
            <p className="mt-8">
              <Link
                href="/norway-cruise-ports"
                className="btn-primary-on-light min-h-11"
              >
                View all {ports.length} Norway cruise ports
              </Link>
            </p>
          </div>
        </section>

        <MapSecondaryTeaser config={norwayDestinationConfig} />

        <section className="border-y bg-surface-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Cruise line planning guides
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Independent Norway cruise excursion planning for major lines, no
              official partnership implied.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cruiseLines.map((line) => (
                <li key={line.slug}>
                  <Link
                    href={`/cruise-lines/${line.slug}`}
                    className="premium-card block min-h-11 px-4 py-3 text-sm font-medium text-slate-800"
                  >
                    {line.shortName} Norway guide
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
            <dl className="mt-8 space-y-6">
              {homeFaqs.map((faq) => (
                <div key={faq.question} className="premium-card p-5">
                  <dt className="font-semibold text-slate-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-700">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t bg-navy py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to plan your Norway cruise excursions?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85">
              Generate your personalised Norway Cruise Match plan, then book
              independently via trusted local specialists at each port.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/norway-cruise-planner" className="btn-gold min-h-11">
                Start Cruise Planner
              </Link>
            </div>
            <p className="mt-6">
              <Link
                href="/norway-cruise-port-map"
                className="text-sm text-white/70 underline hover:text-white"
              >
                Optional: browse the port map →
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
