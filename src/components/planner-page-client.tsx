"use client";

import { useSearchParams } from "next/navigation";

import { NorwayCruisePlanner } from "@/components/norway-cruise-planner";

export function PlannerPageClient() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("route") ?? undefined;

  return <NorwayCruisePlanner initialRouteId={routeId} />;
}
