"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { SelectedWeekBoard } from "@/components/selected-week-board";
import { SubjectsPlansCard } from "@/components/subjects-plans-card";
import { TodayClassesCard } from "@/components/today-classes-card";
import {
  buildRecommendedSubjectCodes,
  buildSelectedAcademicChoiceLabels,
  buildSubjectTitleLookup,
  estimateSemesterNumber,
  fetchSchedulePeriodDetail,
  filterPeriodsForAcademicLevel,
} from "@/lib/presenters/schedule";
import type {
  BulletinDocument,
  BulletinSummary,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";
import { usePlannerStore } from "@/stores/planner-store";
import { usePlannerUiStore } from "@/stores/planner-ui-store";
import { useStudentProfileStore } from "@/stores/student-profile-store";

type PlannerHomeProps = {
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
}: PlannerHomeProps): JSX.Element {
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
  const activePeriodId = resolvePlannerHomePeriodId(
    filteredPeriods,
    plannerState.selectedPeriodId,
    defaultPeriodId,
  );
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
  const widgetVisibility = buildPlannerWidgetVisibility(plannerWidgetIds);

  useSyncPlannerHomePeriod(filteredPeriods, plannerState.selectedPeriodId, defaultPeriodId, setSelectedPeriodId);

  useSeedPlannerHomeSubjects(
    plannerState.selectedSubjectCodes.length,
    recommendedSubjectCodes,
    setSelectedSubjectCodes,
  );

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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8 sm:py-10">
      <PlannerHomePrimaryWidgets
        locale={profile.locale}
        offerings={selectedOfferings}
        subjectTitleLookup={subjectTitleLookup}
        widgetVisibility={widgetVisibility}
      />

      <PlannerHomeSubjectsSection
        locale={profile.locale}
        offerings={selectedOfferings}
        plans={plans}
        selectedAcademicLabels={selectedAcademicLabels}
        selectedPlanIds={profile.activePlanIds}
        showSubjects={widgetVisibility.showSubjects}
        subjectTitleLookup={subjectTitleLookup}
      />
    </main>
  );
}

function resolvePlannerHomePeriodId(
  filteredPeriods: SchedulePeriodSummary[],
  selectedPeriodId: string | null,
  defaultPeriodId: string | null,
): string | null {
  return filteredPeriods.some((period) => period.period_id === selectedPeriodId)
    ? selectedPeriodId
    : defaultPeriodId;
}

function buildPlannerWidgetVisibility(plannerWidgetIds: string[]): {
  showSubjects: boolean;
  showToday: boolean;
  showWeek: boolean;
} {
  return {
    showSubjects: plannerWidgetIds.includes("subjects"),
    showToday: plannerWidgetIds.includes("today"),
    showWeek: plannerWidgetIds.includes("week"),
  };
}

function useSyncPlannerHomePeriod(
  filteredPeriods: SchedulePeriodSummary[],
  selectedPeriodId: string | null,
  defaultPeriodId: string | null,
  setSelectedPeriodId: (periodId: string) => void,
): void {
  useEffect(() => {
    const validPeriodIds = new Set(filteredPeriods.map((period) => period.period_id));

    if ((!selectedPeriodId || !validPeriodIds.has(selectedPeriodId)) && defaultPeriodId) {
      setSelectedPeriodId(defaultPeriodId);
    }
  }, [defaultPeriodId, filteredPeriods, selectedPeriodId, setSelectedPeriodId]);
}

function useSeedPlannerHomeSubjects(
  selectedSubjectCount: number,
  recommendedSubjectCodes: string[],
  setSelectedSubjectCodes: (subjectCodes: string[]) => void,
): void {
  useEffect(() => {
    if (selectedSubjectCount > 0 || recommendedSubjectCodes.length === 0) {
      return;
    }

    setSelectedSubjectCodes(recommendedSubjectCodes);
  }, [recommendedSubjectCodes, selectedSubjectCount, setSelectedSubjectCodes]);
}

function PlannerHomePrimaryWidgets({
  locale,
  offerings,
  subjectTitleLookup,
  widgetVisibility,
}: {
  locale: ReturnType<typeof useStudentProfileStore.getState>["profile"]["locale"];
  offerings: Awaited<ReturnType<typeof fetchSchedulePeriodDetail>>["offerings"];
  subjectTitleLookup: ReadonlyMap<string, string>;
  widgetVisibility: { showSubjects: boolean; showToday: boolean; showWeek: boolean };
}): JSX.Element {
  return (
    <section className="page-grid min-[820px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] min-[820px]:items-start">
      {widgetVisibility.showToday ? (
        <TodayClassesCard
          locale={locale}
          offerings={offerings}
          subjectTitleLookup={subjectTitleLookup}
        />
      ) : null}
      {widgetVisibility.showWeek ? (
        <SelectedWeekBoard
          locale={locale}
          offerings={offerings}
          subjectTitleLookup={subjectTitleLookup}
        />
      ) : null}
    </section>
  );
}

function PlannerHomeSubjectsSection({
  locale,
  offerings,
  plans,
  selectedAcademicLabels,
  selectedPlanIds,
  showSubjects,
  subjectTitleLookup,
}: {
  locale: ReturnType<typeof useStudentProfileStore.getState>["profile"]["locale"];
  offerings: Awaited<ReturnType<typeof fetchSchedulePeriodDetail>>["offerings"];
  plans: BulletinSummary[];
  selectedAcademicLabels: string[];
  selectedPlanIds: string[];
  showSubjects: boolean;
  subjectTitleLookup: ReadonlyMap<string, string>;
}): JSX.Element | null {
  if (!showSubjects) {
    return null;
  }

  return (
    <section className="page-grid min-[820px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] min-[820px]:items-start">
      <SubjectsPlansCard
        locale={locale}
        offerings={offerings}
        plans={plans}
        selectedAcademicLabels={selectedAcademicLabels}
        selectedPlanIds={selectedPlanIds}
        subjectTitleLookup={subjectTitleLookup}
      />
    </section>
  );
}
