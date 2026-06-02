import { notFound, redirect } from "next/navigation";

import { findYourShipCatalog } from "@/lib/find-your-ship";
import { getShipScheduleSummaryBySlug, shipPagePath } from "@/lib/ship-schedules";

type CruiseLineShipPageProps = {
  params: Promise<{ slug: string }>;
};

const catalogSlugs = new Set<string>(
  findYourShipCatalog.map((entry) => entry.slug),
);

export function generateStaticParams() {
  return findYourShipCatalog.map((entry) => ({ slug: entry.slug }));
}

export default async function CruiseLineShipPage({ params }: CruiseLineShipPageProps) {
  const { slug } = await params;

  if (!catalogSlugs.has(slug)) {
    notFound();
  }

  if (getShipScheduleSummaryBySlug(slug)) {
    redirect(shipPagePath(slug));
  }

  notFound();
}
