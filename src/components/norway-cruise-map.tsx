"use client";

import {
  norwayDestinationConfig,
  norwayDestinationPorts,
} from "@/lib/destination-config";
import { CruisePortExplorer } from "@/components/planner/cruise-port-explorer";

type NorwayCruiseMapProps = {
  compact?: boolean;
  variant?: "primary" | "secondary";
  routePorts?: readonly string[];
  routeLabel?: string;
  showSectionHeader?: boolean;
  showFooterLink?: boolean;
  visiblePortSlugs?: readonly string[];
  sectionId?: string;
  stickyToggle?: boolean;
};

export function NorwayCruiseMap({
  compact = false,
  variant = "secondary",
  routePorts,
  routeLabel,
  showSectionHeader = true,
  showFooterLink = true,
  visiblePortSlugs,
  sectionId = "norway-cruise-map",
  stickyToggle = false,
}: NorwayCruiseMapProps) {
  return (
    <CruisePortExplorer
      config={norwayDestinationConfig}
      ports={norwayDestinationPorts}
      compact={compact}
      variant={variant}
      routePorts={routePorts}
      routeLabel={routeLabel}
      showSectionHeader={showSectionHeader}
      showFooterLink={showFooterLink}
      visiblePortSlugs={visiblePortSlugs}
      sectionId={sectionId}
      stickyToggle={stickyToggle}
    />
  );
}
