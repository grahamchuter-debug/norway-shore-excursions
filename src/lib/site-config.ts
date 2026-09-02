import { imageAlts, siteImages } from "@/lib/site-images";

export const siteConfig = {
  name: "Norway Shore Excursions",
  url: "https://norwayshoreexcursions.com",
  locale: "en_GB",
  tagline: "Independent cruise-port planning for Norway",
  defaultDescription:
    "Independent cruise-port planning for Norway. Compare Norway cruise ports, ship schedules through 2027, and shore excursion ideas for fjords, cities and Arctic calls.",
  defaultOgImage: siteImages.hero,
  defaultOgImageAlt: imageAlts.hero,
  copyrightEntity: "Norway Shore Excursions",
  plannerPath: "/norway-cruise-planner",
  portsPath: "/norway-cruise-ports",
  contactEmail: "hello@norwayshoreexcursions.com",
  /** Cloudflare Email Routing active: hello@ → info@wowatour.com */
  contactEmailVerified: true,
} as const;
