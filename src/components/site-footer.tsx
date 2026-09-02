import Link from "next/link";

import { localPortSites } from "@/lib/cruise-lines-data";
import { siteConfig } from "@/lib/site-config";

const planLinks = [
  { label: "Cruise ports", href: "/norway-cruise-ports" },
  { label: "Shore excursion ideas", href: "/norway-shore-excursions" },
  { label: "Best Norway shore excursions", href: "/best-norway-shore-excursions" },
  { label: "When to cruise Norway", href: "/when-to-cruise-norway" },
  { label: "Return to ship guide", href: "/return-to-ship-guide" },
  { label: "Port map", href: "/norway-cruise-port-map" },
] as const;

const toolLinks = [
  { label: "Cruise planner", href: "/norway-cruise-planner" },
  { label: "Ship schedules", href: "/ship-schedules" },
  { label: "Cruise calendar", href: "/norway-cruise-calendar" },
  { label: "Cruise lines", href: "/cruise-lines" },
  { label: "Ships", href: "/ships" },
  { label: "Schedule search", href: "/ship-schedules/search" },
] as const;

const aboutLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
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
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-soft)]">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer mt-auto">
      <section className="border-t border-white/10 bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <p className="section-eyebrow !text-[var(--accent-soft)]">
            Norway Cruise Planner
          </p>
          <h2 className="font-display mt-3 text-2xl font-semibold sm:text-3xl">
            Plan every Norway port before you sail
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Match your ports, ship timing and interests to shore excursion ideas,
            then continue to dedicated local port guides when you are ready for
            detail.
          </p>
          <Link href={siteConfig.plannerPath} className="btn-gold mt-6">
            Open cruise planner
          </Link>
        </div>
      </section>

      <div className="border-t border-white/10 bg-navy-deep text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-white transition hover:text-white/85"
              >
                {siteConfig.name}
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/65">
                Independent cruise-port planning for Norway — national schedules,
                port guides and excursion discovery for passengers ashore.
              </p>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Not affiliated with any cruise line or port authority. Information
                is for planning and should be verified with your cruise line.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:col-span-1 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              <FooterColumn title="Plan">
                <ul className="space-y-2">
                  {planLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Cruise tools">
                <ul className="space-y-2">
                  {toolLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Norway ports">
                <ul className="space-y-2">
                  {localPortSites.map((port) => (
                    <li key={port.slug}>
                      <a
                        href={port.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {port.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="About">
                <ul className="space-y-2">
                  {aboutLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>

          <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-5 text-white/45">
            © {new Date().getFullYear()} {siteConfig.copyrightEntity}. Independent
            cruise planning guide for Norway shore excursions.
          </p>
        </div>
      </div>
    </footer>
  );
}
