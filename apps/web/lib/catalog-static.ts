import fs from "node:fs/promises";
import path from "node:path";

import {
  OFFICIAL_CAREERS,
  OFFICIAL_DOUBLE_DEGREES,
  OFFICIAL_GRADUATE_PROGRAMS,
  OFFICIAL_JOINT_PROGRAMS,
} from "@/lib/official-academics";
import { OFFICIAL_NEWS_ITEMS } from "@/lib/site-content";
import type {
  AcademicCareerReference,
  BulletinDocument,
  BulletinSummary,
  DoubleDegreeReference,
  GraduateProgramReference,
  JointProgramReference,
  PaymentCalendarDocument,
  SchoolCalendarDocument,
  SchedulePeriodSummary,
  SiteNewsItem,
  SourcesMetadata,
} from "@/lib/types";

export interface PlannerShellBootstrap {
  bulletinDocuments: BulletinDocument[];
  careers: AcademicCareerReference[];
  doubleDegrees: DoubleDegreeReference[];
  graduatePrograms: GraduateProgramReference[];
  jointPrograms: JointProgramReference[];
  newsItems: SiteNewsItem[];
  plans: BulletinSummary[];
  periods: SchedulePeriodSummary[];
  sourcesMetadata: SourcesMetadata | null;
}

export interface CalendarBootstrap {
  paymentCalendar: PaymentCalendarDocument;
  schoolCalendar: SchoolCalendarDocument;
}

export async function readPlannerShellBootstrap(): Promise<PlannerShellBootstrap> {
  const [plans, periods, sourcesMetadata, bulletinDocuments] = await Promise.all([
    readPublishedCatalogJson<BulletinSummary[]>("boletines", "index.json"),
    readPublishedCatalogJson<SchedulePeriodSummary[]>("schedules", "periods.json"),
    readPublishedCatalogJson<SourcesMetadata>("sources.json"),
    readPublishedBulletinDocuments(),
  ]);

  return {
    bulletinDocuments,
    careers: [...OFFICIAL_CAREERS],
    doubleDegrees: [...OFFICIAL_DOUBLE_DEGREES],
    graduatePrograms: [...OFFICIAL_GRADUATE_PROGRAMS],
    jointPrograms: [...OFFICIAL_JOINT_PROGRAMS],
    newsItems: [...OFFICIAL_NEWS_ITEMS],
    plans,
    periods,
    sourcesMetadata,
  };
}

export async function readOnboardingBootstrap() {
  const [plans, periods, bulletinDocuments] = await Promise.all([
    readPublishedCatalogJson<BulletinSummary[]>("boletines", "index.json"),
    readPublishedCatalogJson<SchedulePeriodSummary[]>("schedules", "periods.json"),
    readPublishedBulletinDocuments(),
  ]);

  return {
    bulletinDocuments,
    careers: [...OFFICIAL_CAREERS],
    doubleDegrees: [...OFFICIAL_DOUBLE_DEGREES],
    graduatePrograms: [...OFFICIAL_GRADUATE_PROGRAMS],
    jointPrograms: [...OFFICIAL_JOINT_PROGRAMS],
    periods,
    plans,
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

export async function readPlannerSettingsBootstrap() {
  const [periods, bulletinDocuments] = await Promise.all([
    readPublishedCatalogJson<SchedulePeriodSummary[]>("schedules", "periods.json"),
    readPublishedBulletinDocuments(),
  ]);

  return {
    bulletinDocuments,
    careers: [...OFFICIAL_CAREERS],
    doubleDegrees: [...OFFICIAL_DOUBLE_DEGREES],
    graduatePrograms: [...OFFICIAL_GRADUATE_PROGRAMS],
    jointPrograms: [...OFFICIAL_JOINT_PROGRAMS],
    periods,
  };
}

export async function readSearchBootstrap() {
  const [plannerBootstrap, calendarBootstrap] = await Promise.all([
    readPlannerShellBootstrap(),
    readCalendarBootstrap(),
  ]);

  return {
    careers: plannerBootstrap.careers,
    doubleDegrees: plannerBootstrap.doubleDegrees,
    graduatePrograms: plannerBootstrap.graduatePrograms,
    jointPrograms: plannerBootstrap.jointPrograms,
    newsItems: plannerBootstrap.newsItems,
    paymentCalendar: calendarBootstrap.paymentCalendar,
    plans: plannerBootstrap.plans,
    periods: plannerBootstrap.periods,
    schoolCalendar: calendarBootstrap.schoolCalendar,
  };
}

async function readPublishedCatalogJson<T>(...segments: string[]): Promise<T> {
  const filePath = path.join(await resolveCatalogRootPath(), ...segments);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function readPublishedBulletinDocuments() {
  const directoryPath = path.join(await resolveCatalogRootPath(), "boletines", "documents");
  const entries = await fs.readdir(directoryPath);
  const fileNames = entries.filter((entry) => entry.endsWith(".json")).sort();
  const documents = await Promise.all(
    fileNames.map(async (fileName) => {
      const raw = await fs.readFile(path.join(directoryPath, fileName), "utf8");
      return JSON.parse(raw) as BulletinDocument;
    }),
  );

  return documents;
}

async function resolveCatalogRootPath() {
  const publishedCatalogRootPath = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    "catalog",
    "latest",
  );

  await fs.access(publishedCatalogRootPath);
  return publishedCatalogRootPath;
}
