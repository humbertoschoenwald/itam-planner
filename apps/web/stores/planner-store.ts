"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeJsonStorage } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { PlannerState } from "@/lib/types";

export const DEFAULT_PLANNER_STATE: PlannerState = {
  selectedPeriodId: null,
  selectedOfferingIds: [],
};

interface PlannerStoreState {
  state: PlannerState;
  resetPlanner: () => void;
  setSelectedPeriodId: (periodId: string) => void;
  toggleOfferingId: (offeringId: string) => void;
}

const storage = createSafeJsonStorage<PlannerStoreState>();

export const usePlannerStore = create<PlannerStoreState>()(
  persist(
    (set) => ({
      state: DEFAULT_PLANNER_STATE,
      resetPlanner: () => set({ state: DEFAULT_PLANNER_STATE }),
      setSelectedPeriodId: (periodId) =>
        set({
          state: {
            selectedPeriodId: periodId || null,
            selectedOfferingIds: [],
          },
        }),
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
  };
}
