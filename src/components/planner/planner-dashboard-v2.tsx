"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { PlannerResultsExplorer } from "@/components/planner/planner-results-explorer";
import {
  buildCruisePlanPdfFilename,
  exportCruisePlanPdf,
} from "@/lib/export-cruise-plan-pdf";
import type { FitnessLevel } from "@/lib/ports-data";
import {
  getConfidenceClass,
  getMatchScoreBand,
  getPortExcursionConfidence,
  type PlannerResult,
} from "@/lib/norway-cruise-planner-engine";

type PlannerDashboardV2Props = {
  result: PlannerResult;
  cruiseLine: string;
  shipName: string;
  sailingMonth: string;
  fitnessLevel: FitnessLevel;
  selectedPorts: readonly string[];
};

function gaugeColor(tier: ReturnType<typeof getMatchScoreBand>["tier"]): string {
  switch (tier) {
    case "excellent":
      return "var(--fjord-green)";
    case "great":
      return "var(--glacier-blue)";
    case "good":
      return "var(--gold)";
    default:
      return "#94a3b8";
  }
}

function MatchScoreGauge({ score }: { score: number }) {
  const band = getMatchScoreBand(score);
  const color = gaugeColor(band.tier);
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex h-36 w-36 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(from 210deg, ${color} 0deg, ${color} ${clamped * 2.7}deg, #e2e8f0 ${clamped * 2.7}deg, #e2e8f0 270deg, transparent 270deg)`,
        }}
        role="img"
        aria-label={`Cruise match score ${score} out of 100, ${band.label}`}
      >
        <div className="flex h-[calc(100%-18px)] w-[calc(100%-18px)] flex-col items-center justify-center rounded-full bg-white shadow-inner">
          <span className="text-3xl font-bold text-[var(--navy-deep)]">{score}</span>
          <span className="text-xs font-medium text-slate-500">out of 100</span>
        </div>
      </div>
      <p
        className="mt-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
        style={{
          color,
          backgroundColor: `color-mix(in srgb, ${color} 12%, white)`,
          border: `1px solid color-mix(in srgb, ${color} 30%, white)`,
        }}
      >
        {band.label}
      </p>
    </div>
  );
}

function StarRating({ stars, label }: { stars: number; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-lg tracking-wider text-[var(--gold)]" aria-hidden>
        {"★".repeat(stars)}
        <span className="text-slate-200">{"★".repeat(5 - stars)}</span>
      </span>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
    </div>
  );
}

function InsightCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-lg font-bold text-[var(--navy-deep)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

export function PlannerDashboardV2({
  result,
  cruiseLine,
  shipName,
  sailingMonth,
  fitnessLevel,
  selectedPorts,
}: PlannerDashboardV2Props) {
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { summary, recommendations } = result;

  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      const indexA = selectedPorts.indexOf(a.portSlug);
      const indexB = selectedPorts.indexOf(b.portSlug);
      if (indexA >= 0 && indexB >= 0) return indexA - indexB;
      return b.cruiseFitScore - a.cruiseFitScore;
    });
  }, [recommendations, selectedPorts]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSavePdf = useCallback(async () => {
    if (isSavingPdf) return;

    setPdfError(null);
    setIsSavingPdf(true);

    try {
      await exportCruisePlanPdf(
        {
          result,
          cruiseLine,
          shipName,
          sailingMonth,
          fitnessLevel,
          sortedRecommendations,
        },
        buildCruisePlanPdfFilename(cruiseLine, shipName),
      );
    } catch (error) {
      console.error("PDF export failed:", error);
      setPdfError(
        "We could not create your PDF. Please try again, or use Print Cruise Plan.",
      );
    } finally {
      setIsSavingPdf(false);
    }
  }, [
    cruiseLine,
    fitnessLevel,
    isSavingPdf,
    result,
    sailingMonth,
    shipName,
    sortedRecommendations,
  ]);

  return (
    <section
      id="planner-dashboard-v2"
      className="planner-dashboard-v2 border-t border-[var(--border-light)] bg-surface-muted px-4 py-8 sm:px-6"
      aria-labelledby="planner-v2-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="planner-print-header hidden print:block">
          <p className="text-sm font-semibold text-slate-700">
            Norway Cruise Planner™ Version 2.0
          </p>
          <p className="text-xs text-slate-600">
            {cruiseLine}
            {shipName ? ` · ${shipName}` : ""} · {sailingMonth}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Norway Cruise Planner™ Version 2.0
            </p>
            <h3
              id="planner-v2-heading"
              className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl"
            >
              Your personalised cruise dashboard
            </h3>
            {shipName ? (
              <p className="mt-1 text-sm text-slate-600">
                {cruiseLine} · {shipName} · {sailingMonth}
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-600">
                {cruiseLine} · {sailingMonth}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 planner-no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg border border-[var(--navy-deep)] bg-white px-4 py-2 text-sm font-semibold text-[var(--navy-deep)] transition hover:bg-slate-50"
            >
              Print Cruise Plan
            </button>
            <button
              type="button"
              onClick={handleSavePdf}
              disabled={isSavingPdf}
              className="btn-primary-on-light px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingPdf ? "Preparing PDF..." : "Save as PDF"}
            </button>
          </div>
        </div>

        {pdfError ? (
          <p className="mt-3 text-sm text-red-700">{pdfError}</p>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr]">
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Cruise Match Score</p>
            <div className="mt-4 flex justify-center">
              <MatchScoreGauge score={summary.overallScore} />
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
              <li>
                <span className="font-semibold text-[var(--fjord-green)]">90 to 100</span>{" "}
                Excellent Match
              </li>
              <li>
                <span className="font-semibold text-[var(--glacier-blue)]">75 to 89</span>{" "}
                Great Match
              </li>
              <li>
                <span className="font-semibold text-[var(--gold)]">60 to 74</span> Good Match
              </li>
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InsightCard
              title="Best port"
              value={summary.bestPort}
              detail={summary.bestPortWhy}
            />
            <InsightCard
              title="Hidden gem"
              value={summary.bestHiddenGem}
              detail={summary.bestHiddenGemWhy}
            />
            <InsightCard
              title="Best excursion type"
              value={summary.bestExcursionType}
              detail={`Most of your selected ports align with ${summary.bestExcursionType.toLowerCase()} style days based on your interests.`}
            />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Excursion confidence
          </p>
          <div className="mt-3">
            <StarRating
              stars={summary.excursionConfidence.stars}
              label={summary.excursionConfidence.label}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {summary.returnToShipSummary}
          </p>
        </div>

        <blockquote className="mt-6 rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-white to-[var(--gold)]/5 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold)]">
            Personal summary
          </p>
          <p className="mt-3 text-base leading-7 text-slate-800 sm:text-lg">
            {summary.personalSummary}
          </p>
        </blockquote>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Personalised port itinerary
          </p>
          <h4 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Your day by day excursion plan
          </h4>

          <ol className="card-grid mt-6 space-y-5">
            {sortedRecommendations.map((rec, index) => {
              const confidence = getPortExcursionConfidence(rec.cruiseFitScore);
              return (
                <li
                  key={rec.portSlug}
                  className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-44">
                      <Image
                        src={rec.imageUrl}
                        alt={rec.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 176px"
                        unoptimized
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--navy-deep)]">
                        Stop {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h5 className="text-lg font-bold text-[var(--navy-deep)]">
                            {rec.portName}
                          </h5>
                          <p className="mt-1 text-sm font-medium text-[var(--glacier-blue)]">
                            {rec.excursionType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Cruise fit
                          </p>
                          <p className="text-2xl font-bold text-[var(--navy-deep)]">
                            {rec.cruiseFitScore}
                          </p>
                        </div>
                      </div>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        Recommended: {rec.recommended}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{rec.why}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <StarRating
                          stars={confidence.stars}
                          label={confidence.label}
                        />
                        <span
                          className={`score-badge ${getConfidenceClass(rec.returnConfidence)}`}
                        >
                          {rec.returnLabel}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 planner-no-print">
                        <Link
                          href={rec.authorityPortPath}
                          className="content-link text-sm font-semibold"
                        >
                          Explore {rec.portName}
                        </Link>
                        <a
                          href={rec.localSiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="content-link text-sm font-semibold"
                        >
                          Book locally
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="planner-no-print">
          <PlannerResultsExplorer
            recommendations={recommendations}
            routePorts={selectedPorts}
          />
        </div>
      </div>
    </section>
  );
}
