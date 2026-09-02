"use client";

import Link from "next/link";
import { useState } from "react";

import { siteConfig } from "@/lib/site-config";
import { secondaryNavLinks, siteNavLinks } from "@/lib/site-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex min-w-0 flex-col" onClick={() => setOpen(false)}>
          <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
            {siteConfig.name}
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-soft)] sm:block sm:text-[11px]">
            {siteConfig.tagline}
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {siteNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={siteConfig.plannerPath}
            className="btn-gold hidden text-sm lg:inline-flex"
          >
            Plan your cruise
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-white/25 px-3 text-sm font-medium lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-white/10 lg:hidden"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {[...siteNavLinks, ...secondaryNavLinks].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block min-h-11 rounded px-2 py-3 text-sm font-medium text-white/90 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={siteConfig.plannerPath}
                className="btn-gold w-full"
                onClick={() => setOpen(false)}
              >
                Plan your cruise
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
