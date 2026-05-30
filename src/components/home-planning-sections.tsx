"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { NorwayCruisePlanner } from "@/components/norway-cruise-planner";
import { PopularCruiseRoutes } from "@/components/popular-cruise-routes";
import { getRouteById } from "@/lib/cruise-itineraries";
import { norwayDestinationConfig } from "@/lib/destination-config";
import type { PlannerInterest } from "@/lib/ports-data";

const plannerHighlights = [
  "Norway Cruise Match score",
  "Port by port recommendations",
  "Return to ship confidence",
  "Traveller type matching",
] as const;

export function HomePlanningSections() {
  const plannerRef = useRef<HTMLDivElement>(null);
  const [presetPorts, setPresetPorts] = useState<string[]>([]);
  const [presetInterests, setPresetInterests] = useState<PlannerInterest[]>([]);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [plannerVersion, setPlannerVersion] = useState(0);

  const handleRouteSelect = useCallback((routeId: string) => {
    const route = getRouteById(routeId);
    if (!route) return;
    setActiveRouteId(routeId);
    setPresetPorts([...route.portSlugs]);
    setPresetInterests([...route.interests]);
    setPlannerVersion((v) => v + 1);
    plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Start with a proven route
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Popular Norway cruise routes
            </h2>
            <p className="mt-3 text-slate-600">
              Pick a route to prefill the recommendation engine, then generate
              your personalised Norway Cruise Match plan.
            </p>
          </div>
          <div className="mt-8">
            <PopularCruiseRoutes
              activeRouteId={activeRouteId}
              onSelectRoute={handleRouteSelect}
            />
          </div>
        </div>
      </section>

      <section
        ref={plannerRef}
        id="norway-cruise-planner"
        className="scroll-mt-24 border-b bg-navy py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Personalised recommendation engine
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
              {norwayDestinationConfig.plannerTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-white/85 sm:text-lg">
              {norwayDestinationConfig.plannerSubtitle}
            </p>
          </div>

          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
            {plannerHighlights.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-10 max-w-5xl">
            <NorwayCruisePlanner
              key={plannerVersion}
              compact
              initialPorts={presetPorts}
              initialInterests={presetInterests}
            />
          </div>

          <p className="mt-8 text-center">
            <Link
              href={norwayDestinationConfig.plannerPath}
              className="btn-gold inline-flex min-h-11 items-center px-6 text-sm"
            >
              Open full {norwayDestinationConfig.plannerCtaLabel}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
