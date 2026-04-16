"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import type { BulletinSummary, LocaleCode, ScheduleOffering } from "@/lib/types";

interface SubjectsPlansCardProps {
  locale: LocaleCode;
  plans: BulletinSummary[];
  selectedPlanIds: string[];
  offerings: ScheduleOffering[];
}

export function SubjectsPlansCard({
  locale,
  plans,
  selectedPlanIds,
  offerings,
}: SubjectsPlansCardProps) {
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

        <div className="grid gap-3">
          <div className="soft-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.plannerHome.subjectsBoard.activePlansLabel}
            </p>
            <div className="mt-3 grid gap-2">
              {visiblePlans.length > 0 ? (
                visiblePlans.map((plan) => (
                  <div
                    key={plan.plan_id}
                    className="rounded-[1.15rem] bg-background px-3 py-3 text-xs leading-5 text-muted"
                  >
                    <span className="font-semibold text-foreground">
                      {plan.program_title} · {plan.plan_code}
                    </span>
                    <span className="mt-1 block">{plan.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">{copy.plannerHome.subjectsBoard.noPlans}</p>
              )}
            </div>
          </div>

          <div className="soft-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {copy.plannerHome.subjectsBoard.selectedSubjectsLabel}
            </p>
            <div className="mt-3 grid gap-2">
              {offerings.length > 0 ? (
                offerings.map((offering) => (
                  <div
                    key={offering.offering_id}
                    className="rounded-[1.15rem] bg-background px-3 py-3 text-xs leading-5 text-muted"
                  >
                    <span className="font-semibold text-foreground">
                      {offering.course_code} · {offering.group_code}
                    </span>
                    <span className="mt-1 block">{offering.display_title}</span>
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
