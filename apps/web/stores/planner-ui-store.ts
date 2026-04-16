"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeJsonStorage } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { PlannerWidgetId } from "@/lib/types";

export type NavSwipePreference = "natural" | "inverted" | null;

export const PLANNER_WIDGET_IDS = ["today", "week", "subjects"] as const satisfies readonly PlannerWidgetId[];

export interface PlannerUiState {
  navSwipePreference: NavSwipePreference;
  plannerWidgetIds: PlannerWidgetId[];
}

interface PlannerUiStoreState {
  state: PlannerUiState;
  resetPlannerUi: () => void;
  setNavSwipePreference: (preference: Exclude<NavSwipePreference, null>) => void;
  setPlannerWidgetIds: (widgetIds: PlannerWidgetId[]) => void;
  togglePlannerWidgetId: (widgetId: PlannerWidgetId) => void;
}

export const DEFAULT_PLANNER_UI_STATE: PlannerUiState = {
  navSwipePreference: null,
  plannerWidgetIds: [],
};

const storage = createSafeJsonStorage<PlannerUiStoreState>();

export const usePlannerUiStore = create<PlannerUiStoreState>()(
  persist(
    (set) => ({
      state: DEFAULT_PLANNER_UI_STATE,
      resetPlannerUi: () => set({ state: DEFAULT_PLANNER_UI_STATE }),
      setNavSwipePreference: (preference) =>
        set((current) => ({
          state: {
            ...current.state,
            navSwipePreference: preference,
          },
        })),
      setPlannerWidgetIds: (widgetIds) =>
        set((current) => ({
          state: {
            ...current.state,
            plannerWidgetIds: sanitizePlannerWidgetIds(widgetIds),
          },
        })),
      togglePlannerWidgetId: (widgetId) =>
        set((current) => {
          const exists = current.state.plannerWidgetIds.includes(widgetId);
          return {
            state: {
              ...current.state,
              plannerWidgetIds: exists
                ? current.state.plannerWidgetIds.filter((value) => value !== widgetId)
                : [...current.state.plannerWidgetIds, widgetId],
            },
          };
        }),
    }),
    {
      name: STORAGE_KEYS.plannerUi,
      merge: (persistedState, currentState) => ({
        ...currentState,
        state: sanitizePlannerUiState(
          (persistedState as Partial<PlannerUiStoreState> | undefined)?.state,
        ),
      }),
      storage,
    },
  ),
);

function sanitizePlannerUiState(value: unknown): PlannerUiState {
  if (!value || typeof value !== "object") {
    return DEFAULT_PLANNER_UI_STATE;
  }

  const candidate = value as Partial<PlannerUiState>;

  return {
    navSwipePreference:
      candidate.navSwipePreference === "natural" || candidate.navSwipePreference === "inverted"
        ? candidate.navSwipePreference
        : null,
    plannerWidgetIds: sanitizePlannerWidgetIds(candidate.plannerWidgetIds),
  };
}

function sanitizePlannerWidgetIds(value: unknown): PlannerWidgetId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((widgetId): widgetId is PlannerWidgetId => PLANNER_WIDGET_IDS.includes(widgetId as PlannerWidgetId)))];
}
