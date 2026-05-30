"use client";

import Link from "next/link";

import { popularCruiseRoutes } from "@/lib/cruise-itineraries";
import { portBySlug } from "@/lib/ports-data";

type PopularCruiseRoutesProps = {
  onSelectRoute?: (routeId: string) => void;
  activeRouteId?: string | null;
  linkToPlanner?: boolean;
};

const accentStyles = {
  fjord: "border-l-[var(--glacier-blue)]",
  glacier: "border-l-[var(--fjord-green)]",
  arctic: "border-l-indigo-400",
  city: "border-l-[var(--gold)]",
  adventure: "border-l-orange-400",
} as const;

export function PopularCruiseRoutes({
  onSelectRoute,
  activeRouteId,
  linkToPlanner = false,
}: PopularCruiseRoutesProps) {
  return (
    <section className="border-b bg-white py-16" id="popular-cruise-routes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          Proven itineraries
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Popular Norway Cruise Routes
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Start with a proven route, then open the Norway Cruise Planner to
          preselect matching ports and refine for your ship and port times.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {popularCruiseRoutes.map((route) => {
            const isActive = activeRouteId === route.id;
            const portNames = route.portSlugs
              .map((s) => portBySlug[s]?.displayName ?? s)
              .join(", ");

            const cardContent = (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                  Cruise route
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {route.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {portNames}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {route.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-block text-sm font-semibold text-[var(--glacier-blue)]">
                  {linkToPlanner
                    ? "Open in planner →"
                    : isActive
                      ? "Selected, see planner below"
                      : "Use in planner →"}
                </span>
              </>
            );

            if (linkToPlanner) {
              return (
                <Link
                  key={route.id}
                  href={`/norway-cruise-planner?route=${route.id}`}
                  className={`premium-card group block w-full border-l-4 p-5 transition hover:ring-1 hover:ring-[var(--border-light)] ${accentStyles[route.accent]}`}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => onSelectRoute?.(route.id)}
                className={`premium-card group w-full border-l-4 p-5 text-left transition ${accentStyles[route.accent]} ${
                  isActive
                    ? "ring-2 ring-[var(--glacier-blue)] ring-offset-2"
                    : "hover:ring-1 hover:ring-[var(--border-light)]"
                }`}
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
