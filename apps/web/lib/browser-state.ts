import { clearSafeBrowserState } from "@/lib/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage-keys";

export function clearPlannerBrowserState(): void {
  clearSafeBrowserState(Object.values(STORAGE_KEYS));
}
