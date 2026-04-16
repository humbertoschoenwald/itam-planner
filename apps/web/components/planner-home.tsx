"use client";

import { useEffect, useMemo, useState } from "react";

import { SelectedWeekBoard } from "@/components/selected-week-board";
import { SubjectsPlansCard } from "@/components/subjects-plans-card";
import { TodayClassesCard } from "@/components/today-classes-card";
import { fetchSchedulePeriodDetail } from "@/lib/api";
import { buildSelectedAcademicChoiceLabels, filterPeriodsForAcademicLevel } from "@/lib/onboarding";
import {
  buildRecommendedSubjectCodes,
  buildSubjectTitleLookup,
  estimateSemesterNumber,
} from "@/lib/planner-subjects";
import type {
  BulletinDocument,
  BulletinSummary,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

interface PlannerHomeProps {
  bulletinDocuments: BulletinDocument[];
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export function PlannerHome({
  bulletinDocuments,
  plans,
  periods,
  sourcesMetadata: _sourcesMetadata,
}: PlannerHomeProps) {
  void _sourcesMetadata;

  const profile = useStudentProfileStore((state) => state.profile);
  const plannerState = usePlannerStore((state) => state.state);
  const plannerWidgetIds = usePlannerUiStore((state) => state.state.plannerWidgetIds);
  const setSelectedPeriodId = usePlannerStore((state) => state.setSelectedPeriodId);
  const setSelectedSubjectCodes = usePlannerStore((state) => state.setSelectedSubjectCodes);
  const [selectedPeriod, setSelectedPeriod] = useState<Awaited<
    ReturnType<typeof fetchSchedulePeriodDetail>
  > | null>(null);
  const [resolvedPeriodId, setResolvedPeriodId] = useState<string | null>(null);

  const filteredPeriods = useMemo(
    () => filterPeriodsForAcademicLevel(periods, profile.academicLevel),
    [periods, profile.academicLevel],
  );
  const defaultPeriodId = filteredPeriods[0]?.period_id ?? null;
  const activePeriodId = filteredPeriods.some(
    (period) => period.period_id === plannerState.selectedPeriodId,
  )
    ? plannerState.selectedPeriodId
    : defaultPeriodId;
  const activePeriodSummary =
    filteredPeriods.find((period) => period.period_id === activePeriodId) ?? null;
  const activePlanDocuments = useMemo(
    () => bulletinDocuments.filter((document) => profile.activePlanIds.includes(document.plan_id)),
    [bulletinDocuments, profile.activePlanIds],
  );
  const subjectTitleLookup = useMemo(
    () => buildSubjectTitleLookup(bulletinDocuments),
    [bulletinDocuments],
  );
  const estimatedSemester = useMemo(
    () => estimateSemesterNumber(profile.entryTerm, activePeriodSummary),
    [activePeriodSummary, profile.entryTerm],
  );
  const recommendedSubjectCodes = useMemo(
    () =>
      buildRecommendedSubjectCodes(activePlanDocuments, estimatedSemester, {
        allDocuments: bulletinDocuments,
        fallbackCareerIds: profile.selectedCareerIds,
      }),
    [activePlanDocuments, bulletinDocuments, estimatedSemester, profile.selectedCareerIds],
  );
  const selectedAcademicLabels = useMemo(
    () => buildSelectedAcademicChoiceLabels(profile.selectedCareerIds, profile.selectedJointProgramIds),
    [profile.selectedCareerIds, profile.selectedJointProgramIds],
  );
  const resolvedSelectedPeriod = resolvedPeriodId === activePeriodId ? selectedPeriod : null;

  useEffect(() => {
    const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

    if ((!plannerState.selectedPeriodId || !validPeriodIds.has(plannerState.selectedPeriodId)) && defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId);
    }
  }, [defaultPeriodId, filteredPeriods, plannerState.selectedPeriodId, setSelectedPeriodId]);

  useEffect(() => {
    if (plannerState.selectedSubjectCodes.length > 0 || recommendedSubjectCodes.length === 0) {
      return;
    }

    setSelectedSubjectCodes(recommendedSubjectCodes);
  }, [
    plannerState.selectedSubjectCodes.length,
    recommendedSubjectCodes,
    setSelectedSubjectCodes,
  ]);

  useEffect(() => {
    if (!activePeriodId) {
      return;
    }

    let active = true;

    void fetchSchedulePeriodDetail(activePeriodId)
      .then((detail) => {
        if (!active) {
          return;
        }
        setResolvedPeriodId(activePeriodId);
        setSelectedPeriod(detail);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setResolvedPeriodId(activePeriodId);
        setSelectedPeriod(null);
      });

    return () => {
      active = false;
    };
  }, [activePeriodId]);

  const selectedOfferings =
    resolvedSelectedPeriod?.offerings.filter((offering) =>
      plannerState.selectedOfferingIds.includes(offering.offering_id),
    ) ?? [];
  const showTodayWidget = plannerWidgetIds.includes("today");
  const showWeekWidget = plannerWidgetIds.includes("week");
  const showSubjectsWidget = plannerWidgetIds.includes("subjects");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <section className="page-grid">
        {showTodayWidget ? (
          <TodayClassesCard
            locale={profile.locale}
            offerings={selectedOfferings}
            subjectTitleLookup={subjectTitleLookup}
          />
        ) : null}
        {showWeekWidget ? (
          <SelectedWeekBoard
            locale={profile.locale}
            offerings={selectedOfferings}
            subjectTitleLookup={subjectTitleLookup}
          />
        ) : null}
      </section>

      {showSubjectsWidget ? (
        <section className="page-grid">
          <SubjectsPlansCard
            locale={profile.locale}
            offerings={selectedOfferings}
            plans={plans}
            selectedAcademicLabels={selectedAcademicLabels}
            selectedPlanIds={profile.activePlanIds}
            subjectTitleLookup={subjectTitleLookup}
          />
        </section>
      ) : null}
    </main>
  );
}
