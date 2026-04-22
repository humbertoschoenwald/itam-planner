"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import {
  getCanonicalProgramDisplayName,
  getCanonicalSubjectTitle,
} from "@/lib/presenters/schedule";
import type { BulletinSummary, LocaleCode, ScheduleOffering } from "@/lib/types";

type SubjectsPlansCardProps = {
  locale: LocaleCode;
  plans: BulletinSummary[];
  selectedPlanIds: string[];
  selectedAcademicLabels: string[];
  offerings: ScheduleOffering[];
  subjectTitleLookup: ReadonlyMap<string, string>;
}

export function SubjectsPlansCard({
  locale,
  plans,
  selectedPlanIds,
  selectedAcademicLabels,
  offerings,
  subjectTitleLookup,
}: SubjectsPlansCardProps): React.JSX.Element {
  const copy = getUiCopy(locale);
  const visiblePlans = plans.filter((plan) => selectedPlanIds.includes(plan.plan_id));

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.plannerHome.subjectsBoard.eyebrow}</p>
        <CardTitle>{copy.plannerHome.subjectsBoard.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">{copy.plannerHome.subjectsBoard.description}</p>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="soft-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {copy.plannerHome.subjectsBoard.activePlansLabel}
              </p>
              <span className="rounded-full bg-surface-elevated px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                {visiblePlans.length > 0 ? visiblePlans.length : selectedAcademicLabels.length}
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {visiblePlans.length > 0 ? (
                visiblePlans.map((plan) => (
                  <div
                    key={plan.plan_id}
                    className="rounded-[1.15rem] border border-border/70 bg-background/88 px-3 py-3 text-xs leading-5 text-muted"
                  >
                    <span className="font-semibold text-foreground">
                      {getCanonicalProgramDisplayName(plan.program_title)} · {plan.plan_code}
                    </span>
                    <span className="mt-1 block">{plan.title}</span>
                  </div>
                ))
              ) : selectedAcademicLabels.length > 0 ? (
                selectedAcademicLabels.map((label) => (
                  <div
                    key={label}
                    className="rounded-[1.15rem] bg-background px-3 py-3 text-xs leading-5 text-muted"
                  >
                    <span className="font-semibold text-foreground">{label}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">{copy.plannerHome.subjectsBoard.noPlans}</p>
              )}
            </div>
          </div>

          <div className="soft-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {copy.plannerHome.subjectsBoard.selectedSubjectsLabel}
              </p>
              <span className="rounded-full bg-surface-elevated px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                {offerings.length}
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {offerings.length > 0 ? (
                offerings.map((offering) => (
                  <div
                    key={offering.offering_id}
                    className="rounded-[1.15rem] border border-border/70 bg-background/88 px-3 py-3 text-xs leading-5 text-muted"
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
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">{copy.plannerHome.subjectsBoard.noSubjects}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
