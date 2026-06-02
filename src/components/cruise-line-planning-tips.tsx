type CruiseLinePlanningTipsProps = {
  tips: readonly string[];
  className?: string;
};

export function CruiseLinePlanningTips({
  tips,
  className = "",
}: CruiseLinePlanningTipsProps) {
  if (tips.length === 0) return null;

  return (
    <ul
      className={`not-prose card-grid mt-4 grid gap-3 sm:grid-cols-2 ${className}`.trim()}
    >
      {tips.map((tip) => (
        <li
          key={tip}
          className="rounded-xl border border-[var(--border-light)] bg-slate-50/80 p-4 text-sm leading-6 text-slate-800"
        >
          {tip}
        </li>
      ))}
    </ul>
  );
}
