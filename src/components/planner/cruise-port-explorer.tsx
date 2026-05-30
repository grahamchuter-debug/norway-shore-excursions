"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MapListToggle, type ViewMode } from "@/components/planner/map-list-toggle";
import { PortListView } from "@/components/planner/port-list-view";
import { PortMapView } from "@/components/planner/port-map-view";
import type { DestinationConfig, DestinationPort } from "@/lib/destination-port-types";
import {
  orderPortsForRoute,
  portMatchesFilter,
} from "@/lib/destination-port-types";

type CruisePortExplorerProps = {
  config: DestinationConfig;
  ports: readonly DestinationPort[];
  compact?: boolean;
  variant?: "primary" | "secondary";
  routePorts?: readonly string[];
  routeLabel?: string;
  showSectionHeader?: boolean;
  showFooterLink?: boolean;
  stickyToggle?: boolean;
  /** Limit to specific port slugs (e.g. planner recommendations) */
  visiblePortSlugs?: readonly string[];
  sectionId?: string;
  initialSelectedSlug?: string;
};

export function CruisePortExplorer({
  config,
  ports,
  compact = false,
  variant = "primary",
  routePorts,
  routeLabel,
  showSectionHeader = true,
  showFooterLink = true,
  stickyToggle = false,
  visiblePortSlugs,
  sectionId = "cruise-port-explorer",
  initialSelectedSlug,
}: CruisePortExplorerProps) {
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [activeFilter, setActiveFilter] = useState(config.defaultFilterId);
  const [selectedSlug, setSelectedSlug] = useState(
    initialSelectedSlug ?? ports[0]?.slug ?? "flam",
  );

  useEffect(() => {
    if (variant === "secondary") {
      setViewMode("list");
      return;
    }
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setViewMode(mobile ? "list" : "map");
  }, [variant]);

  const scopedPorts = useMemo(() => {
    if (!visiblePortSlugs?.length) return ports;
    const allowed = new Set(visiblePortSlugs);
    return ports.filter((p) => allowed.has(p.slug));
  }, [ports, visiblePortSlugs]);

  const filteredPorts = useMemo(() => {
    const matching = scopedPorts.filter((p) =>
      portMatchesFilter(p, activeFilter),
    );
    return orderPortsForRoute(matching, routePorts);
  }, [scopedPorts, activeFilter, routePorts]);

  const dimmedSlugs = useMemo(() => {
    if (activeFilter === config.defaultFilterId) return new Set<string>();
    const matching = new Set(filteredPorts.map((p) => p.slug));
    return new Set(
      scopedPorts.filter((p) => !matching.has(p.slug)).map((p) => p.slug),
    );
  }, [scopedPorts, filteredPorts, activeFilter, config.defaultFilterId]);

  useEffect(() => {
    if (!scopedPorts.some((p) => p.slug === selectedSlug) && scopedPorts[0]) {
      setSelectedSlug(scopedPorts[0].slug);
    }
  }, [scopedPorts, selectedSlug]);

  const listPorts = useMemo(() => {
    if (activeFilter === config.defaultFilterId) {
      return orderPortsForRoute(scopedPorts, routePorts);
    }
    return filteredPorts;
  }, [scopedPorts, filteredPorts, activeFilter, routePorts, config.defaultFilterId]);

  const isSecondary = variant === "secondary";

  return (
    <section
      className={
        compact
          ? "py-10"
          : isSecondary
            ? "border-b bg-white py-12"
            : "border-b bg-surface-muted py-16"
      }
      id={sectionId}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {showSectionHeader ? (
          <>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                isSecondary ? "text-slate-500" : "text-[var(--gold)]"
              }`}
            >
              {isSecondary ? config.mapSecondaryEyebrow : "Interactive planning"}
            </p>
            <h2
              className={`mt-2 font-bold text-slate-900 ${
                isSecondary ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              }`}
            >
              {isSecondary ? config.mapSecondaryTitle : config.mapTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {isSecondary ? config.mapSecondarySubtitle : config.mapSubtitle}
            </p>
            {isSecondary ? (
              <p className="mt-4">
                <Link
                  href={config.plannerPath}
                  className="text-sm font-semibold text-[var(--glacier-blue)] underline"
                >
                  {config.plannerCtaLabel} for personalised picks →
                </Link>
              </p>
            ) : null}
          </>
        ) : null}

        <div
          className={`${showSectionHeader ? "mt-6" : ""} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="flex flex-wrap gap-2">
            {config.filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
                className={`min-h-10 rounded-full px-3.5 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glacier-blue)] sm:text-sm ${
                  activeFilter === filter.id
                    ? "bg-[var(--navy-deep)] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[var(--glacier-blue)]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {viewMode ? (
            <MapListToggle
              view={viewMode}
              onChange={setViewMode}
              mapLabel={config.mapViewLabel}
              listLabel={config.listViewLabel}
              sticky={stickyToggle}
            />
          ) : (
            <div
              className="h-11 w-52 animate-pulse rounded-xl bg-slate-200"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="mt-8 min-w-0">
          {viewMode === null ? (
            <div
              className="min-h-[420px] animate-pulse rounded-2xl bg-slate-200/70"
              aria-busy="true"
              aria-label="Loading port explorer"
            />
          ) : viewMode === "map" ? (
            <PortMapView
              ports={scopedPorts}
              config={config}
              selectedSlug={selectedSlug}
              onSelectPort={setSelectedSlug}
              activeFilter={activeFilter}
              routePorts={routePorts}
              routeLabel={routeLabel}
            />
          ) : (
            <PortListView
              ports={listPorts}
              config={config}
              routePorts={routePorts}
              dimmedSlugs={dimmedSlugs}
              selectedSlug={selectedSlug}
              onSelectPort={setSelectedSlug}
            />
          )}
        </div>

        {compact && showFooterLink && !isSecondary ? (
          <p className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href={config.plannerPath}
              className="btn-primary-on-light inline-flex min-h-11 items-center text-sm"
            >
              {config.plannerCtaLabel}
            </Link>
            <Link
              href={config.portMapPath}
              className="text-sm font-medium text-[var(--glacier-blue)] underline"
            >
              Open port map →
            </Link>
          </p>
        ) : null}

        {!compact && showFooterLink ? (
          <p className="mt-6 text-center">
            {isSecondary ? (
              <>
                <Link
                  href={config.plannerPath}
                  className="btn-primary-on-light inline-flex min-h-11 items-center text-sm"
                >
                  {config.plannerCtaLabel}
                </Link>
                <span className="mt-3 block text-sm text-slate-500">
                  Personalised recommendations work better than browsing ports
                  alone.
                </span>
              </>
            ) : (
              <Link
                href={config.portMapPath}
                className="text-sm font-medium text-[var(--glacier-blue)] underline"
              >
                Open full {config.destinationName} cruise port map →
              </Link>
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
