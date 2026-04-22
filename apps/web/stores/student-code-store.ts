"use client";

import { create } from "zustand";

type StudentCodeStoreState = {
  code: string;
  clearCode: () => void;
  setCode: (code: string) => void;
}

export const useStudentCodeStore = create<StudentCodeStoreState>()((set) => ({
  code: "",
  clearCode: () => set({ code: "" }),
  setCode: (code) => set({ code }),
}));
