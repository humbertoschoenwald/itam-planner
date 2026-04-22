"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeJsonStorage } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { AcademicLevel, LocaleCode, StudentProfile } from "@/lib/types";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  academicLevel: null,
  entryTerm: "",
  activePlanIds: [],
  locale: "es-MX",
  selectedCareerIds: [],
  selectedJointProgramIds: [],
};

type StudentProfileStoreState = {
  profile: StudentProfile;
  setAcademicLevel: (academicLevel: AcademicLevel | null) => void;
  resetProfile: () => void;
  setActivePlanIds: (planIds: string[]) => void;
  setSelectedCareerIds: (careerIds: string[]) => void;
  setSelectedJointProgramIds: (jointProgramIds: string[]) => void;
  setEntryTerm: (entryTerm: string) => void;
  setLocale: (locale: LocaleCode) => void;
  toggleActivePlanId: (planId: string) => void;
}

const storage = createSafeJsonStorage<StudentProfileStoreState>();
const VALID_LOCALES: readonly LocaleCode[] = ["es-MX", "en"] as const;
const VALID_ACADEMIC_LEVELS = [
  "undergraduate",
  "jointPrograms",
  "graduate",
] as const satisfies readonly AcademicLevel[];

export const useStudentProfileStore = create<StudentProfileStoreState>()(
  persist(
    (set) => ({
      profile: DEFAULT_STUDENT_PROFILE,
      resetProfile: () => set({ profile: DEFAULT_STUDENT_PROFILE }),
      setAcademicLevel: (academicLevel) =>
        set((current) => ({
          profile: {
            ...current.profile,
            academicLevel,
          },
        })),
      setActivePlanIds: (planIds) =>
        set((current) => ({
          profile: {
            ...current.profile,
            activePlanIds: [...new Set(planIds)],
          },
        })),
      setSelectedCareerIds: (careerIds) =>
        set((current) => ({
          profile: {
            ...current.profile,
            selectedCareerIds: [...new Set(careerIds)],
          },
        })),
      setSelectedJointProgramIds: (jointProgramIds) =>
        set((current) => ({
          profile: {
            ...current.profile,
            selectedJointProgramIds: [...new Set(jointProgramIds)],
          },
        })),
      setEntryTerm: (entryTerm) =>
        set((current) => ({
          profile: {
            ...current.profile,
            entryTerm,
          },
        })),
      setLocale: (locale) =>
        set((current) => ({
          profile: {
            ...current.profile,
            locale,
          },
        })),
      toggleActivePlanId: (planId) =>
        set((current) => {
          const exists = current.profile.activePlanIds.includes(planId);
          return {
            profile: {
              ...current.profile,
              activePlanIds: exists
                ? current.profile.activePlanIds.filter((value) => value !== planId)
                : [...current.profile.activePlanIds, planId],
            },
          };
        }),
    }),
    {
      name: STORAGE_KEYS.studentProfile,
      merge: (persistedState, currentState) => ({
        ...currentState,
        profile: sanitizeStudentProfile(
          (persistedState as Partial<StudentProfileStoreState> | undefined)?.profile,
        ),
      }),
      storage,
    },
  ),
);

function sanitizeStudentProfile(value: unknown): StudentProfile {
  if (!value || typeof value !== "object") {
    return DEFAULT_STUDENT_PROFILE;
  }

  const candidate = value as Partial<StudentProfile>;

  return {
    academicLevel: sanitizeAcademicLevel(candidate.academicLevel),
    activePlanIds: sanitizeStringList(candidate.activePlanIds),
    entryTerm: typeof candidate.entryTerm === "string" ? candidate.entryTerm : "",
    locale: sanitizeLocale(candidate.locale),
    selectedCareerIds: sanitizeStringList(candidate.selectedCareerIds),
    selectedJointProgramIds: sanitizeStringList(candidate.selectedJointProgramIds),
  };
}

function sanitizeAcademicLevel(value: unknown): AcademicLevel | null {
  return VALID_ACADEMIC_LEVELS.includes(value as AcademicLevel) ? (value as AcademicLevel) : null;
}

function sanitizeLocale(value: unknown): LocaleCode {
  return VALID_LOCALES.includes(value as LocaleCode)
    ? (value as LocaleCode)
    : DEFAULT_STUDENT_PROFILE.locale;
}

function sanitizeStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string"))]
    : [];
}
