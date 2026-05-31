"use client";

import { useEffect, useMemo, useState } from "react";

import { formatScheduleDateLabel } from "@/lib/cruise-schedule-config";
import {
  findMatchingCruise,
  getDatesForShipAtPort,
  getSchedulePortsWithData,
  getShipsForPort,
} from "@/lib/cruiseSchedules";
import {
  buildFitNarrativeSummary,
  calculateExcursionFit,
  formatMinutes,
  formatReturnMargin,
  getFitConfidenceClass,
  type FitConfidenceTier,
} from "@/lib/excursion-fit-calculator";
import { portBySlug } from "@/lib/ports-data";

type FitResultPresentation = {
  headline: string;
  description: string;
  recommendation: string;
  showCheckIcon: boolean;
};

function getFitResultPresentation(
  tier: FitConfidenceTier,
): FitResultPresentation {
  switch (tier) {
    case "very-high":
    case "high":
      return {
        showCheckIcon: true,
        headline: "Plenty of time available",
        description:
          "This excursion comfortably fits within your port call.",
        recommendation: "Recommended for most cruise passengers.",
      };
    case "moderate":
      return {
        showCheckIcon: false,
        headline: "Moderate timing risk",
        description:
          "This excursion may fit, but leaves a smaller margin before all aboard.",
        recommendation: "Consider allowing extra contingency time.",
      };
    case "tight":
    case "not-recommended":
      return {
        showCheckIcon: false,
        headline: "Tight timing",
        description:
          "This excursion may leave insufficient time before all aboard.",
        recommendation: "Consider a shorter excursion.",
      };
  }
}

const DEFAULT_CHECK_IN_BUFFER = 15;
const DEFAULT_SAFETY_BUFFER = 60;

type WillThisExcursionFitProps = {
  defaultArrivalTime?: string;
  defaultAllAboardTime?: string;
  defaultExcursionHours?: number;
  defaultExcursionMinutes?: number;
  defaultCheckInBufferMinutes?: number;
  defaultSafetyBufferMinutes?: number;
  defaultPortSlug?: string;
  showScheduleLookup?: boolean;
  className?: string;
};

function durationToMinutes(hours: number, minutes: number): number {
  return Math.max(0, hours) * 60 + Math.max(0, minutes);
}

export function WillThisExcursionFit({
  defaultArrivalTime = "08:00",
  defaultAllAboardTime = "17:00",
  defaultExcursionHours = 4,
  defaultExcursionMinutes = 0,
  defaultCheckInBufferMinutes = DEFAULT_CHECK_IN_BUFFER,
  defaultSafetyBufferMinutes = DEFAULT_SAFETY_BUFFER,
  defaultPortSlug,
  showScheduleLookup = true,
  className = "",
}: WillThisExcursionFitProps) {
  const [portSlug, setPortSlug] = useState(defaultPortSlug ?? "");
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState(defaultArrivalTime);
  const [allAboardTime, setAllAboardTime] = useState(defaultAllAboardTime);
  const [allAboardMissing, setAllAboardMissing] = useState(false);
  const [excursionHours, setExcursionHours] = useState(defaultExcursionHours);
  const [excursionMinutes, setExcursionMinutes] = useState(
    defaultExcursionMinutes,
  );
  const [checkInBufferMinutes, setCheckInBufferMinutes] = useState(
    defaultCheckInBufferMinutes,
  );
  const [safetyBufferMinutes, setSafetyBufferMinutes] = useState(
    defaultSafetyBufferMinutes,
  );

  const schedulePorts = useMemo(() => getSchedulePortsWithData(), []);
  const shipsForPort = useMemo(
    () => (portSlug ? getShipsForPort(portSlug) : []),
    [portSlug],
  );
  const datesForShip = useMemo(
    () =>
      portSlug && selectedShip
        ? getDatesForShipAtPort(portSlug, selectedShip)
        : [],
    [portSlug, selectedShip],
  );

  const hasScheduleData = schedulePorts.length > 0;
  const lockPort = Boolean(defaultPortSlug);

  useEffect(() => {
    if (defaultPortSlug) {
      setPortSlug(defaultPortSlug);
    }
  }, [defaultPortSlug]);

  useEffect(() => {
    if (!portSlug || !selectedShip || !selectedDate) return;

    const match = findMatchingCruise({
      port: portSlug,
      ship: selectedShip,
      date: selectedDate,
    });
    if (!match) return;

    if (match.arrival_time) {
      setArrivalTime(match.arrival_time);
    }
    if (match.all_aboard_time) {
      setAllAboardTime(match.all_aboard_time);
      setAllAboardMissing(false);
    } else {
      setAllAboardTime("");
      setAllAboardMissing(true);
    }
  }, [portSlug, selectedShip, selectedDate]);

  const excursionDurationMinutes = durationToMinutes(
    excursionHours,
    excursionMinutes,
  );

  const result = useMemo(
    () =>
      calculateExcursionFit({
        arrivalTime,
        allAboardTime,
        excursionDurationMinutes,
        checkInBufferMinutes,
        safetyBufferMinutes,
      }),
    [
      arrivalTime,
      allAboardTime,
      excursionDurationMinutes,
      checkInBufferMinutes,
      safetyBufferMinutes,
    ],
  );

  return (
    <section
      className={`return-to-ship-planner premium-card overflow-hidden ${className}`.trim()}
      aria-labelledby="excursion-fit-heading"
    >
      <div className="hero-dark border-b border-[var(--border-light)] bg-navy px-5 py-5 sm:px-6">
        <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
          Return to ship planner
        </p>
        <h2
          id="excursion-fit-heading"
          className="mt-1 text-xl font-bold sm:text-2xl"
        >
          Will This Excursion Fit My Cruise?
        </h2>
        <p className="mt-2 text-sm">
          Check whether your excursion leaves enough time before all aboard.
        </p>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {showScheduleLookup && hasScheduleData ? (
          <fieldset className="rounded-xl border border-[var(--border-light)] bg-surface-muted p-4">
            <legend className="px-1 text-sm font-semibold text-slate-800">
              Use imported cruise schedule
            </legend>
            <p className="mt-1 text-xs text-slate-600">
              Choose your ship and port call date from approved CSV schedule
              data. If all aboard is missing, enter it manually from your cruise
              line.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {!lockPort ? (
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Port</span>
                  <select
                    value={portSlug}
                    onChange={(event) => {
                      setPortSlug(event.target.value);
                      setSelectedShip("");
                      setSelectedDate("");
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select port</option>
                    {schedulePorts.map((slug) => (
                      <option key={slug} value={slug}>
                        {portBySlug[slug]?.displayName ?? slug}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <p className="text-xs text-slate-500">Port</p>
                  <p className="font-medium text-slate-800">
                    {portBySlug[portSlug]?.displayName ?? portSlug}
                  </p>
                </div>
              )}

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Ship</span>
                <select
                  value={selectedShip}
                  onChange={(event) => {
                    setSelectedShip(event.target.value);
                    setSelectedDate("");
                  }}
                  disabled={!portSlug}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50"
                >
                  <option value="">Select ship</option>
                  {shipsForPort.map((ship) => (
                    <option key={ship} value={ship}>
                      {ship}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-medium text-slate-700">Date</span>
                <select
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  disabled={!selectedShip}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50"
                >
                  <option value="">Select date</option>
                  {datesForShip.map((date) => (
                    <option key={date} value={date}>
                      {formatScheduleDateLabel(date)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
        ) : null}

        {allAboardMissing ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Arrival time was filled from the imported schedule, but all aboard
            time is not published for this call. Enter your all aboard time
            manually from your cruise line daily programme.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Arrival time</span>
            <input
              type="time"
              value={arrivalTime}
              onChange={(event) => setArrivalTime(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-800">All aboard time</span>
            <input
              type="time"
              value={allAboardTime}
              onChange={(event) => {
                setAllAboardTime(event.target.value);
                setAllAboardMissing(false);
              }}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">
            Excursion duration
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:max-w-md">
            <label className="block text-sm">
              <span className="text-slate-600">Hours</span>
              <input
                type="number"
                min={0}
                max={14}
                value={excursionHours}
                onChange={(event) =>
                  setExcursionHours(Number(event.target.value) || 0)
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Minutes</span>
              <input
                type="number"
                min={0}
                max={59}
                step={5}
                value={excursionMinutes}
                onChange={(event) =>
                  setExcursionMinutes(Number(event.target.value) || 0)
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-800">
              Check in buffer (mins)
            </span>
            <input
              type="number"
              min={0}
              max={120}
              step={5}
              value={checkInBufferMinutes}
              onChange={(event) =>
                setCheckInBufferMinutes(Number(event.target.value) || 0)
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-800">
              Safety buffer (mins)
            </span>
            <input
              type="number"
              min={0}
              max={180}
              step={5}
              value={safetyBufferMinutes}
              onChange={(event) =>
                setSafetyBufferMinutes(Number(event.target.value) || 0)
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        {result ? (
          (() => {
            const presentation = getFitResultPresentation(
              result.confidence.tier,
            );
            const portDisplayName = portSlug
              ? (portBySlug[portSlug]?.displayName ?? portSlug)
              : undefined;
            const narrative = buildFitNarrativeSummary({
              portDisplayName,
              availablePortMinutes: result.availablePortMinutes,
              excursionDurationMinutes: result.excursionDurationMinutes,
              remainingMinutes: result.remainingMinutes,
            });

            return (
              <div
                className={`overflow-hidden rounded-2xl border ${getFitConfidenceClass(result.confidence.tier)}`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 text-lg font-bold"
                      aria-hidden
                    >
                      {presentation.showCheckIcon ? "✓" : "⚠"}
                    </span>
                    <div className="space-y-2">
                      <p className="text-lg font-bold leading-snug">
                        {presentation.headline}
                      </p>
                      <p className="text-sm leading-6 opacity-90">
                        {narrative.portLine}
                      </p>
                      <p className="text-sm leading-6 opacity-90">
                        {narrative.excursionLine}
                      </p>
                      <p className="text-sm leading-6 opacity-90">
                        {presentation.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/60 bg-white/50 p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Timing breakdown
                    </p>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-white/80 px-3 py-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Time in port
                        </dt>
                        <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                          {formatMinutes(result.availablePortMinutes)}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-white/80 px-3 py-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Excursion duration
                        </dt>
                        <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                          {formatMinutes(result.excursionDurationMinutes)}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-white/80 px-3 py-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Safety buffer
                        </dt>
                        <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                          {formatMinutes(result.safetyBufferMinutes)}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-white/80 px-3 py-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Estimated spare time remaining
                        </dt>
                        <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                          {formatReturnMargin(result.remainingMinutes)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-xs leading-5 text-slate-600">
                      Includes {formatMinutes(result.checkInBufferMinutes)} check
                      in buffer before the excursion starts.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/40 bg-[var(--navy-deep)]/5 px-5 py-4 sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--glacier-blue)]">
                    Recommendation
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[var(--navy-deep)]">
                    {presentation.recommendation}
                  </p>
                </div>
              </div>
            );
          })()
        ) : (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Enter valid arrival and all aboard times to calculate your fit
            score.
          </p>
        )}

        <p className="text-sm leading-6 text-slate-600">
          This tool is designed to help cruise passengers assess whether an
          excursion comfortably fits within their ship&apos;s scheduled port
          time. Always confirm all aboard times with your cruise line.
        </p>
      </div>
    </section>
  );
}
