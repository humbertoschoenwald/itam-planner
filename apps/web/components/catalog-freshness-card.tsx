"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeCatalogSnapshot } from "@/lib/presenters/catalog";
import { getUiCopy } from "@/lib/copy";
import type { LocaleCode, SourcesMetadata } from "@/lib/types";

interface CatalogFreshnessCardProps {
  isLoading: boolean;
  locale: LocaleCode;
  metadata: SourcesMetadata | null;
}

const RUN_STATUS_CLASS_NAMES: Record<string, string> = {
  drift_detected: "bg-amber-100 text-amber-900",
  failed: "bg-rose-100 text-rose-900",
  no_changes: "bg-sky-100 text-sky-900",
  running: "bg-violet-100 text-violet-900",
  succeeded: "bg-emerald-100 text-emerald-900",
};

export function CatalogFreshnessCard({
  isLoading,
  locale,
  metadata,
}: CatalogFreshnessCardProps) {
  const copy = getUiCopy(locale);
  const summary = summarizeCatalogSnapshot(metadata);

  const metrics = [
    {
      label: copy.plannerHome.catalogFreshness.latestPromotion,
      value: formatDateTime(summary.latestPromotionAt, locale),
    },
    {
      label: copy.plannerHome.catalogFreshness.latestObservedSource,
      value: formatDateTime(summary.latestObservedAt, locale),
    },
    {
      label: copy.plannerHome.catalogFreshness.trackedSources,
      value: String(summary.trackedSourceCount),
    },
    {
      label: copy.plannerHome.catalogFreshness.snapshots,
      value: String(summary.totalSnapshotCount),
    },
  ] as const;

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.plannerHome.catalogFreshness.eyebrow}</p>
        <CardTitle>{copy.plannerHome.catalogFreshness.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">
          {copy.plannerHome.catalogFreshness.description}
        </p>

        <div className="metric-grid">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-chip">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {metric.label}
              </p>
              <p className="mt-3 text-base font-semibold text-foreground">
                {isLoading ? "..." : metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4">
          <span
            className={[
              "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
              RUN_STATUS_CLASS_NAMES[summary.latestRunStatus ?? ""] ?? "bg-stone-200 text-stone-800",
            ].join(" ")}
          >
            {copy.plannerHome.catalogFreshness.statusLabels[summary.latestRunStatus ?? "unknown"] ??
              copy.plannerHome.catalogFreshness.statusLabels.unknown}
          </span>
          <div className="text-sm leading-6 text-muted">
            {summary.promotedReleaseId
              ? `${copy.plannerHome.catalogFreshness.releaseLabel}: ${summary.promotedReleaseId}`
              : copy.plannerHome.catalogFreshness.noData}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDateTime(value: string | null, locale: LocaleCode) {
  const copy = getUiCopy(locale);

  if (!value) {
    return copy.plannerHome.catalogFreshness.notAvailableYet;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
