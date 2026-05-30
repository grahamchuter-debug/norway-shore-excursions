import { redirect } from "next/navigation";

/** Legacy URL — master hub lives at /ship-schedules */
export default function LegacyCruiseSchedulesRedirect() {
  redirect("/ship-schedules");
}
