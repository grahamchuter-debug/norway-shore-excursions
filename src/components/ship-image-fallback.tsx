import { CruiseLineLogo } from "@/components/cruise-line-logo";
import { ShipCardBadges } from "@/components/ship-card-badges";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";

type ShipImageFallbackProps = {
  shipName: string;
  cruiseLine?: string;
  className?: string;
  capacityLabel?: string;
  callCount?: number;
  badgeInput?: ShipCardBadgeInput;
};

function FjordWavePattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 450"
      aria-hidden
    >
      <defs>
        <linearGradient id="fjordFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4db8d9" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#4db8d9" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#fjordFade)" />
      <path
        d="M0 320 Q200 280 400 320 T800 320 L800 450 L0 450 Z"
        fill="#4db8d9"
        opacity="0.12"
      />
      <path
        d="M0 360 Q180 330 360 360 T720 350 L800 355 L800 450 L0 450 Z"
        fill="#061a2e"
        opacity="0.35"
      />
      <path
        d="M120 300h560l-40-80h-80l-32-64H272l-32 64h-80l-40 80zm192-140c0-28 22-50 50-50s50 22 50 50-22 50-50 50-50-22-50-50z"
        fill="#c9a227"
        opacity="0.1"
      />
    </svg>
  );
}

export function ShipImageFallback({
  shipName,
  cruiseLine,
  className = "",
  capacityLabel,
  callCount,
  badgeInput,
}: ShipImageFallbackProps) {
  const showCallCount = typeof callCount === "number" && callCount > 0;
  const showCapacity = Boolean(capacityLabel?.trim());

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-gradient-to-br from-[var(--navy-deep)] via-[#0a2540] to-[#041220] ${className}`.trim()}
      role="img"
      aria-label={`${shipName}${cruiseLine ? `, ${cruiseLine}` : ""}`}
    >
      <FjordWavePattern />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(77,184,217,0.16),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/15 to-transparent"
        aria-hidden
      />

      <div className="relative flex h-full min-h-[140px] flex-col items-center justify-between px-4 py-5 text-center sm:px-6 sm:py-6">
        <div className="flex w-full flex-col items-center gap-3">
          {cruiseLine ? (
            <CruiseLineLogo cruiseLine={cruiseLine} variant="badge" />
          ) : null}
          {badgeInput ? (
            <ShipCardBadges input={badgeInput} primaryOnly className="items-center" />
          ) : null}
        </div>

        <div className="flex w-full flex-col items-center gap-2 px-2">
          <h3 className="text-xl font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-2xl md:text-3xl">
            {shipName}
          </h3>
          {cruiseLine ? (
            <p className="text-sm font-medium text-slate-300/90 sm:text-base">
              {cruiseLine}
            </p>
          ) : null}
        </div>

        {showCallCount || showCapacity ? (
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold sm:text-sm">
            {showCallCount ? (
              <li className="text-[var(--glacier-blue)]">
                {callCount} Norway Port Call{callCount === 1 ? "" : "s"}
              </li>
            ) : null}
            {showCapacity ? (
              <li className="text-[var(--gold)]">{capacityLabel}</li>
            ) : null}
          </ul>
        ) : (
          <div className="h-1" aria-hidden />
        )}
      </div>
    </div>
  );
}
