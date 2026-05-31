import {
  resolveShipCardBadges,
  type PrimaryShipBadgeVariant,
  type ShipCardBadgeInput,
} from "@/lib/ship-card-badges";

const primaryVariantClasses: Record<PrimaryShipBadgeVariant, string> = {
  "most-active":
    "border-[var(--gold)]/40 bg-[var(--gold)] text-[var(--navy-deep)]",
  "mega-ship":
    "border-[var(--glacier-blue)]/30 bg-[var(--glacier-blue)] text-white",
  viking:
    "border-emerald-600/25 bg-emerald-700 text-white",
  "holland-america":
    "border-[var(--navy-deep)]/20 bg-[var(--navy-deep)] text-white",
  cunard:
    "border-amber-700/30 bg-amber-800 text-amber-50",
  celebrity:
    "border-violet-600/25 bg-violet-700 text-white",
  "p-and-o":
    "border-teal-600/25 bg-teal-700 text-white",
  msc: "border-sky-400/30 bg-sky-500 text-white",
  fallback:
    "border-slate-300 bg-slate-500 text-white",
};

const secondaryBadgeClass =
  "border-[var(--border-light)] bg-surface-muted text-slate-700";

const mostVisitsBadgeClass =
  "border-[var(--glacier-blue)]/25 bg-[var(--navy-deep)] text-white";

type ShipCardBadgesProps = {
  input: ShipCardBadgeInput;
  className?: string;
};

function BadgePill({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex max-w-full truncate rounded-full border px-2.5 py-0.5 text-[10px] font-semibold leading-snug tracking-wide sm:text-xs ${className}`}
    >
      {label}
    </span>
  );
}

export function ShipCardBadges({ input, className = "" }: ShipCardBadgesProps) {
  const badges = resolveShipCardBadges(input);
  const rootClass = `flex flex-col gap-1.5 ${className}`.trim();

  if (badges.insufficientData && badges.primary) {
    return (
      <div className={rootClass}>
        <div className="flex flex-wrap gap-1.5">
          <BadgePill
            label={badges.primary.label}
            className={primaryVariantClasses[badges.primary.variant]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass}>
      {badges.primary ? (
        <div className="flex flex-wrap gap-1.5">
          <BadgePill
            label={badges.primary.label}
            className={primaryVariantClasses[badges.primary.variant]}
          />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-1.5">
        {badges.portCallsLabel ? (
          <BadgePill label={badges.portCallsLabel} className={secondaryBadgeClass} />
        ) : null}
        {badges.mostVisitsLabel ? (
          <BadgePill
            label={badges.mostVisitsLabel}
            className={mostVisitsBadgeClass}
          />
        ) : null}
      </div>
    </div>
  );
}
