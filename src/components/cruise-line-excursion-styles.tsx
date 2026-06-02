import Link from "next/link";

import type { CruiseLineExcursionStyle } from "@/lib/cruise-lines-data";

const styleMeta: Record<
  CruiseLineExcursionStyle["style"],
  { title: string; icon: string; cta: string }
> = {
  scenic: {
    title: "Best Scenic",
    icon: "🏔",
    cta: "Scenic excursion guides",
  },
  fjord: {
    title: "Best Fjord",
    icon: "🌊",
    cta: "Fjord excursion guides",
  },
  "small-group": {
    title: "Best Small Group",
    icon: "👥",
    cta: "Small group guides",
  },
  family: {
    title: "Best Family",
    icon: "🧒",
    cta: "Family excursion guides",
  },
  private: {
    title: "Best Private Tour",
    icon: "🚐",
    cta: "Private tour guides",
  },
};

const styleHref: Record<CruiseLineExcursionStyle["style"], string> = {
  scenic: "/scenic-drive-shore-excursions-norway",
  "small-group": "/small-group-shore-excursions-norway",
  private: "/private-shore-excursions-norway",
  family: "/family-shore-excursions-norway",
  fjord: "/fjord-shore-excursions-norway",
};

type CruiseLineExcursionStylesProps = {
  styles: readonly CruiseLineExcursionStyle[];
  cruiseLineShortName?: string;
  className?: string;
};

export function CruiseLineExcursionStyles({
  styles,
  cruiseLineShortName,
  className = "",
}: CruiseLineExcursionStylesProps) {
  return (
    <section className={className}>
      <h2>Best excursions for passengers</h2>
      <p>
        {cruiseLineShortName
          ? `Excursion styles that suit ${cruiseLineShortName} on Norway port days.`
          : "Excursion styles for Norway port days. Planning guides only."}
      </p>
      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {styles.map((item) => {
          const meta = styleMeta[item.style];
          return (
            <li key={item.style}>
              <article className="premium-card flex h-full flex-col p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl"
                    aria-hidden
                  >
                    {meta.icon}
                  </span>
                  <p className="text-base font-bold text-slate-900">
                    {meta.title}
                  </p>
                </div>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
                <Link
                  href={styleHref[item.style]}
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--glacier-blue)]"
                >
                  {meta.cta} →
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm">
        <Link
          href="/norway-shore-excursions"
          className="content-link font-medium"
        >
          Browse all Norway shore excursion themes →
        </Link>
      </p>
    </section>
  );
}
