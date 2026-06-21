import { notFound } from "next/navigation";

import { ShipAuthorityPage } from "@/components/ship-authority-page";
import { ShipStandardPage } from "@/components/ship-standard-page";
import { isAuthorityShip } from "@/lib/ship-authority";
import {
  getAllShipSlugs,
  getShipScheduleSummaryBySlug,
  shipPagePath,
} from "@/lib/ship-schedules";
import { buildPageMetadata } from "@/lib/site-metadata";
import { imageAlts, siteImages } from "@/lib/site-images";

type ShipPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllShipSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ShipPageProps) {
  const { slug } = await params;
  const ship = getShipScheduleSummaryBySlug(slug);
  if (!ship) return {};

  const yearsLabel =
    ship.visitsByYear.map((entry) => entry.year).join(" and ") || "2026 and 2027";
  const authority = isAuthorityShip(slug);

  return buildPageMetadata({
    title: authority
      ? `${ship.ship} Norway Cruise Guide`
      : `${ship.ship} Norway Cruise Schedule`,
    description: authority
      ? `${ship.ship} (${ship.cruiseLine}) Norway authority guide: ${ship.callCount} port calls (${yearsLabel}), ${ship.capacityLabel}, itinerary patterns and shore excursion planning.`
      : `${ship.ship} (${ship.cruiseLine}) Norway port schedule (${yearsLabel}): ${ship.callCount} calls, ${ship.capacityLabel}, top ports ${ship.topPorts.map((p) => p.portDisplayName).join(", ")}.`,
    path: shipPagePath(slug),
    ogImage: siteImages.hero,
    ogImageAlt: imageAlts.hero,
  });
}

export default async function ShipPage({ params }: ShipPageProps) {
  const { slug } = await params;
  const ship = getShipScheduleSummaryBySlug(slug);
  if (!ship) notFound();

  if (isAuthorityShip(slug)) {
    return <ShipAuthorityPage ship={ship} />;
  }

  return <ShipStandardPage ship={ship} />;
}
