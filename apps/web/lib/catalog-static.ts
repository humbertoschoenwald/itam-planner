import fs from "node:fs/promises";
import path from "node:path";

import type {
  BulletinSummary,
  SchedulePeriodDetail,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";

export interface PlannerHomeBootstrap {
  periodDetailsById: Record<string, SchedulePeriodDetail>;
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export async function readPlannerHomeBootstrap(): Promise<PlannerHomeBootstrap> {
  const [plans, periods, sourcesMetadata] = await Promise.all([
    readPublishedCatalogJson<BulletinSummary[]>("boletines", "index.json"),
    readPublishedCatalogJson<SchedulePeriodSummary[]>("schedules", "periods.json"),
    readPublishedCatalogJson<SourcesMetadata>("sources.json"),
  ]);

  const periodDetailsById = Object.fromEntries(
    await Promise.all(
      periods.map(async (period) => [
        period.period_id,
        await readPublishedCatalogJson<SchedulePeriodDetail>(
          "schedules",
          "periods",
          `${period.period_id}.json`,
        ),
      ]),
    ),
  );

  return {
    periodDetailsById,
    plans,
    periods,
    sourcesMetadata,
  };
}

async function readPublishedCatalogJson<T>(...segments: string[]): Promise<T> {
  const filePath = path.join(process.cwd(), "public", "catalog", "latest", ...segments);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}
