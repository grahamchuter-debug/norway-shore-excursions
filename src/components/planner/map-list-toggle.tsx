"use client";

import type { ViewMode } from "@/lib/destination-port-types";

type MapListToggleProps = {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
  mapLabel?: string;
  listLabel?: string;
  sticky?: boolean;
};

export function MapListToggle({
  view,
  onChange,
  mapLabel = "Map View",
  listLabel = "List View",
  sticky = false,
}: MapListToggleProps) {
  return (
    <div
      role="group"
      aria-label="Port results view mode"
      className={
        sticky
          ? "sticky top-16 z-20 -mx-1 mb-4 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-sm backdrop-blur-sm sm:top-20"
          : "inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
      }
    >
      {(
        [
          { mode: "map" as const, label: mapLabel },
          { mode: "list" as const, label: listLabel },
        ] as const
      ).map(({ mode, label }) => {
        const active = view === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-pressed={active}
            className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glacier-blue)] ${
              active
                ? "bg-[var(--navy-deep)] text-white shadow-sm"
                : "text-slate-600 hover:bg-surface-muted hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export type { ViewMode };
