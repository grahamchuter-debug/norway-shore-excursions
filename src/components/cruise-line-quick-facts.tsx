type CruiseLineQuickFactsProps = {
  typicalItineraries: string;
  fjordDestinations: string;
  typicalShoreTime: string;
  cruiseStyle: string;
  passengerTypes: string;
  className?: string;
};

const factFields: readonly {
  key: keyof Omit<CruiseLineQuickFactsProps, "className">;
  label: string;
}[] = [
  { key: "typicalItineraries", label: "Typical routes" },
  { key: "fjordDestinations", label: "Fjord highlights" },
  { key: "typicalShoreTime", label: "Shore time" },
  { key: "cruiseStyle", label: "Cruise style" },
  { key: "passengerTypes", label: "Passengers" },
];

export function CruiseLineQuickFacts({
  typicalItineraries,
  fjordDestinations,
  typicalShoreTime,
  cruiseStyle,
  passengerTypes,
  className = "",
}: CruiseLineQuickFactsProps) {
  const values = {
    typicalItineraries,
    fjordDestinations,
    typicalShoreTime,
    cruiseStyle,
    passengerTypes,
  };

  return (
    <dl
      className={`not-prose card-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
    >
      {factFields.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-xl border border-[var(--border-light)] bg-white p-4 shadow-sm"
        >
          <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
            {label}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-slate-800">{values[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
