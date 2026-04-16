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

interface StudentProfileStoreState {
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
const VALID_ACADEMIC_LEVELS = ["undergraduate", "graduate"] as const satisfies readonly AcademicLevel[];

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
    academicLevel: VALID_ACADEMIC_LEVELS.includes(candidate.academicLevel as AcademicLevel)
      ? (candidate.academicLevel as AcademicLevel)
      : null,
    activePlanIds: Array.isArray(candidate.activePlanIds)
      ? [...new Set(candidate.activePlanIds.filter((planId): planId is string => typeof planId === "string"))]
      : [],
    entryTerm: typeof candidate.entryTerm === "string" ? candidate.entryTerm : "",
    locale: VALID_LOCALES.includes(candidate.locale as LocaleCode)
      ? (candidate.locale as LocaleCode)
      : DEFAULT_STUDENT_PROFILE.locale,
    selectedCareerIds: Array.isArray(candidate.selectedCareerIds)
      ? [
          ...new Set(
            candidate.selectedCareerIds.filter(
              (careerId): careerId is string => typeof careerId === "string",
            ),
          ),
        ]
      : [],
    selectedJointProgramIds: Array.isArray(candidate.selectedJointProgramIds)
      ? [
          ...new Set(
            candidate.selectedJointProgramIds.filter(
              (jointProgramId): jointProgramId is string =>
                typeof jointProgramId === "string",
            ),
          ),
        ]
      : [],
  };
}
