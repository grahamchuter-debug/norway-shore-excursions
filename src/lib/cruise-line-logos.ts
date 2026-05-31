import cruiseLineLogoMap from "../../data/cruise-lines/cruise-line-logos.json";

const logos = cruiseLineLogoMap as Record<string, string>;

const cruiseLineNameToKey: readonly { key: string; names: readonly string[] }[] =
  [
    { key: "msc", names: ["MSC Cruises", "MSC"] },
    {
      key: "p-and-o",
      names: ["P&O Cruises", "P&O", "P & O", "P and O Cruises"],
    },
    { key: "celebrity", names: ["Celebrity Cruises", "Celebrity"] },
    { key: "cunard", names: ["Cunard Line", "Cunard"] },
    { key: "viking", names: ["Viking", "Viking Oceans"] },
    {
      key: "holland-america",
      names: ["Holland America Line", "Holland America"],
    },
    {
      key: "norwegian",
      names: ["Norwegian Cruise Line", "Norwegian"],
    },
    { key: "aida", names: ["AIDA"] },
    {
      key: "ambassador",
      names: ["Ambassador Cruise Line", "Ambassador"],
    },
  ];

function normalizeCruiseLineKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

export function resolveCruiseLineLogoKey(cruiseLine: string): string | null {
  const normalized = normalizeCruiseLineKey(cruiseLine);
  if (!normalized) return null;

  for (const entry of cruiseLineNameToKey) {
    for (const name of entry.names) {
      const nameKey = normalizeCruiseLineKey(name);
      if (
        normalized === nameKey ||
        normalized.includes(nameKey) ||
        nameKey.includes(normalized)
      ) {
        return entry.key;
      }
    }
  }

  return null;
}

export function getCruiseLineLogoPath(cruiseLine: string): string | null {
  const key = resolveCruiseLineLogoKey(cruiseLine);
  if (!key) return null;
  return logos[key] ?? null;
}

export function cruiseLineHasLogo(cruiseLine: string): boolean {
  return getCruiseLineLogoPath(cruiseLine) != null;
}

export function getAllCruiseLineLogoKeys(): string[] {
  return Object.keys(logos).sort();
}
