import fs from "node:fs/promises";
import path from "node:path";

import type {
  BulletinSummary,
  PaymentCalendarDocument,
  SchoolCalendarDocument,
  SchedulePeriodSummary,
  SourcesMetadata,
} from "@/lib/types";

export interface PlannerShellBootstrap {
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export interface CalendarBootstrap {
  paymentCalendar: PaymentCalendarDocument;
  schoolCalendar: SchoolCalendarDocument;
}

export async function readPlannerShellBootstrap(): Promise<PlannerShellBootstrap> {
  const [plans, periods, sourcesMetadata] = await Promise.all([
    readPublishedCatalogJson<BulletinSummary[]>("boletines", "index.json"),
    readPublishedCatalogJson<SchedulePeriodSummary[]>("schedules", "periods.json"),
    readPublishedCatalogJson<SourcesMetadata>("sources.json"),
  ]);

  return {
    plans,
    periods,
    sourcesMetadata,
  };
}

export async function readOnboardingBootstrap() {
  return {
    plans: await readPublishedCatalogJson<BulletinSummary[]>("boletines", "index.json"),
  };
}

export async function readCalendarBootstrap(): Promise<CalendarBootstrap> {
  const [schoolCalendar, paymentCalendar] = await Promise.all([
    readPublishedCatalogJson<SchoolCalendarDocument>("calendars", "school.json"),
    readPublishedCatalogJson<PaymentCalendarDocument>("calendars", "payment.json"),
  ]);

  return {
    paymentCalendar,
    schoolCalendar,
  };
}

async function readPublishedCatalogJson<T>(...segments: string[]): Promise<T> {
  const filePath = path.join(process.cwd(), "public", "catalog", "latest", ...segments);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}
