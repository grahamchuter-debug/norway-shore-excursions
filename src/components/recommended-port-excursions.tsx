import Link from "next/link";

import {
  getPortRecommendedExcursions,
  type RecommendedExcursionCard,
} from "@/lib/port-recommended-excursions";

type RecommendedPortExcursionsProps = {
  portSlug: string;
  portDisplayName: string;
  fitExcursionHref?: string;
  className?: string;
};

function ExcursionCardLink({ card }: { card: RecommendedExcursionCard }) {
  const linkClassName =
    "mt-4 inline-flex text-sm font-semibold text-[var(--glacier-blue)] transition hover:text-[var(--glacier-blue-hover)]";

  if (card.external) {
    return (
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {card.ctaLabel} →
      </a>
    );
  }

  return (
    <Link href={card.url} className={linkClassName}>
      {card.ctaLabel} →
    </Link>
  );
}

export function RecommendedPortExcursions({
  portSlug,
  portDisplayName,
  fitExcursionHref,
  className = "",
}: RecommendedPortExcursionsProps) {
  const cards = getPortRecommendedExcursions(portSlug, { fitExcursionHref });

  return (
    <section
      className={`rounded-2xl border border-[var(--border-light)] bg-surface-muted p-6 sm:p-8 ${className}`.trim()}
    >
      <h2 className="text-xl font-bold text-[var(--navy-deep)] sm:text-2xl">
        Recommended shore excursions for this port
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
        Visiting {portDisplayName} on this sailing? These cruise friendly tours
        are selected with port timings and return to ship confidence in mind.
      </p>

      <ul className="card-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.title}>
            <article className="premium-card flex h-full flex-col p-5">
              <h3 className="text-base font-bold text-[var(--navy-deep)] sm:text-lg">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {card.benefit}
              </p>
              <ExcursionCardLink card={card} />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
