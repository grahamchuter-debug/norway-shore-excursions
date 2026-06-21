"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  buildScheduleMonthSlug,
  monthLabels,
  shipScheduleMonthPath,
  shipSchedulePortPath,
} from "@/lib/cruise-schedule-config";
import {
  type CruiseScheduleRow,
} from "@/lib/cruiseSchedules";
import { matchCruiseLineScheduleKey } from "@/lib/cruise-line-schedules";
import { cruiseLines } from "@/lib/cruise-lines-data";
import { portBySlug } from "@/lib/ports-data";
import { shipNameToSlug, shipPagePath } from "@/lib/ship-schedules";
import type { GlobalScheduleInsights } from "@/lib/schedule-insights";

type CalendarEntry = {
  id: string;
  date: string;
  dateLabel: string;
  monthKey: string;
  monthLabel: string;
  year: string;
  portSlug: string;
  portDisplayName: string;
  ship: string;
  shipSlug: string;
  cruiseLine: string;
  cruiseLineSlug: string | null;
  scheduleHref: string;
};

type NorwayCruiseCalendarClientProps = {
  rows: readonly CruiseScheduleRow[];
  insights: GlobalScheduleInsights;
};

function formatDateLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildCalendarEntries(rows: readonly CruiseScheduleRow[]): CalendarEntry[] {
  return rows.map((row) => {
    const portSlug = row.port;
    const month = row.arrival_date.slice(5, 7);
    const year = row.arrival_date.slice(0, 4);
    const monthSlug = buildScheduleMonthSlug(month, year);
    const scheduleKey = matchCruiseLineScheduleKey(row.cruise_line);
    const cruiseLineSlug =
      cruiseLines.find((line) => line.scheduleKey === scheduleKey)?.slug ?? null;

    return {
      id: `${row.arrival_date}-${row.port}-${row.ship}-${row.arrival_time ?? "tbc"}`,
      date: row.arrival_date,
      dateLabel: formatDateLabel(row.arrival_date),
      monthKey: row.arrival_date.slice(0, 7),
      monthLabel: `${monthLabels[month] ?? month} ${year}`,
      year,
      portSlug,
      portDisplayName: portBySlug[portSlug]?.displayName ?? portSlug,
      ship: row.ship,
      shipSlug: shipNameToSlug(row.ship),
      cruiseLine: row.cruise_line,
      cruiseLineSlug,
      scheduleHref: shipScheduleMonthPath(portSlug, monthSlug),
    };
  });
}

export function NorwayCruiseCalendarClient({
  rows,
  insights,
}: NorwayCruiseCalendarClientProps) {
  const entries = useMemo(() => buildCalendarEntries(rows), [rows]);

  const filterOptions = useMemo(() => {
    const months = new Map<string, string>();
    const ports = new Map<string, string>();
    const lines = new Map<string, string>();
    const ships = new Map<string, string>();

    for (const entry of entries) {
      months.set(entry.monthKey, entry.monthLabel);
      ports.set(entry.portSlug, entry.portDisplayName);
      if (entry.cruiseLineSlug) {
        lines.set(entry.cruiseLineSlug, entry.cruiseLine);
      }
      ships.set(entry.shipSlug, entry.ship);
    }

    return {
      months: [...months.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      ports: [...ports.entries()].sort((a, b) => a[1].localeCompare(b[1])),
      lines: [...lines.entries()].sort((a, b) => a[1].localeCompare(b[1])),
      ships: [...ships.entries()].sort((a, b) => a[1].localeCompare(b[1])),
      years: insights.yearsAvailable,
    };
  }, [entries, insights.yearsAvailable]);

  const [monthKey, setMonthKey] = useState("");
  const [portSlug, setPortSlug] = useState("");
  const [lineSlug, setLineSlug] = useState("");
  const [shipSlug, setShipSlug] = useState("");
  const [year, setYear] = useState("");

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (year && entry.year !== year) return false;
      if (monthKey && entry.monthKey !== monthKey) return false;
      if (portSlug && entry.portSlug !== portSlug) return false;
      if (lineSlug && entry.cruiseLineSlug !== lineSlug) return false;
      if (shipSlug && entry.shipSlug !== shipSlug) return false;
      return true;
    });
  }, [entries, year, monthKey, portSlug, lineSlug, shipSlug]);

  const maxMonthly = insights.peakMonths[0]?.shipCalls ?? 1;

  return (
    <div className="space-y-10">
      <section>
        <h2>Browse Norway cruise calls</h2>
        <p>
          Filter {insights.totalCalls} verified port calls across {insights.portCount}{" "}
          Norway ports. Data spans{" "}
          {insights.yearsAvailable.join(" and ") || "imported seasons"} from approved CSV
          imports.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Year</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 py-2"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="">All years</option>
              {filterOptions.years.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Month</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 py-2"
              value={monthKey}
              onChange={(event) => setMonthKey(event.target.value)}
            >
              <option value="">All months</option>
              {filterOptions.months.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Port</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 py-2"
              value={portSlug}
              onChange={(event) => setPortSlug(event.target.value)}
            >
              <option value="">All ports</option>
              {filterOptions.ports.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Cruise line</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 py-2"
              value={lineSlug}
              onChange={(event) => setLineSlug(event.target.value)}
            >
              <option value="">All lines</option>
              {filterOptions.lines.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Ship</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border-light)] bg-white px-3 py-2"
              value={shipSlug}
              onChange={(event) => setShipSlug(event.target.value)}
            >
              <option value="">All ships</option>
              {filterOptions.ships.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Showing {filtered.length} of {entries.length} calls
          {filtered.length !== entries.length ? " matching filters" : ""}.
        </p>
      </section>

      <section>
        <h2>Peak cruise months</h2>
        <div className="space-y-3">
          {insights.monthlyTotals.map((month) => (
            <div key={month.monthKey} className="flex items-center gap-4">
              <span className="w-36 shrink-0 text-sm font-medium text-slate-900">
                {month.monthLabel}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[var(--glacier-blue)]"
                  style={{
                    width: `${Math.max(8, (month.shipCalls / maxMonthly) * 100)}%`,
                  }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-sm text-slate-600">
                {month.shipCalls}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Busiest cruise days</h2>
        <ul className="card-grid grid gap-2 sm:grid-cols-2">
          {insights.busiestDays.slice(0, 8).map((day) => (
            <li key={day.date} className="premium-card p-4 text-sm">
              <p className="font-semibold text-slate-900">{day.dateLabel}</p>
              <p className="mt-1 text-slate-600">
                {day.shipCalls} simultaneous Norway port calls
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Filtered sailings</h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-600">
            No calls match these filters. Try clearing one filter or browse the{" "}
            <Link href="/ship-schedules" className="content-link font-medium">
              Ship Schedules hub
            </Link>
            .
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Ship</th>
                  <th className="px-4 py-3 font-semibold">Line</th>
                  <th className="px-4 py-3 font-semibold">Port</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {filtered.slice(0, 60).map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={entry.scheduleHref} className="content-link">
                        {entry.dateLabel}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={shipPagePath(entry.shipSlug)}
                        className="content-link font-medium"
                      >
                        {entry.ship}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {entry.cruiseLineSlug ? (
                        <Link
                          href={`/cruise-lines/${entry.cruiseLineSlug}`}
                          className="content-link font-medium"
                        >
                          {entry.cruiseLine}
                        </Link>
                      ) : (
                        entry.cruiseLine
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={shipSchedulePortPath(entry.portSlug)}
                        className="content-link font-medium"
                      >
                        {entry.portDisplayName}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 60 ? (
          <p className="mt-3 text-sm text-slate-600">
            Showing the first 60 results. Narrow filters or use{" "}
            <Link href="/ship-schedules/search" className="content-link font-medium">
              Search by Ship
            </Link>{" "}
            for a full ship timetable.
          </p>
        ) : null}
      </section>

      <section>
        <h2>Cruise line activity trends</h2>
        <ul className="card-grid grid gap-2 sm:grid-cols-2">
          {insights.topCruiseLines.map((line) => (
            <li key={line.label} className="premium-card p-4">
              {line.href ? (
                <Link href={line.href} className="content-link font-semibold">
                  {line.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-900">{line.label}</span>
              )}
              <p className="mt-1 text-sm text-slate-600">
                {line.count} Norway port calls in schedule data
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
