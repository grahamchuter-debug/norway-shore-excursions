import { getScheduleComingSoonMessage } from "@/lib/cruiseSchedules";

type CruiseScheduleComingSoonProps = {
  portName?: string;
};

export function CruiseScheduleComingSoon({
  portName: _portName,
}: CruiseScheduleComingSoonProps) {
  const message = getScheduleComingSoonMessage();
  const paragraphs = message.split("\n\n");

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm leading-7 text-slate-700">
      {paragraphs.map((paragraph, index) => (
        <p key={paragraph} className={index < paragraphs.length - 1 ? "mb-3" : undefined}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
