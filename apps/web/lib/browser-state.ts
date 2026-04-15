import { STORAGE_KEYS } from "@/lib/storage-keys";

export function clearPlannerBrowserState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    for (const key of Object.values(STORAGE_KEYS)) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore browser storage failures while attempting recovery.
  }
}
