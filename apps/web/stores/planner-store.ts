"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeJsonStorage } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { PlannerState } from "@/lib/types";

export const DEFAULT_PLANNER_STATE: PlannerState = {
  selectedPeriodId: null,
  selectedOfferingIds: [],
  selectedSubjectCodes: [],
};

interface PlannerStoreState {
  state: PlannerState;
  resetPlanner: () => void;
  setSelectedOfferingIds: (offeringIds: string[]) => void;
  setSelectedPeriodId: (periodId: string) => void;
  setSelectedSubjectCodes: (subjectCodes: string[]) => void;
  toggleOfferingId: (offeringId: string) => void;
  toggleSubjectCode: (subjectCode: string) => void;
}

const storage = createSafeJsonStorage<PlannerStoreState>();

export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set) => ({
      state: DEFAULT_PLANNER_STATE,
      resetPlanner: () => set({ state: DEFAULT_PLANNER_STATE }),
      setSelectedOfferingIds: (offeringIds) =>
        set((current) => ({
          state: {
            ...current.state,
            selectedOfferingIds: [
              ...new Set(
                offeringIds.filter(
                  (offeringId): offeringId is string => typeof offeringId === "string",
                ),
              ),
            ],
          },
        })),
      setSelectedPeriodId: (periodId) =>
        set((current) => ({
          state: {
            ...current.state,
            selectedOfferingIds: [],
            selectedPeriodId: periodId || null,
          },
        })),
      setSelectedSubjectCodes: (subjectCodes) =>
        set((current) => ({
          state: {
            ...current.state,
            selectedSubjectCodes: [
              ...new Set(
                subjectCodes.filter(
                  (subjectCode): subjectCode is string => typeof subjectCode === "string",
                ),
              ),
            ],
          },
        })),
      toggleOfferingId: (offeringId) =>
        set((current) => {
          const alreadySelected = current.state.selectedOfferingIds.includes(offeringId);
          return {
            state: {
              ...current.state,
              selectedOfferingIds: alreadySelected
                ? current.state.selectedOfferingIds.filter((value) => value !== offeringId)
                : [...current.state.selectedOfferingIds, offeringId],
            },
          };
        }),
      toggleSubjectCode: (subjectCode) =>
        set((current) => {
          const alreadySelected = current.state.selectedSubjectCodes.includes(subjectCode);
          return {
            state: {
              ...current.state,
              selectedSubjectCodes: alreadySelected
                ? current.state.selectedSubjectCodes.filter((value) => value !== subjectCode)
                : [...current.state.selectedSubjectCodes, subjectCode],
            },
          };
        }),
    }),
    {
      name: STORAGE_KEYS.plannerState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        state: sanitizePlannerState(
          (persistedState as Partial<PlannerStoreState> | undefined)?.state,
        ),
      }),
      storage,
    },
  ),
);

function sanitizePlannerState(value: unknown): PlannerState {
  if (!value || typeof value !== "object") {
    return DEFAULT_PLANNER_STATE;
  }

  const candidate = value as Partial<PlannerState>;

  return {
    selectedOfferingIds: Array.isArray(candidate.selectedOfferingIds)
      ? [
          ...new Set(
            candidate.selectedOfferingIds.filter(
              (offeringId): offeringId is string => typeof offeringId === "string",
            ),
          ),
        ]
      : [],
    selectedPeriodId:
      typeof candidate.selectedPeriodId === "string" && candidate.selectedPeriodId.length > 0
        ? candidate.selectedPeriodId
        : null,
    selectedSubjectCodes: Array.isArray(candidate.selectedSubjectCodes)
      ? [
          ...new Set(
            candidate.selectedSubjectCodes.filter(
              (subjectCode): subjectCode is string => typeof subjectCode === "string",
            ),
          ),
        ]
      : [],
  };
}
