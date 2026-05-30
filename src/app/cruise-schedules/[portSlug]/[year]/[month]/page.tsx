import { notFound, redirect } from "next/navigation";

import {
  buildScheduleMonthSlug,
  scheduledPortSlugs,
  scheduleMonths2026,
  scheduleYears,
  shipScheduleMonthPath,
} from "@/lib/cruise-schedule-config";

type LegacySchedulePageProps = {
  params: Promise<{ portSlug: string; year: string; month: string }>;
};

export async function generateStaticParams() {
  return scheduledPortSlugs.flatMap((portSlug) =>
    scheduleMonths2026.map((month) => ({
      portSlug,
      year: scheduleYears[0],
      month,
    })),
  );
}

/** Legacy URL — canonical monthly pages live under /ship-schedules/[port]/[monthSlug] */
export default async function LegacyCruiseScheduleMonthRedirect({
  params,
}: LegacySchedulePageProps) {
  const { portSlug, year, month } = await params;

  if (
    !scheduledPortSlugs.includes(portSlug as (typeof scheduledPortSlugs)[number]) ||
    year !== scheduleYears[0] ||
    !scheduleMonths2026.includes(month as (typeof scheduleMonths2026)[number])
  ) {
    notFound();
  }

  redirect(shipScheduleMonthPath(portSlug, buildScheduleMonthSlug(month, year)));
}
