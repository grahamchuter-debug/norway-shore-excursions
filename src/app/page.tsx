import type { Metadata } from "next";
import Link from "next/link";

import { HomePlanningSections } from "@/components/home-planning-sections";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ports, portBySlug } from "@/lib/ports-data";
import { buildPageMetadata } from "@/lib/site-metadata";
import { buildFaqSchema, buildItemListSchema } from "@/lib/site-schema";
import { siteConfig } from "@/lib/site-config";
import { imageAlts, siteImages } from "@/lib/site-images";
import { interestThemeLinks } from "@/lib/themes-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Norway Shore Excursions | Independent Cruise Port Planning",
  description: siteConfig.defaultDescription,
  path: "/",
  ogImage: siteImages.hero,
  ogImageAlt: imageAlts.hero,
  absoluteTitle: true,
});

const featuredStories = [
  {
    slug: "bergen",
    title: "Bergen",
    summary:
      "City harbour energy with Bryggen, Fløibanen and Mostraumen fjord options — ideal when you want culture and scenery in one day.",
  },
  {
    slug: "flam",
    title: "Flåm",
    summary:
      "Aurlandsfjord scenery, Stegastein and Flåm Railway decisions on a compact scenic port day.",
  },
  {
    slug: "geiranger",
    title: "Geiranger",
    summary:
      "UNESCO fjord viewpoints, Dalsnibba and Eagle Road logistics for a classic fjord call.",
  },
  {
    slug: "olden",
    title: "Olden",
    summary:
      "Briksdal Glacier and Loen Skylift — choose carefully when time ashore is limited.",
  },
  {
    slug: "stavanger",
    title: "Stavanger",
    summary:
      "Lysefjord gateway and old-town walks; Pulpit Rock feasibility depends on your hours in port.",
  },
  {
    slug: "honningsvag",
    title: "Honningsvåg",
    summary:
      "North Cape distance and timing define the day — plan independently or with organised transfers.",
  },
] as const;

const norwayKinds = [
  {
    title: "Fjord scenery",
    text: "Viewpoint drives, fjord sailings and UNESCO landscapes.",
    href: "/fjord-shore-excursions-norway",
  },
  {
    title: "City & culture",
    text: "Harbour walks, historic centres and short coastal transfers.",
    href: "/family-shore-excursions-norway",
  },
  {
    title: "Rail & panoramic journeys",
    text: "Scenic railways and high viewpoints for longer port days.",
    href: "/best-viewpoint-tours-norway",
  },
  {
    title: "Arctic Norway",
    text: "Tromsø and Honningsvåg for northern lights and North Cape planning.",
    href: "/northern-lights-shore-excursions-norway",
  },
  {
    title: "Active days",
    text: "Hiking, coastal roads and wildlife-focused options.",
    href: "/hiking-shore-excursions-norway",
  },
  {
    title: "Small-group & private ideas",
    text: "Flexible pacing when you want control of the day ashore.",
    href: "/best-private-tours-norway",
  },
] as const;

const homeFaqs = [
  {
    question: "What is Norway Shore Excursions?",
    answer:
      "An independent planning site for cruise passengers visiting Norway. It helps you compare ports, check ship schedules and explore shore excursion ideas — then continue to dedicated local port guides when you need deeper detail.",
  },
  {
    question: "Is this affiliated with cruise lines or port authorities?",
    answer:
      "No. We are independent. Schedules and excursion information are for planning and should be verified with your cruise line and operators.",
  },
  {
    question: "How should I start planning my Norway port day?",
    answer:
      "Find your port, check the ship schedule or calendar for your dates, then use the cruise planner to match time ashore with excursion ideas.",
  },
  {
    question: "Can I book shore excursions here?",
    answer:
      "This national site is for planning and discovery. Dedicated local port sites provide deeper excursion detail. There is no live booking checkout on this authority site.",
  },
] as const;

export default function HomePage() {
  const itemList = buildItemListSchema(
    featuredStories.map((s) => ({
      name: portBySlug[s.slug].displayName,
      description: s.summary,
    })),
    "Featured Norway cruise ports",
  );

  return (
    <>
      <JsonLd data={[itemList, buildFaqSchema(homeFaqs)]} />
      <main>
        <PageHero image={siteImages.hero} imageAlt={imageAlts.hero}>
          <p className="hero-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.22em]">
            {siteConfig.name}
          </p>
          <h1 className="font-display mb-5 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl md:text-[3.25rem]">
            Independent cruise-port planning for Norway
          </h1>
          <p className="max-w-2xl text-base leading-7 sm:text-lg">
            Compare Norway cruise ports, check ship schedules through 2027, and
            explore shore excursion ideas for fjords, cities and Arctic calls —
            built for passengers with a day ashore.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/norway-cruise-ports" className="btn-gold w-full justify-center sm:w-auto">
              Explore Norway cruise ports
            </Link>
            <Link href="/ship-schedules" className="btn-secondary w-full justify-center sm:w-auto">
              Check ship schedules
            </Link>
          </div>
        </PageHero>

        <section className="border-b border-[var(--border-light)] bg-[var(--surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="section-eyebrow">Find your port</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              All 15 Norway cruise destinations
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Start with the port your ship visits. Each national port page
              summarises the day ashore and links to schedules, the planner and
              the local destination guide.
            </p>
            <ul className="mt-8 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
              {ports.map((port) => (
                <li key={port.slug} className="mb-2 break-inside-avoid">
                  <Link
                    href={`/ports/${port.slug}`}
                    className="inline-flex min-h-11 items-center text-base font-medium text-slate-800 underline-offset-4 hover:underline"
                  >
                    {port.displayName}
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      {port.region}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link href="/norway-cruise-ports" className="btn-outline-dark">
                View port directory
              </Link>
            </p>
          </div>
        </section>

        <HomePlanningSections />

        <section className="border-y border-[var(--border-light)] bg-surface-muted py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="section-eyebrow">Choose your Norway</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Different kinds of Norway port day
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Use theme guides to match interests, then return to your specific
              port and schedule.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {norwayKinds.map((kind) => (
                <div key={kind.href} className="border-t border-[var(--border-light)] pt-5">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    {kind.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {kind.text}
                  </p>
                  <Link
                    href={kind.href}
                    className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                  >
                    Explore theme guide
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-slate-500">
              Also see{" "}
              {interestThemeLinks.slice(0, 4).map((link, i) => (
                <span key={link.href}>
                  {i > 0 ? " · " : ""}
                  <Link href={link.href} className="content-link">
                    {link.label}
                  </Link>
                </span>
              ))}
              .
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="section-eyebrow">Port stories</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              How cruise passengers use key Norway ports
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Short editorial snapshots — not generic tour cards. Continue to
              each national port page for schedules and local guides.
            </p>
            <div className="mt-10 space-y-8">
              {featuredStories.map((story) => (
                <article
                  key={story.slug}
                  className="grid gap-3 border-b border-[var(--border-light)] pb-8 md:grid-cols-12 md:gap-6"
                >
                  <h3 className="font-display text-xl font-semibold text-slate-900 md:col-span-3">
                    {story.title}
                  </h3>
                  <p className="text-base leading-7 text-slate-650 md:col-span-6 text-slate-600">
                    {story.summary}
                  </p>
                  <div className="md:col-span-3 md:text-right">
                    <Link
                      href={`/ports/${story.slug}`}
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                    >
                      Port guide
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border-light)] bg-[var(--surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="section-eyebrow">Schedules & ships</p>
            <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Norway cruise schedule tools
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Published calls through December 2027 across 15 ports — search by
              port, month, ship or cruise line.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/ship-schedules", label: "Ship schedules hub" },
                { href: "/norway-cruise-calendar", label: "Cruise calendar" },
                { href: "/ship-schedules/search", label: "Search schedules" },
                { href: "/ships", label: "Cruise ships" },
                { href: "/cruise-lines", label: "Cruise lines" },
                { href: "/norway-cruise-port-map", label: "Port map" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="premium-card flex min-h-14 items-center px-4 py-3 text-sm font-semibold text-slate-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="section-eyebrow">Planning confidence</p>
                <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Time ashore and return-to-ship thinking
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Norway port days succeed when timing is realistic: arrival and
                  all aboard windows, transfer distance, and whether a plan still
                  works if the ship is late or queues are long. Use our
                  return-to-ship guides as planning tools — always confirm final
                  timings with your cruise line.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/return-to-ship-guide" className="btn-outline-dark">
                    Return to ship guide
                  </Link>
                  <Link
                    href="/return-to-ship-confidence"
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                  >
                    Confidence methodology
                  </Link>
                </div>
              </div>
              <div className="border border-[var(--border-light)] bg-surface-muted p-6 sm:p-8">
                <p className="section-eyebrow">Independent</p>
                <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900">
                  Built to help cruise passengers use a day ashore in Norway
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Norway Shore Excursions is a national planning resource. It
                  connects port context, schedules and excursion discovery with
                  dedicated local guides — without cruise-line affiliation or
                  live booking checkout on this site.
                </p>
                <Link
                  href="/about"
                  className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fjord)] underline-offset-4 hover:underline"
                >
                  About this site
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border-light)] bg-surface-muted py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Frequently asked questions
            </h2>
            <dl className="mt-8 space-y-6">
              {homeFaqs.map((faq) => (
                <div key={faq.question} className="border-b border-[var(--border-light)] pb-6">
                  <dt className="font-semibold text-slate-900">{faq.question}</dt>
                  <dd className="mt-2 leading-7 text-slate-700">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="hero-dark bg-navy py-14 text-white sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Need help choosing a Norway port day?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85">
              Explore ports and schedules first. When you want human guidance on
              planning questions, use the contact page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/norway-cruise-planner" className="btn-gold">
                Open cruise planner
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
