"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeJsonStorage } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export const SCHEDULE_PREFERENCE_DAY_CODES = [
  "LU",
  "MA",
  "MI",
  "JU",
  "VI",
  "SA",
  "DO",
] as const;

export type SchedulePreferenceDayCode = (typeof SCHEDULE_PREFERENCE_DAY_CODES)[number];
export type ClassSpacingPreference = "clustered" | "separated";
export type SchedulePreferenceWeightKey =
  | "teacherRanking"
  | "classSpacing"
  | "timeRange"
  | "lighterDay"
  | "sameTheoryLabGroup";

export type SchedulePreferenceWeights = {
  classSpacing: number;
  lighterDay: number;
  sameTheoryLabGroup: number;
  teacherRanking: number;
  timeRange: number;
}

export type ScheduleGenerationPreferences = {
  classSpacing: ClassSpacingPreference;
  lighterDayPreference: SchedulePreferenceDayCode | null;
  sameTheoryLabGroup: boolean;
  timeRangeEnd: string;
  timeRangeStart: string;
  useTeacherRanking: boolean;
  weights: SchedulePreferenceWeights;
}

type PlannerPreferencesStoreState = {
  preferences: ScheduleGenerationPreferences;
  resetPreferences: () => void;
  setClassSpacing: (value: ClassSpacingPreference) => void;
  setLighterDayPreference: (value: SchedulePreferenceDayCode | null) => void;
  setSameTheoryLabGroup: (value: boolean) => void;
  setTimeRange: (start: string, end: string) => void;
  setUseTeacherRanking: (value: boolean) => void;
  setWeight: (key: SchedulePreferenceWeightKey, value: number) => void;
}

export const DEFAULT_SCHEDULE_GENERATION_PREFERENCES: ScheduleGenerationPreferences = {
  classSpacing: "clustered",
  lighterDayPreference: null,
  sameTheoryLabGroup: false,
  timeRangeEnd: "22:00",
  timeRangeStart: "07:00",
  useTeacherRanking: true,
  weights: {
    classSpacing: 50,
    lighterDay: 50,
    sameTheoryLabGroup: 50,
    teacherRanking: 50,
    timeRange: 50,
  },
};

const storage = createSafeJsonStorage<PlannerPreferencesStoreState>();

export const usePlannerPreferencesStore = create<PlannerPreferencesStoreState>()(
  persist(
    (set) => ({
      preferences: DEFAULT_SCHEDULE_GENERATION_PREFERENCES,
      resetPreferences: () => set({ preferences: DEFAULT_SCHEDULE_GENERATION_PREFERENCES }),
      setClassSpacing: (value) =>
        set((current) => ({
          preferences: {
            ...current.preferences,
            classSpacing: value,
          },
        })),
      setLighterDayPreference: (value) =>
        set((current) => ({
          preferences: {
            ...current.preferences,
            lighterDayPreference: value,
          },
        })),
      setSameTheoryLabGroup: (value) =>
        set((current) => ({
          preferences: {
            ...current.preferences,
            sameTheoryLabGroup: value,
          },
        })),
      setTimeRange: (start, end) =>
        set((current) => {
          const nextStart = sanitizeTimeValue(
            start,
            DEFAULT_SCHEDULE_GENERATION_PREFERENCES.timeRangeStart,
          );
          const nextEnd = sanitizeTimeValue(
            end,
            DEFAULT_SCHEDULE_GENERATION_PREFERENCES.timeRangeEnd,
          );
          const [timeRangeStart, timeRangeEnd] =
            compareTimeValues(nextStart, nextEnd) <= 0
              ? [nextStart, nextEnd]
              : [nextEnd, nextStart];

          return {
            preferences: {
              ...current.preferences,
              timeRangeEnd,
              timeRangeStart,
            },
          };
        }),
      setUseTeacherRanking: (value) =>
        set((current) => ({
          preferences: {
            ...current.preferences,
            useTeacherRanking: value,
          },
        })),
      setWeight: (key, value) =>
        set((current) => ({
          preferences: {
            ...current.preferences,
            weights: {
              ...current.preferences.weights,
              [key]: sanitizeWeightValue(value),
            },
          },
        })),
    }),
    {
      name: STORAGE_KEYS.plannerPreferences,
      merge: (persistedState, currentState) => ({
        ...currentState,
        preferences: sanitizeScheduleGenerationPreferences(
          (persistedState as Partial<PlannerPreferencesStoreState> | undefined)?.preferences,
        ),
      }),
      storage,
    },
  ),
);

function sanitizeScheduleGenerationPreferences(
  value: unknown,
): ScheduleGenerationPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_SCHEDULE_GENERATION_PREFERENCES;
  }

  const candidate = value as Partial<ScheduleGenerationPreferences>;
  const start = sanitizeTimeValue(
    candidate.timeRangeStart,
    DEFAULT_SCHEDULE_GENERATION_PREFERENCES.timeRangeStart,
  );
  const end = sanitizeTimeValue(
    candidate.timeRangeEnd,
    DEFAULT_SCHEDULE_GENERATION_PREFERENCES.timeRangeEnd,
  );

  return {
    classSpacing:
      candidate.classSpacing === "clustered" || candidate.classSpacing === "separated"
        ? candidate.classSpacing
        : DEFAULT_SCHEDULE_GENERATION_PREFERENCES.classSpacing,
    lighterDayPreference: SCHEDULE_PREFERENCE_DAY_CODES.includes(
      candidate.lighterDayPreference as SchedulePreferenceDayCode,
    )
      ? (candidate.lighterDayPreference as SchedulePreferenceDayCode)
      : null,
    sameTheoryLabGroup: candidate.sameTheoryLabGroup === true,
    timeRangeEnd: compareTimeValues(start, end) <= 0 ? end : start,
    timeRangeStart: compareTimeValues(start, end) <= 0 ? start : end,
    useTeacherRanking: candidate.useTeacherRanking !== false,
    weights: sanitizeWeights(candidate.weights),
  };
}

function sanitizeWeights(value: unknown): SchedulePreferenceWeights {
  if (!value || typeof value !== "object") {
    return DEFAULT_SCHEDULE_GENERATION_PREFERENCES.weights;
  }

  const candidate = value as Partial<SchedulePreferenceWeights>;

  return {
    classSpacing: sanitizeWeightValue(candidate.classSpacing),
    lighterDay: sanitizeWeightValue(candidate.lighterDay),
    sameTheoryLabGroup: sanitizeWeightValue(candidate.sameTheoryLabGroup),
    teacherRanking: sanitizeWeightValue(candidate.teacherRanking),
    timeRange: sanitizeWeightValue(candidate.timeRange),
  };
}

function sanitizeWeightValue(value: unknown): number {
  const numericValue =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : DEFAULT_SCHEDULE_GENERATION_PREFERENCES.weights.teacherRanking;

  return Math.min(Math.max(Math.round(numericValue), 0), 100);
}

function sanitizeTimeValue(value: unknown, fallback: string): string {
  return typeof value === "string" && /^([01]\d|2[0-3]):(00|30)$/u.test(value)
    ? value
    : fallback;
}

function compareTimeValues(left: string, right: string): number {
  return left.localeCompare(right, "en");
}
