import Link from "next/link";

import { localPortSites } from "@/lib/cruise-lines-data";
import { interestThemeLinks } from "@/lib/themes-data";
import { siteConfig } from "@/lib/site-config";

const authorityLinks = [
  { label: "Norway Cruise Ports", href: "/norway-cruise-ports" },
  { label: "Shore Excursions", href: "/norway-shore-excursions" },
  { label: "Best Excursions", href: "/best-norway-shore-excursions" },
  { label: "Cruise Planner", href: "/norway-cruise-planner" },
  { label: "Cruise Lines", href: "/cruise-lines" },
  { label: "When to Cruise", href: "/when-to-cruise-norway" },
  { label: "Port Map", href: "/norway-cruise-port-map" },
  { label: "Return to Ship Guide", href: "/return-to-ship-guide" },
] as const;

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <section className="border-t border-white/10 bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Norway Cruise Planner™
          </p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            Plan every Norway port before you sail
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Use our smart cruise planner for AI style recommendations across
            fjords, glaciers, Arctic ports and historic cities, then book
            independently via trusted local port guides.
          </p>
          <Link
            href={siteConfig.plannerPath}
            className="btn-gold mt-6 shadow-lg sm:text-base"
          >
            Start Cruise Planner
          </Link>
        </div>
      </section>

      <div className="relative border-t border-white/10 bg-navy-deep text-slate-300">
        <div
          aria-hidden="true"
          className="section-divider absolute inset-x-0 top-0"
        />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-white transition hover:text-[var(--glacier-blue)]"
              >
                {siteConfig.name}
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
                Norway&apos;s independent cruise excursion authority. We connect
                passengers with local port specialists, not cruise line
                excursion desks.
              </p>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Independent cruise excursion planning guide. No official
                partnership with any cruise line.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:col-span-1 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              <FooterColumn title="Authority Guides">
                <ul className="space-y-2">
                  {authorityLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-[var(--glacier-blue)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="By Interest">
                <ul className="space-y-2">
                  {interestThemeLinks.slice(0, 8).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-[var(--glacier-blue)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Local Port Sites">
                <ul className="space-y-2">
                  {localPortSites.map((port) => (
                    <li key={port.slug}>
                      <a
                        href={port.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/65 transition hover:text-[var(--glacier-blue)]"
                      >
                        {port.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>

          <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-5 text-white/45">
            © 2026 {siteConfig.copyrightEntity}. Independent cruise excursion
            planning guide for Norway shore excursions. Not affiliated with any
            cruise line or port authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
