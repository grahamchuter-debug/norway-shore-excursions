"use client";

import Image from "next/image";

import {
  shipHasListedImage,
  shipImagePath,
  shipPlaceholderImagePath,
} from "@/lib/ships-data";

type ShipImageProps = {
  slug: string;
  shipName: string;
  className?: string;
  priority?: boolean;
};

export function ShipImage({
  slug,
  shipName,
  className = "",
  priority = false,
}: ShipImageProps) {
  const hasImage = shipHasListedImage(slug);
  const src = hasImage ? shipImagePath(slug) : shipPlaceholderImagePath();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-slate-100 ${className}`.trim()}
    >
      <Image
        src={src}
        alt={
          hasImage
            ? `${shipName} cruise ship`
            : `${shipName} cruise ship silhouette placeholder`
        }
        width={800}
        height={450}
        className={`h-full w-full object-cover ${hasImage ? "" : "opacity-60"}`}
        priority={priority}
        onError={(event) => {
          const target = event.currentTarget;
          if (target.src.endsWith("placeholder.svg")) return;
          target.src = shipPlaceholderImagePath();
        }}
      />
    </div>
  );
}
