import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildCruisePlanPdfFilename,
  exportCruisePlanPdfToBuffer,
} from "../src/lib/export-cruise-plan-pdf";
import { findPortScheduleForPdf } from "../src/lib/pdf/cruise-guide-pdf-schedule";
import { generatePlannerRecommendations } from "../src/lib/norway-cruise-planner-engine";

async function main() {
  const cruiseLine = "P&O Cruises";
  const shipName = "Iona";
  const sailingMonth = "June";
  const sailingYear = "2026";

  const result = generatePlannerRecommendations({
    cruiseLine,
    shipName,
    sailingMonth,
    selectedPortSlugs: ["flam", "bergen", "olden", "stavanger", "geiranger"],
    interests: ["Fjords", "Scenic Drives"],
    travellerIds: ["couples"],
    fitnessLevel: "Easy",
    portTime: "6 to 8 hours",
  });

  const flamSchedule = findPortScheduleForPdf(
    "flam",
    shipName,
    sailingMonth,
    sailingYear,
  );

  const input = {
    result,
    cruiseLine,
    shipName,
    sailingMonth,
    sailingYear,
    sailingDate: flamSchedule?.arrival_date ?? "2026-06-12",
    fitnessLevel: "Easy" as const,
    sortedRecommendations: result.recommendations,
  };

  const filename = buildCruisePlanPdfFilename(cruiseLine, shipName);
  const { buffer, pageCount } = await exportCruisePlanPdfToBuffer(input);
  const outputPath = resolve(process.cwd(), filename);

  writeFileSync(outputPath, Buffer.from(buffer));

  const portsWithSchedule = input.sortedRecommendations.filter((rec) =>
    findPortScheduleForPdf(rec.portSlug, shipName, sailingMonth, sailingYear),
  );

  console.log(`Sample PDF written to ${outputPath}`);
  console.log(`Pages: ${pageCount}`);
  console.log(`File size: ${Buffer.from(buffer).byteLength} bytes`);
  console.log(`Ports with imported schedule data: ${portsWithSchedule.length}`);
  portsWithSchedule.forEach((rec) => {
    const row = findPortScheduleForPdf(rec.portSlug, shipName, sailingMonth, sailingYear);
    console.log(
      `  · ${rec.portName}: arrives ${row?.arrival_time ?? "TBC"}, all aboard ${row?.all_aboard_time ?? "not published"}`,
    );
  });
  const pdfText = Buffer.from(buffer).toString("latin1");
  const linkCount = (pdfText.match(/\/URI \(/g) ?? []).length;
  const expectedLinks = 1 + input.sortedRecommendations.length + 1;
  console.log(`PDF link annotations found: ${linkCount} (expected ${expectedLinks})`);
  console.log("Open the PDF and verify clickable booking links.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
