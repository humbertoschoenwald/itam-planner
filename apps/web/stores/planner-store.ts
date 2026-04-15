"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

const storage = createJSONStorage<PlannerStoreState>(() =>
  typeof window === "undefined"
    ? {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      }
    : window.localStorage,
);

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
      storage,
    },
  ),
);
