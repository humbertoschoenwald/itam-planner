"use client";

import { getUiCopy } from "@/lib/copy";
import { getCanonicalSubjectTitle } from "@/lib/planner-subjects";
import { getProductCopy } from "@/lib/product-copy";
import type { LocaleCode, ScheduleOffering } from "@/lib/types";

interface PublicClassSelectionPanelProps {
  activePeriodLabel: string;
  isLoading: boolean;
  loadError: string | null;
  locale: LocaleCode;
  offerings: ScheduleOffering[];
  selectedOfferingIds: string[];
  subjectTitleLookup: ReadonlyMap<string, string>;
  toggleOfferingId: (offeringId: string) => void;
}

export function PublicClassSelectionPanel({
  activePeriodLabel,
  isLoading,
  loadError,
  locale,
  offerings,
  selectedOfferingIds,
  subjectTitleLookup,
  toggleOfferingId,
}: PublicClassSelectionPanelProps) {
  const copy = getUiCopy(locale);
  const productCopy = getProductCopy(locale);
  const selectedOfferingIdSet = new Set(selectedOfferingIds);
  const selectedOfferings = offerings.filter((offering) =>
    selectedOfferingIdSet.has(offering.offering_id),
  );
  const availableOfferings = offerings.filter(
    (offering) => !selectedOfferingIdSet.has(offering.offering_id),
  );

  if (isLoading) {
    return (
      <div className="soft-panel text-sm leading-6 text-muted">
        {productCopy.plannerSettings.scheduleLoading}
      </div>
    );
  }

  if (loadError) {
    return <div className="soft-panel text-sm leading-6 text-muted">{loadError}</div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="grid gap-3">
        <p className="text-sm font-medium text-foreground">{activePeriodLabel}</p>
        {availableOfferings.length > 0 ? (
          availableOfferings.map((offering) => (
            <button
              key={offering.offering_id}
              aria-pressed={false}
              className="choice-card text-left"
              onClick={() => toggleOfferingId(offering.offering_id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="block font-semibold text-foreground">
                    {offering.course_code} · {copy.plannerHome.groupLabel} {offering.group_code}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    {getCanonicalSubjectTitle(
                      offering.course_code,
                      subjectTitleLookup,
                      offering.display_title,
                    )}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    {offering.instructor_name ?? copy.plannerHome.offeredBy} ·{" "}
                    {offering.room_code ?? copy.plannerHome.roomPending}
                  </span>
                </div>
                <span className="rounded-full bg-surface-elevated px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  {productCopy.plannerSettings.availableSubjectBadge}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="soft-panel text-sm leading-6 text-muted">
            {productCopy.plannerSettings.scheduleEmpty}
          </div>
        )}
      </div>

      <div className="rounded-[1.35rem] border border-border bg-surface-elevated px-4 py-4">
        <p className="text-sm font-semibold text-foreground">
          {productCopy.plannerSettings.selectedClassesTitle}: {selectedOfferings.length}
        </p>
        <div className="mt-3 grid gap-2">
          {selectedOfferings.length > 0 ? (
            selectedOfferings.map((offering) => (
              <button
                key={offering.offering_id}
                aria-pressed
                className="rounded-[1.15rem] border border-accent/30 bg-accent-soft px-3 py-3 text-left text-xs leading-5 text-muted"
                onClick={() => toggleOfferingId(offering.offering_id)}
                type="button"
              >
                <span className="font-semibold text-foreground">
                  {offering.course_code} · {offering.group_code}
                </span>
                <span className="mt-1 block">
                  {getCanonicalSubjectTitle(
                    offering.course_code,
                    subjectTitleLookup,
                    offering.display_title,
                  )}
                </span>
                <span className="mt-1 block">
                  {offering.meetings
                    .map(
                      (meeting) =>
                        `${meeting.weekday_code} ${meeting.start_time.slice(0, 5)}-${meeting.end_time.slice(0, 5)}`,
                    )
                    .join(" · ")}
                </span>
              </button>
            ))
          ) : (
            <p className="text-xs text-muted">{productCopy.plannerSettings.selectedClassesEmpty}</p>
          )}
        </div>
      </div>
    </div>
  );
}
