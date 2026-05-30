import { imageAlts, siteImages } from "@/lib/site-images";

export const siteConfig = {
  name: "Norway Shore Excursions",
  url: "https://norwayshoreexcursions.com",
  locale: "en_GB",
  defaultDescription:
    "Plan Norway shore excursions and Norway cruise excursions with the free Norway Cruise Planner. Compare best Norway shore excursions, Norway cruise ports, fjord tours and Arctic adventures.",
  defaultOgImage: siteImages.hero,
  defaultOgImageAlt: imageAlts.hero,
  copyrightEntity: "Norway Shore Excursions",
  plannerPath: "/norway-cruise-planner",
  portsPath: "/norway-cruise-ports",
} as const;
