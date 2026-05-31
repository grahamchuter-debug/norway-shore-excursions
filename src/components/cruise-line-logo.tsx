"use client";

import Image from "next/image";
import { useState } from "react";

import { getCruiseLineLogoPath } from "@/lib/cruise-line-logos";

type CruiseLineLogoProps = {
  cruiseLine: string;
  className?: string;
  variant?: "inline" | "badge";
};

export function CruiseLineLogo({
  cruiseLine,
  className = "",
  variant = "inline",
}: CruiseLineLogoProps) {
  const logoPath = getCruiseLineLogoPath(cruiseLine);
  const [hidden, setHidden] = useState(false);

  if (!logoPath || hidden) return null;

  const sizeClass =
    variant === "badge"
      ? "h-8 w-auto max-w-[120px] rounded-md bg-white/90 px-2 py-1 shadow-sm"
      : "h-7 w-auto max-w-[110px]";

  return (
    <Image
      src={logoPath}
      alt=""
      width={120}
      height={40}
      className={`object-contain object-left ${sizeClass} ${className}`.trim()}
      aria-hidden
      onError={() => setHidden(true)}
    />
  );
}
