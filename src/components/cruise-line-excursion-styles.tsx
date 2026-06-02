import Link from "next/link";

import type { CruiseLineExcursionStyle } from "@/lib/cruise-lines-data";

const styleHref: Record<CruiseLineExcursionStyle["style"], string> = {
  scenic: "/scenic-drive-shore-excursions-norway",
  "small-group": "/small-group-shore-excursions-norway",
  private: "/private-shore-excursions-norway",
  family: "/family-shore-excursions-norway",
  fjord: "/fjord-shore-excursions-norway",
};

type CruiseLineExcursionStylesProps = {
  styles: readonly CruiseLineExcursionStyle[];
  className?: string;
};

export function CruiseLineExcursionStyles({
  styles,
  className = "",
}: CruiseLineExcursionStylesProps) {
  return (
    <ul
      className={`card-grid mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
    >
      {styles.map((item) => (
        <li key={item.style}>
          <article className="premium-card flex h-full flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
              {item.title}
            </p>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
            <Link
              href={styleHref[item.style]}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--glacier-blue)]"
            >
              Explore {item.title.toLowerCase()} guidance →
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
