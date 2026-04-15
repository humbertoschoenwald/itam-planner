import type { BulletinSummary, SchedulePeriodDetail, SchedulePeriodSummary } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function fetchBulletinIndex() {
  return readJson<BulletinSummary[]>("/boletines");
}

export function fetchSchedulePeriods() {
  return readJson<SchedulePeriodSummary[]>("/schedules/periods");
}

export function fetchSchedulePeriodDetail(periodId: string) {
  return readJson<SchedulePeriodDetail>(`/schedules/periods/${periodId}`);
}
