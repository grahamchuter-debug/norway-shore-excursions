"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PlannerDashboardV2 } from "@/components/planner/planner-dashboard-v2";
import { TravellerTypePicker } from "@/components/traveller-type-picker";
import { getRouteById } from "@/lib/cruise-itineraries";
import {
  cruiseLines,
  ports,
  sailingMonths,
  type FitnessLevel,
  type PlannerInterest,
  type PortTimeOption,
} from "@/lib/ports-data";
import {
  generatePlannerRecommendations,
} from "@/lib/norway-cruise-planner-engine";
import {
  interestsFromTravellerIds,
  travellerIdsFromInterests,
} from "@/lib/traveller-types";

type NorwayCruisePlannerProps = {
  compact?: boolean;
  initialPorts?: string[];
  initialInterests?: PlannerInterest[];
  initialRouteId?: string;
};

const portTimeOptions: PortTimeOption[] = [
  "Under 4 hours",
  "4 to 6 hours",
  "6 to 8 hours",
  "8+ hours",
];

const fitnessOptions: FitnessLevel[] = ["Easy", "Moderate", "Active"];

function resolveInitialState(
  initialPorts: string[],
  initialInterests: PlannerInterest[],
  initialRouteId?: string,
) {
  const route = initialRouteId ? getRouteById(initialRouteId) : undefined;
  return {
    ports: route ? [...route.portSlugs] : [...initialPorts],
    interests: route ? [...route.interests] : initialInterests,
  };
}

export function NorwayCruisePlanner({
  compact = false,
  initialPorts = [],
  initialInterests = [],
  initialRouteId,
}: NorwayCruisePlannerProps) {
  const initial = resolveInitialState(
    initialPorts,
    initialInterests,
    initialRouteId,
  );
  const [cruiseLine, setCruiseLine] = useState<string>(cruiseLines[0]);
  const [shipName, setShipName] = useState("");
  const [sailingMonth, setSailingMonth] = useState("June");
  const [selectedPorts, setSelectedPorts] = useState<string[]>(
    () => initial.ports,
  );
  const [travellerIds, setTravellerIds] = useState<string[]>(() =>
    travellerIdsFromInterests(initial.interests),
  );
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("Easy");
  const [portTime, setPortTime] = useState<PortTimeOption>("6 to 8 hours");
  const [submitted, setSubmitted] = useState(false);

  const interests = useMemo(
    () => interestsFromTravellerIds(travellerIds),
    [travellerIds],
  );

  const togglePort = (slug: string) => {
    setSelectedPorts((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const plannerResult = useMemo(() => {
    if (!submitted || selectedPorts.length === 0) return null;
    return generatePlannerRecommendations({
      cruiseLine,
      shipName,
      sailingMonth,
      selectedPortSlugs: selectedPorts,
      interests,
      travellerIds,
      fitnessLevel,
      portTime,
    });
  }, [
    submitted,
    selectedPorts,
    cruiseLine,
    shipName,
    sailingMonth,
    interests,
    travellerIds,
    fitnessLevel,
    portTime,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const portList = compact && initialPorts.length === 0
    ? ["flam", "bergen", "geiranger", "olden", "stavanger", "tromso"]
    : ports.map((p) => p.slug);

  return (
    <div
      className={
        compact
          ? "premium-card overflow-hidden"
          : "premium-card mx-auto max-w-5xl overflow-hidden"
      }
    >
      <div className="hero-dark border-b border-[var(--border-light)] bg-navy px-6 py-5">
        <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
          Smart Cruise Planner · Version 2.0
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">
          Norway Cruise Planner™
        </h2>
        <p className="mt-2 text-sm">
          Personalised Norway cruise excursion planning with AI style
          recommendations, rules based, not a live booking engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Cruise line</span>
            <select
              value={cruiseLine}
              onChange={(e) => setCruiseLine(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {cruiseLines.map((line) => (
                <option key={line} value={line}>
                  {line}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-800">Ship name</span>
            <input
              type="text"
              value={shipName}
              onChange={(e) => setShipName(e.target.value)}
              placeholder="e.g. Iona"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-800">Sailing month</span>
            <select
              value={sailingMonth}
              onChange={(e) => setSailingMonth(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {sailingMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">
            Ports visiting
          </legend>
          <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {portList.map((slug) => {
              const port = ports.find((p) => p.slug === slug);
              if (!port) return null;
              return (
                <label
                  key={slug}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    selectedPorts.includes(slug)
                      ? "border-[var(--glacier-blue)] bg-[var(--glacier-blue)]/10 text-[var(--navy-deep)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[var(--glacier-blue)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedPorts.includes(slug)}
                    onChange={() => togglePort(slug)}
                  />
                  {port.displayName}
                </label>
              );
            })}
          </div>
          {compact ? (
            <p className="mt-2 text-xs text-slate-500">
              Need every port?{" "}
              <Link href="/norway-cruise-planner" className="content-link">
                Open the full planner
              </Link>
            </p>
          ) : null}
        </fieldset>

        <TravellerTypePicker
          selectedIds={travellerIds}
          onChange={setTravellerIds}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Fitness level</span>
            <select
              value={fitnessLevel}
              onChange={(e) =>
                setFitnessLevel(e.target.value as FitnessLevel)
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {fitnessOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-800">
              Typical time in port
            </span>
            <select
              value={portTime}
              onChange={(e) => setPortTime(e.target.value as PortTimeOption)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {portTimeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" className="btn-primary-on-light w-full sm:w-auto">
          Generate My Norway Cruise Plan
        </button>
      </form>

      {submitted && selectedPorts.length === 0 ? (
        <p className="border-t border-slate-100 px-6 pb-6 text-sm text-red-700">
          Select at least one port to generate recommendations.
        </p>
      ) : null}

      {submitted && travellerIds.length === 0 ? (
        <p className="border-t border-slate-100 px-6 pb-6 text-sm text-amber-800">
          Tip: select a traveller type above for sharper excursion matching.
        </p>
      ) : null}

      {plannerResult ? (
        <PlannerDashboardV2
          result={plannerResult}
          cruiseLine={cruiseLine}
          shipName={shipName}
          sailingMonth={sailingMonth}
          fitnessLevel={fitnessLevel}
          selectedPorts={selectedPorts}
        />
      ) : null}
    </div>
  );
}
