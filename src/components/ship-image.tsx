"use client";

import Image from "next/image";
import { useState } from "react";

import { CruiseLineLogo } from "@/components/cruise-line-logo";
import {
  getShipImagePath,
  shipPlaceholderImagePath,
} from "@/lib/ship-images";

type ShipImageProps = {
  slug: string;
  shipName: string;
  cruiseLine?: string;
  className?: string;
  priority?: boolean;
  showOverlayLabels?: boolean;
};

function ShipImageFallback({
  shipName,
  cruiseLine,
  className,
}: {
  shipName: string;
  cruiseLine?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 ${className}`.trim()}
    >
      <Image
        src={shipPlaceholderImagePath()}
        alt=""
        width={800}
        height={450}
        className="h-full w-full object-cover opacity-80"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-900/80" />
      {cruiseLine ? (
        <div className="absolute inset-x-0 top-0 flex items-start justify-center px-4 pt-5 sm:pt-6">
          <CruiseLineLogo cruiseLine={cruiseLine} variant="hero" />
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12 text-center">
        <p className="text-base font-bold text-white drop-shadow-sm sm:text-lg">
          {shipName}
        </p>
      </div>
    </div>
  );
}

export function ShipImage({
  slug,
  shipName,
  cruiseLine,
  className = "",
  priority = false,
  showOverlayLabels = false,
}: ShipImageProps) {
  const mappedPath = getShipImagePath(slug) ?? getShipImagePath(shipName);
  const [failed, setFailed] = useState(false);
  const useFallback = !mappedPath || failed;

  if (useFallback) {
    return (
      <ShipImageFallback
        shipName={shipName}
        cruiseLine={cruiseLine}
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-slate-100 ${className}`.trim()}
    >
      <Image
        src={mappedPath}
        alt={`${shipName} cruise ship`}
        width={800}
        height={450}
        className="h-full w-full object-cover"
        priority={priority}
        onError={() => setFailed(true)}
      />
      {showOverlayLabels ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent px-4 pb-3 pt-10">
          {cruiseLine ? (
            <div className="mb-1">
              <CruiseLineLogo cruiseLine={cruiseLine} variant="badge" />
            </div>
          ) : null}
          <p className="text-sm font-bold text-white">{shipName}</p>
        </div>
      ) : null}
    </div>
  );
}
