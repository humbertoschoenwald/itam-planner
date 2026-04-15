"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/lib/storage-keys";

interface StudentCodeStoreState {
  code: string;
  clearCode: () => void;
  setCode: (code: string) => void;
}

const storage = createJSONStorage<StudentCodeStoreState>(() =>
  typeof window === "undefined"
    ? {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      }
    : window.localStorage,
);

export const useStudentCodeStore = create<StudentCodeStoreState>()(
  persist(
    (set) => ({
      code: "",
      clearCode: () => set({ code: "" }),
      setCode: (code) => set({ code }),
    }),
    {
      name: STORAGE_KEYS.studentCode,
      storage,
    },
  ),
);
