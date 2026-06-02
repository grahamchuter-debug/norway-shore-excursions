import type { CruiseLinePassengerSnapshot } from "@/lib/cruise-lines-data";

type CruisePassengerSnapshotProps = {
  snapshot: CruiseLinePassengerSnapshot;
  cruiseLineName: string;
  className?: string;
};

const fields: readonly {
  key: keyof CruiseLinePassengerSnapshot;
  label: string;
  icon: string;
}[] = [
  { key: "bestFor", label: "Best For", icon: "★" },
  { key: "luxuryLevel", label: "Luxury Level", icon: "◇" },
  { key: "familyFriendly", label: "Family Friendly", icon: "👨‍👩‍👧" },
  { key: "typicalCruiseLength", label: "Typical Cruise Length", icon: "📅" },
  { key: "popularDeparturePort", label: "Popular Departure Port", icon: "⚓" },
  { key: "popularShip", label: "Popular Ship", icon: "🚢" },
  { key: "norwaySeason", label: "Norway Season", icon: "☀" },
];

export function CruisePassengerSnapshot({
  snapshot,
  cruiseLineName,
  className = "",
}: CruisePassengerSnapshotProps) {
  return (
    <aside
      className={`not-prose rounded-2xl border-2 border-[var(--gold)]/35 bg-gradient-to-br from-amber-50/50 via-white to-slate-50 p-6 shadow-md sm:p-8 ${className}`.trim()}
      aria-label={`${cruiseLineName} passenger snapshot`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
        Cruise passenger snapshot
      </p>
      <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
        {cruiseLineName} at a glance
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Quick facts for typical Norway sailings. Confirm dates on your line&apos;s
        schedule search.
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fields.map(({ key, label, icon }) => (
          <div
            key={key}
            className="flex gap-3 rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg"
              aria-hidden
            >
              {icon}
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium leading-6 text-slate-900">
                {snapshot[key]}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </aside>
  );
}
