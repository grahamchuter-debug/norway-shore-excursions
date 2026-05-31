"use client";

import Image from "next/image";
import { useState } from "react";

import { ShipImageFallback } from "@/components/ship-image-fallback";
import { CruiseLineLogo } from "@/components/cruise-line-logo";
import type { ShipCardBadgeInput } from "@/lib/ship-card-badges";
import { getShipImagePath } from "@/lib/ship-images";

type ShipImageProps = {
  slug: string;
  shipName: string;
  cruiseLine?: string;
  className?: string;
  priority?: boolean;
  showOverlayLabels?: boolean;
  capacityLabel?: string;
  callCount?: number;
  badgeInput?: ShipCardBadgeInput;
};

export function ShipImage({
  slug,
  shipName,
  cruiseLine,
  className = "",
  priority = false,
  showOverlayLabels = false,
  capacityLabel,
  callCount,
  badgeInput,
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
        capacityLabel={capacityLabel}
        callCount={callCount}
        badgeInput={badgeInput}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--navy-deep)] ${className}`.trim()}
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
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--navy-deep)]/85 to-transparent px-4 pb-3 pt-10">
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
