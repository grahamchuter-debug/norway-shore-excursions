import Link from "next/link";

import { portDayTips } from "@/lib/port-day-tips";

type DontWastePortDayProps = {
  compact?: boolean;
  limit?: number;
};

export function DontWastePortDay({
  compact = false,
  limit,
}: DontWastePortDayProps) {
  const tips = limit ? portDayTips.slice(0, limit) : portDayTips;

  return (
    <section
      className={
        compact
          ? "hero-dark border-y bg-navy py-12 text-white"
          : "hero-dark border-y bg-navy py-16 text-white"
      }
      id="dont-waste-port-day"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
          Smarter port days
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Don&apos;t Waste Your Norway Port Day
        </h2>
        <p className="mt-3 max-w-2xl text-white/75">
          Common cruise-day mistakes at Norway&apos;s headline ports, and the
          better excursion choices that deliver real scenery payoff.
        </p>

        <ul className="card-grid mt-8 grid gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <li
              key={tip.slug}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <h3 className="font-bold text-[var(--gold)]">{tip.port}</h3>
              <p className="mt-3 text-sm leading-6 text-white/85">{tip.dont}</p>
              <p className="mt-2 text-sm leading-6 text-white">
                <strong className="text-[var(--glacier-blue)]">Better:</strong>{" "}
                {tip.better}
              </p>
              <Link
                href={`/ports/${tip.slug}`}
                className="mt-4 inline-block text-sm font-medium text-white/90 underline hover:text-white"
              >
                {tip.port} port guide →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
