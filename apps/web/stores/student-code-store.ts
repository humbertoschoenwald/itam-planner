"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSafeJsonStorage } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";

interface StudentCodeStoreState {
  code: string;
  clearCode: () => void;
  setCode: (code: string) => void;
}

const storage = createSafeJsonStorage<StudentCodeStoreState>();

export const useStudentCodeStore = create<StudentCodeStoreState>()(
  persist(
    (set) => ({
      code: "",
      clearCode: () => set({ code: "" }),
      setCode: (code) => set({ code }),
    }),
    {
      name: STORAGE_KEYS.studentCode,
      merge: (persistedState, currentState) => ({
        ...currentState,
        code: sanitizeStudentCode((persistedState as Partial<StudentCodeStoreState> | undefined)?.code),
      }),
      storage,
    },
  ),
);

function sanitizeStudentCode(value: unknown) {
  return typeof value === "string" ? value : "";
}
