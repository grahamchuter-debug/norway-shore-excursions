"use client";

import {
  interestsFromTravellerIds,
  travellerTypes,
} from "@/lib/traveller-types";

type TravellerTypePickerProps = {
  selectedIds: readonly string[];
  onChange: (ids: string[]) => void;
};

export function TravellerTypePicker({
  selectedIds,
  onChange,
}: TravellerTypePickerProps) {
  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-800">
        What type of traveller are you?
      </legend>
      <p className="mt-1 text-xs text-slate-500">
        Select one or more, we map these to excursion interests automatically.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {travellerTypes.map((type) => {
          const selected = selectedIds.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => toggle(type.id)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                selected
                  ? "border-[var(--fjord-green)] bg-[var(--fjord-green)]/8 shadow-sm"
                  : "border-slate-200 bg-white hover:border-[var(--glacier-blue)]"
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {type.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {type.label}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-600">
                  {type.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {selectedIds.length > 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          Mapped interests:{" "}
          <span className="font-medium text-slate-700">
            {interestsFromTravellerIds(selectedIds).join(", ") ||
              "Select a traveller type"}
          </span>
        </p>
      ) : null}
    </fieldset>
  );
}
