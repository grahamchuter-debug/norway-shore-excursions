"use client";

import { useEffect, useMemo, useState } from "react";

import { MapListToggle, type ViewMode } from "@/components/planner/map-list-toggle";
import { PlannerPortPickerList } from "@/components/planner/planner-port-picker-list";
import { PortMapView } from "@/components/planner/port-map-view";
import { SelectedPortPanel } from "@/components/planner/selected-port-panel";
import {
  norwayDestinationConfig,
  recommendationsToDestinationPorts,
} from "@/lib/destination-config";
import type { PortRecommendation } from "@/lib/norway-cruise-planner-engine";

type PlannerResultsExplorerProps = {
  recommendations: readonly PortRecommendation[];
  routePorts?: readonly string[];
};

export function PlannerResultsExplorer({
  recommendations,
  routePorts,
}: PlannerResultsExplorerProps) {
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(
    recommendations[0]?.portSlug ?? "flam",
  );

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setViewMode(mobile ? "list" : "map");
  }, []);

  const ports = useMemo(
    () => recommendationsToDestinationPorts(recommendations),
    [recommendations],
  );

  const selectedPort = useMemo(
    () => ports.find((port) => port.slug === selectedSlug) ?? ports[0] ?? null,
    [ports, selectedSlug],
  );

  useEffect(() => {
    if (!ports.some((port) => port.slug === selectedSlug) && ports[0]) {
      setSelectedSlug(ports[0].slug);
    }
  }, [ports, selectedSlug]);

  return (
    <div className="mt-8 border-t border-[var(--border-light)] pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Your recommendation engine results
          </p>
          <h4 className="mt-1 text-lg font-bold text-slate-900">
            Personalised port by port plan
          </h4>
          <p className="mt-1 text-sm text-slate-600">
            Select a port to preview recommendations. Map view shows your
            itinerary on the left with port details on the right.
          </p>
        </div>
        {viewMode ? (
          <MapListToggle
            view={viewMode}
            onChange={setViewMode}
            mapLabel={norwayDestinationConfig.mapViewLabel}
            listLabel={norwayDestinationConfig.listViewLabel}
          />
        ) : null}
      </div>

      <div className="mt-6 min-w-0">
        {viewMode === null ? (
          <div className="min-h-[320px] animate-pulse rounded-2xl bg-slate-200/70" />
        ) : viewMode === "map" ? (
          <PortMapView
            ports={ports}
            config={norwayDestinationConfig}
            selectedSlug={selectedSlug}
            onSelectPort={setSelectedSlug}
            activeFilter="all"
            routePorts={routePorts}
            routeLabel="Your selected itinerary ports"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            <PlannerPortPickerList
              ports={ports}
              routePorts={routePorts}
              selectedSlug={selectedSlug}
              onSelectPort={setSelectedSlug}
            />
            {selectedPort ? (
              <SelectedPortPanel
                port={selectedPort}
                config={norwayDestinationConfig}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
