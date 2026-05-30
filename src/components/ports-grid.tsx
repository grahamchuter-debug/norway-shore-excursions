import { PortCard } from "@/components/port-card";
import { portBySlug, portSlugs } from "@/lib/ports-data";

export function PortsGrid() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
      {portSlugs.map((slug) => (
        <PortCard key={slug} port={portBySlug[slug]} />
      ))}
    </div>
  );
}
