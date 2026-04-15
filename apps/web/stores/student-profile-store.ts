"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { LocaleCode, StudentProfile } from "@/lib/types";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  entryTerm: "",
  activePlanIds: [],
  locale: "es-MX",
};

interface StudentProfileStoreState {
  profile: StudentProfile;
  resetProfile: () => void;
  setEntryTerm: (entryTerm: string) => void;
  setLocale: (locale: LocaleCode) => void;
  toggleActivePlanId: (planId: string) => void;
}

const storage = createJSONStorage<StudentProfileStoreState>(() =>
  typeof window === "undefined"
    ? {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      }
    : window.localStorage,
);

export const useStudentProfileStore = create<StudentProfileStoreState>()(
  persist(
    (set) => ({
      profile: DEFAULT_STUDENT_PROFILE,
      resetProfile: () => set({ profile: DEFAULT_STUDENT_PROFILE }),
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
      storage,
    },
  ),
);
