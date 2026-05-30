"use client";

import { useEffect, useMemo, useState } from "react";

import {
  calculateExcursionFit,
  formatMinutes,
  formatReturnMargin,
  getFitConfidenceClass,
} from "@/lib/excursion-fit-calculator";
import { formatScheduleDateLabel } from "@/lib/cruise-schedule-config";
import {
  findMatchingCruise,
  getDatesForShipAtPort,
  getSchedulePortsWithData,
  getShipsForPort,
} from "@/lib/cruiseSchedules";
import { portBySlug } from "@/lib/ports-data";

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
      className={`premium-card overflow-hidden ${className}`.trim()}
      aria-labelledby="excursion-fit-heading"
    >
      <div className="border-b border-[var(--border-light)] bg-navy px-5 py-5 text-white sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          Return to ship planner
        </p>
        <h2
          id="excursion-fit-heading"
          className="mt-1 text-xl font-bold sm:text-2xl"
        >
          Will This Excursion Fit My Cruise?
        </h2>
        <p className="mt-2 text-sm text-white/75">
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
          <div
            className={`rounded-2xl border p-5 sm:p-6 ${getFitConfidenceClass(result.confidence.tier)}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl" aria-hidden>
                {result.confidence.emoji}
              </span>
              <p className="text-lg font-bold">{result.confidence.label}</p>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Available port time
                </dt>
                <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                  {formatMinutes(result.availablePortMinutes)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Excursion duration
                </dt>
                <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                  {formatMinutes(result.excursionDurationMinutes)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Safety buffer
                </dt>
                <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                  {formatMinutes(result.safetyBufferMinutes)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Estimated return margin
                </dt>
                <dd className="mt-1 text-lg font-bold text-[var(--navy-deep)]">
                  {formatReturnMargin(result.remainingMinutes)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              Includes {formatMinutes(result.checkInBufferMinutes)} check in
              buffer plus {formatMinutes(result.safetyBufferMinutes)} safety
              buffer before all aboard.
            </p>
          </div>
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
