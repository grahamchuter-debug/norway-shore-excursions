"use client";

import Image from "next/image";
import { useState } from "react";

import {
  getCruiseLineLogoPath,
  resolveCruiseLineLogoKey,
} from "@/lib/cruise-line-logos";

type CruiseLineLogoProps = {
  cruiseLine: string;
  className?: string;
  variant?: "inline" | "badge" | "hero";
};

const variantClasses: Record<NonNullable<CruiseLineLogoProps["variant"]>, string> =
  {
    inline: "h-7 w-auto max-w-[110px] object-contain object-left",
    badge:
      "h-9 w-auto max-w-[140px] rounded-lg bg-white/95 px-3 py-1.5 object-contain shadow-md ring-1 ring-white/30",
    hero: "h-16 w-auto max-w-[min(300px,88%)] rounded-xl bg-white/95 px-5 py-3 object-contain shadow-lg ring-1 ring-slate-900/10 sm:h-20 sm:max-w-[340px] sm:px-6 sm:py-4",
  };

function CruiseLineLogoFallback({
  cruiseLine,
  variant,
  className,
}: {
  cruiseLine: string;
  variant: NonNullable<CruiseLineLogoProps["variant"]>;
  className: string;
}) {
  const label = cruiseLine.trim() || "Cruise line";
  const heroClass =
    variant === "hero"
      ? "rounded-xl bg-white/95 px-5 py-3 text-lg font-bold tracking-wide text-slate-900 shadow-lg ring-1 ring-slate-900/10 sm:px-6 sm:py-3.5 sm:text-xl"
      : variant === "badge"
        ? "rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold tracking-wide text-slate-900 shadow-md ring-1 ring-white/30 sm:text-sm"
        : "text-sm font-semibold text-slate-700";

  return (
    <span
      className={`inline-flex max-w-full items-center justify-center ${heroClass} ${className}`.trim()}
      aria-hidden
    >
      {label}
    </span>
  );
}

export function CruiseLineLogo({
  cruiseLine,
  className = "",
  variant = "inline",
}: CruiseLineLogoProps) {
  const logoPath = getCruiseLineLogoPath(cruiseLine);
  const [failed, setFailed] = useState(false);

  if (!resolveCruiseLineLogoKey(cruiseLine)) return null;

  if (!logoPath || failed) {
    return (
      <CruiseLineLogoFallback
        cruiseLine={cruiseLine}
        variant={variant}
        className={className}
      />
    );
  }

  return (
    <Image
      src={logoPath}
      alt=""
      width={280}
      height={96}
      className={`${variantClasses[variant]} ${className}`.trim()}
      aria-hidden
      onError={() => setFailed(true)}
    />
  );
}
