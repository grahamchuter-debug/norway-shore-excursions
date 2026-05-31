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
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 ${className}`.trim()}
    >
      <Image
        src={shipPlaceholderImagePath()}
        alt=""
        width={800}
        height={450}
        className="h-full w-full object-cover opacity-70"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent px-4 pb-4 pt-16 text-center">
        {cruiseLine ? (
          <div className="mb-2">
            <CruiseLineLogo cruiseLine={cruiseLine} variant="badge" />
          </div>
        ) : null}
        <p className="text-base font-bold text-white sm:text-lg">{shipName}</p>
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
