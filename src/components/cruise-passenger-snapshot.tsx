import type { CruiseLinePassengerSnapshot } from "@/lib/cruise-lines-data";

type CruisePassengerSnapshotProps = {
  snapshot: CruiseLinePassengerSnapshot;
  cruiseLineName: string;
  className?: string;
};

const fields: readonly {
  key: keyof CruiseLinePassengerSnapshot;
  label: string;
}[] = [
  { key: "bestFor", label: "Best For" },
  { key: "typicalPassengerStyle", label: "Typical Passenger Style" },
  { key: "typicalCruiseLength", label: "Typical Cruise Length" },
  { key: "popularDeparturePorts", label: "Popular Departure Ports" },
  { key: "familyFriendly", label: "Family Friendly" },
  { key: "luxuryLevel", label: "Luxury Level" },
  { key: "norwaySeason", label: "Norway Season" },
];

export function CruisePassengerSnapshot({
  snapshot,
  cruiseLineName,
  className = "",
}: CruisePassengerSnapshotProps) {
  return (
    <aside
      className={`not-prose rounded-2xl border border-[var(--border-light)] bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm sm:p-8 ${className}`.trim()}
      aria-label={`${cruiseLineName} passenger snapshot`}
    >
      <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
        Cruise Passenger Snapshot
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Typical {cruiseLineName} Norway sailings at a glance. Use this alongside
        your ship schedule and port guides.
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl border border-[var(--border-light)] bg-white p-4"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
              {label}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-slate-800">
              {snapshot[key]}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
