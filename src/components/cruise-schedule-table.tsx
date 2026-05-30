import Link from "next/link";

import {
  cruiseScheduleDisclaimer,
  formatScheduleDateLabel,
  formatScheduleTime,
  getPortExcursionLink,
} from "@/lib/cruise-schedule-config";
import type { CruiseScheduleRow } from "@/lib/cruiseSchedules";

type CruiseScheduleTableProps = {
  rows: readonly CruiseScheduleRow[];
  portSlug: string;
};

export function CruiseScheduleTable({
  rows,
  portSlug,
}: CruiseScheduleTableProps) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No published cruise calls for this month yet. Check another month or
        confirm timings with your cruise line.
      </p>
    );
  }

  const excursionLink = getPortExcursionLink(portSlug);

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-surface-muted text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Ship</th>
            <th className="px-4 py-3 font-semibold">Cruise line</th>
            <th className="px-4 py-3 font-semibold">Arrival</th>
            <th className="px-4 py-3 font-semibold">Departure</th>
            <th className="px-4 py-3 font-semibold">Passengers</th>
            <th className="px-4 py-3 font-semibold">Excursions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-light)]">
          {rows.map((row) => (
            <tr key={`${row.arrival_date}-${row.ship}-${row.arrival_time ?? "tbc"}`}>
              <td className="px-4 py-3 font-medium text-slate-900">
                {formatScheduleDateLabel(row.arrival_date)}
              </td>
              <td className="px-4 py-3 text-slate-800">{row.ship}</td>
              <td className="px-4 py-3 text-slate-700">{row.cruise_line}</td>
              <td className="px-4 py-3 text-slate-700">
                {formatScheduleTime(row.arrival_time)}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {formatScheduleTime(row.departure_time)}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {row.passengers ? row.passengers.toLocaleString("en-GB") : "Not published"}
              </td>
              <td className="px-4 py-3">
                <Link href={excursionLink} className="content-link font-semibold">
                  Recommended excursions
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="border-t border-[var(--border-light)] px-4 py-3 text-xs leading-5 text-slate-600">
        {cruiseScheduleDisclaimer}
      </p>
    </div>
  );
}
