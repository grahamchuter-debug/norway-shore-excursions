"use client";

import { useState } from "react";

import { SelectedPortPanel } from "@/components/planner/selected-port-panel";
import {
  buildRoutePolylineFromPorts,
  portMatchesFilter,
  type DestinationConfig,
  type DestinationPort,
  type LabelSide,
} from "@/lib/destination-port-types";

type PortMapViewProps = {
  ports: readonly DestinationPort[];
  config: DestinationConfig;
  selectedSlug: string;
  onSelectPort: (slug: string) => void;
  activeFilter: string;
  routePorts?: readonly string[];
  routeLabel?: string;
};

function labelOffset(side: LabelSide = "right") {
  switch (side) {
    case "left":
      return {
        textX: -5.5,
        textY: 0.8,
        anchor: "end" as const,
        rectX: -5.5,
        rectY: -2.8,
      };
    case "bottom":
      return {
        textX: 0,
        textY: 8.2,
        anchor: "middle" as const,
        rectX: 0,
        rectY: 5.2,
      };
    default:
      return {
        textX: 5.5,
        textY: 0.8,
        anchor: "start" as const,
        rectX: 3.8,
        rectY: -2.8,
      };
  }
}

function MapPortMarker({
  port,
  selected,
  hovered,
  dimmed,
  onRoute,
  onSelect,
  onHover,
}: {
  port: DestinationPort;
  selected: boolean;
  hovered: boolean;
  dimmed: boolean;
  onRoute: boolean;
  onSelect: () => void;
  onHover: (slug: string | null) => void;
}) {
  const label =
    selected || !port.dense
      ? port.shortLabel
      : (port.abbrevLabel ?? port.shortLabel);
  const fontSize = selected ? 3.15 : port.dense ? 2.25 : 2.65;
  const labelWidth = Math.max(label.length * fontSize * 0.52, 8);
  const { textX, textY, anchor, rectX, rectY } = labelOffset(port.labelSide);
  const rectWidth =
    port.labelSide === "bottom" ? labelWidth : labelWidth + 1.5;
  const rectHeight = 4.2;
  const rectOriginX =
    port.labelSide === "left"
      ? rectX - rectWidth
      : port.labelSide === "bottom"
        ? rectX - rectWidth / 2
        : rectX;

  const highlight = selected || hovered;

  return (
    <g
      transform={`translate(${port.coordinates.x}, ${port.coordinates.y})`}
      opacity={dimmed ? 0.2 : 1}
      className="cursor-pointer transition-opacity duration-200"
      role="button"
      tabIndex={dimmed ? -1 : 0}
      aria-label={`${port.name}, ${port.region}`}
      aria-pressed={selected}
      onClick={() => onSelect()}
      onMouseEnter={() => onHover(port.slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(port.slug)}
      onBlur={() => onHover(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <circle r={6.5} fill="transparent" pointerEvents="all" />

      {selected ? (
        <circle
          r={5.5}
          className="map-marker-pulse"
          fill="var(--gold)"
          opacity={0.35}
        />
      ) : null}
      {onRoute && !selected ? (
        <circle
          r={4.4}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={0.55}
          opacity={0.85}
        />
      ) : null}
      {highlight && !selected ? (
        <circle
          r={3.8}
          fill="none"
          stroke="var(--ice-white)"
          strokeWidth={0.45}
          opacity={0.8}
        />
      ) : null}
      <circle
        r={selected ? 3.1 : hovered ? 2.85 : 2.55}
        fill={selected ? "var(--gold)" : "var(--ice-white)"}
        stroke={selected ? "#ffffff" : "var(--navy-deep)"}
        strokeWidth={selected ? 0.75 : 0.5}
      />
      {!selected ? (
        <circle r={0.95} fill="var(--navy-deep)" />
      ) : null}
      <g pointerEvents="none">
        <rect
          x={rectOriginX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          rx={1.2}
          fill="rgb(6 26 46 / 0.88)"
          stroke={
            selected
              ? "rgb(201 162 39 / 0.65)"
              : hovered
                ? "rgb(255 255 255 / 0.35)"
                : "rgb(255 255 255 / 0.12)"
          }
          strokeWidth={selected ? 0.35 : 0.2}
        />
        <text
          x={textX}
          y={textY}
          textAnchor={anchor}
          fill={selected ? "var(--gold-light)" : "#f8fcff"}
          fontSize={fontSize}
          fontWeight={selected ? 700 : 600}
          fontFamily="system-ui, sans-serif"
        >
          {label}
        </text>
      </g>
    </g>
  );
}

function MapLegend({ showRoute }: { showRoute: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-3 text-[10px] text-slate-600 sm:text-xs">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-white bg-[var(--gold)] shadow-sm ring-1 ring-slate-300" />
        Gold = selected port
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-[var(--navy-deep)] bg-[var(--ice-white)]">
          <span className="h-1 w-1 rounded-full bg-[var(--navy-deep)]" />
        </span>
        White = available port
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex h-3 w-3 rounded-full bg-slate-300 opacity-50" />
        Faded = filtered out
      </span>
      {showRoute ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0 w-5 border-t-2 border-dotted border-[var(--gold)]" />
          Dotted line = sample cruise route
        </span>
      ) : null}
    </div>
  );
}

export function PortMapView({
  ports,
  config,
  selectedSlug,
  onSelectPort,
  activeFilter,
  routePorts,
  routeLabel,
}: PortMapViewProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const selectedPort =
    ports.find((p) => p.slug === selectedSlug) ?? ports[0] ?? null;

  const matchingSlugs = new Set(
    ports
      .filter((p) => portMatchesFilter(p, activeFilter))
      .map((p) => p.slug),
  );

  const routeSlugSet = new Set(routePorts ?? []);
  const routePoints = routePorts
    ? buildRoutePolylineFromPorts(routePorts, ports)
    : null;

  const texturePaths = config.fjordTexturePaths ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <div className="norway-map-panel min-w-0">
        <div className="premium-card overflow-hidden p-2 sm:p-3">
          <svg
            viewBox="0 0 100 100"
            className="h-auto w-full max-w-full"
            role="img"
            aria-label={`Stylised map of ${config.destinationName} with labelled cruise port markers`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="destinationMapGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#061a2e" />
                <stop offset="45%" stopColor="#0a2540" />
                <stop offset="100%" stopColor="#1a4a6e" />
              </linearGradient>
              <linearGradient
                id="destinationMapFjordGlow"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4db8d9" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#4db8d9" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="100" height="100" fill="url(#destinationMapGradient)" />
            <rect width="100" height="100" fill="url(#destinationMapFjordGlow)" />

            {[18, 32, 46, 60, 74].map((y) => (
              <line
                key={y}
                x1={4}
                y1={y}
                x2={96}
                y2={y}
                stroke="white"
                strokeOpacity={0.07}
                strokeWidth={0.25}
                strokeDasharray="1.5 2"
              />
            ))}

            {texturePaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="white"
                strokeOpacity={0.06}
                strokeWidth={0.6}
              />
            ))}

            <path
              d={config.mapOutlinePath}
              fill="rgb(255 255 255 / 0.14)"
              stroke="rgb(255 255 255 / 0.38)"
              strokeWidth={0.55}
              strokeLinejoin="round"
            />

            <text
              x={5}
              y={6.5}
              fill="rgb(255 255 255 / 0.55)"
              fontSize={3.2}
              fontWeight={700}
              letterSpacing="0.08em"
              fontFamily="system-ui, sans-serif"
            >
              {config.mapHeaderLabel}
            </text>

            <g transform="translate(91, 9)" opacity={0.55}>
              <circle r={3.2} fill="none" stroke="white" strokeWidth={0.35} />
              <polygon points="0,-2.2 0.6,0.6 -0.6,0.6" fill="var(--gold)" />
              <text
                y={5.5}
                textAnchor="middle"
                fill="white"
                fontSize={2}
                fontFamily="system-ui, sans-serif"
              >
                N
              </text>
            </g>

            {routePoints ? (
              <polyline
                points={routePoints}
                fill="none"
                stroke="var(--gold)"
                strokeWidth={0.65}
                strokeDasharray="1.8 1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
              />
            ) : null}

            {ports.map((port) => (
              <MapPortMarker
                key={port.slug}
                port={port}
                selected={selectedSlug === port.slug}
                hovered={hoveredSlug === port.slug}
                dimmed={
                  activeFilter !== config.defaultFilterId &&
                  !matchingSlugs.has(port.slug)
                }
                onRoute={routeSlugSet.has(port.slug)}
                onSelect={() => onSelectPort(port.slug)}
                onHover={setHoveredSlug}
              />
            ))}
          </svg>

          <MapLegend showRoute={Boolean(routePoints)} />

          {routePorts && routePoints && routeLabel ? (
            <p className="mt-2 text-xs font-medium text-slate-600 sm:text-sm">
              <span className="text-[var(--gold)]">●</span> {routeLabel}
            </p>
          ) : null}
        </div>
      </div>

      {selectedPort ? (
        <SelectedPortPanel port={selectedPort} config={config} />
      ) : null}
    </div>
  );
}
