import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { siteNavLinks } from "@/lib/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex flex-col">
          <span className="text-base font-bold tracking-tight sm:text-lg">
            {siteConfig.name}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--gold)] sm:text-xs">
            National Cruise Authority
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 xl:flex"
        >
          {siteNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition hover:text-[var(--glacier-blue)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href={siteConfig.plannerPath} className="btn-gold text-xs sm:text-sm">
          Cruise Planner
        </Link>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="border-t border-white/10 xl:hidden"
      >
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {siteNavLinks.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="block rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/85 transition hover:border-[var(--gold)] hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
