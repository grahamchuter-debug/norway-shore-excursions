"use client";

import { getConfidenceClass } from "@/lib/norway-cruise-planner-engine";
import type { DestinationPort } from "@/lib/destination-port-types";

type PlannerPortPickerListProps = {
  ports: readonly DestinationPort[];
  routePorts?: readonly string[];
  selectedSlug?: string;
  onSelectPort?: (slug: string) => void;
};

function routeStopIndex(
  slug: string,
  routePorts?: readonly string[],
): number | null {
  if (!routePorts?.length) return null;
  const index = routePorts.indexOf(slug);
  return index >= 0 ? index + 1 : null;
}

export function PlannerPortPickerList({
  ports,
  routePorts,
  selectedSlug,
  onSelectPort,
}: PlannerPortPickerListProps) {
  return (
    <ol className="space-y-3">
      {ports.map((port) => {
        const stop = routeStopIndex(port.slug, routePorts);
        const selected = selectedSlug === port.slug;

        return (
          <li key={port.slug}>
            <button
              type="button"
              onClick={() => onSelectPort?.(port.slug)}
              aria-pressed={selected}
              className={`premium-card w-full overflow-hidden text-left transition ${
                selected
                  ? "ring-2 ring-[var(--gold)] ring-offset-2"
                  : "hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border-light)] bg-surface-muted px-4 py-2.5">
                <div className="min-w-0">
                  {stop ? (
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--gold)]">
                      Stop {stop}
                    </p>
                  ) : null}
                  <p className="truncate font-bold text-[var(--navy-deep)]">
                    {port.name}
                  </p>
                </div>
                <span className="score-badge shrink-0 bg-[var(--navy-deep)] text-white">
                  {port.fitScore}/100
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-slate-800">
                  {port.topExcursion}
                </p>
                {port.returnLabel && port.returnConfidence ? (
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getConfidenceClass(port.returnConfidence)}`}
                  >
                    {port.returnLabel}
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
