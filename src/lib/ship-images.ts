import shipImageAliases from "../../data/ships/ship-image-aliases.json";
import shipImagesOnDisk from "../../data/ships/ship-images-on-disk.json";
import shipImageMap from "../../data/ships/ship-images.json";
import { shipNameToSlug } from "@/lib/ship-schedules";

const images = shipImageMap as Record<string, string>;
const aliases = shipImageAliases as Record<string, string>;
const onDiskSlugs = new Set(shipImagesOnDisk as string[]);

export function normalizeShipImageKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^ms\s+/, "")
    .replace(/^mv\s+/, "")
    .replace(/^msc\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveShipImageSlug(
  shipNameOrSlug: string,
): string | null {
  const raw = String(shipNameOrSlug ?? "").trim();
  if (!raw) return null;

  if (images[raw]) return raw;

  const slugFromName = shipNameToSlug(raw);
  if (images[slugFromName]) return slugFromName;

  const aliasKey = normalizeShipImageKey(raw);
  if (aliases[aliasKey]) return aliases[aliasKey];

  const slugAlias = aliases[slugFromName.replace(/-/g, " ")];
  if (slugAlias) return slugAlias;

  return null;
}

export function shipImageFileExists(slug: string): boolean {
  return onDiskSlugs.has(slug);
}

export function getShipImagePath(shipNameOrSlug: string): string | null {
  const slug = resolveShipImageSlug(shipNameOrSlug);
  if (!slug) return null;
  if (!shipImageFileExists(slug)) return null;
  return images[slug] ?? null;
}

export function shipHasListedImage(shipNameOrSlug: string): boolean {
  return getShipImagePath(shipNameOrSlug) != null;
}

export function shipPlaceholderImagePath(): string {
  return "/images/ships/placeholder.svg";
}

export function getAllMappedShipImageSlugs(): string[] {
  return Object.keys(images).sort();
}

export function getShipImageSlugsOnDisk(): string[] {
  return [...onDiskSlugs].sort();
}
