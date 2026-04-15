import type {
  BulletinSummary,
  SchedulePeriodDetail,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";

const STATIC_CATALOG_BASE_URL = "/catalog/latest";
const EXTERNAL_API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_ITAM_PLANNER_API_BASE_URL,
);

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(resolveCatalogUrl(path), {
    cache: "force-cache",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function resolveCatalogUrl(path: string, apiBaseUrl: string | null = EXTERNAL_API_BASE_URL) {
  if (apiBaseUrl) {
    return `${apiBaseUrl}${path}`;
  }

  if (path === "/boletines") {
    return `${STATIC_CATALOG_BASE_URL}/boletines/index.json`;
  }

  if (path.startsWith("/boletines/")) {
    const bulletinId = path.slice("/boletines/".length);
    return `${STATIC_CATALOG_BASE_URL}/boletines/documents/${safeDocumentName(bulletinId)}.json`;
  }

  if (path === "/schedules/periods") {
    return `${STATIC_CATALOG_BASE_URL}/schedules/periods.json`;
  }

  if (path.startsWith("/schedules/periods/")) {
    const periodId = path.slice("/schedules/periods/".length);
    return `${STATIC_CATALOG_BASE_URL}/schedules/periods/${periodId}.json`;
  }

  if (path === "/sources") {
    return `${STATIC_CATALOG_BASE_URL}/sources.json`;
  }

  throw new Error(`Unsupported catalog path: ${path}`);
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

export function fetchSourcesMetadata() {
  return readJson<SourcesMetadata>("/sources");
}

function normalizeApiBaseUrl(value: string | undefined) {
  return value?.trim().replace(/\/$/, "") || null;
}

function safeDocumentName(value: string) {
  return value.replaceAll(":", "__");
}
