import Link from "next/link";

import { getPortImage } from "@/lib/site-images";
import type { PortData } from "@/lib/ports-data";

export function PortCard({ port }: { port: PortData }) {
  const img = getPortImage(port.slug);

  return (
    <Link
      href={`/ports/${port.slug}`}
      className="premium-card group block overflow-hidden"
    >
      <div
        className="h-40 bg-cover bg-center transition group-hover:scale-[1.02]"
        style={{ backgroundImage: `url(${img.url})` }}
        role="img"
        aria-label={img.alt}
      />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
          {port.region}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          {port.displayName}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">
          {port.heroTour} · {port.bestFor}
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-[var(--glacier-blue)]">
          View port guide →
        </span>
      </div>
    </Link>
  );
}
