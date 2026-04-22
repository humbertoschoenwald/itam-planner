import type { ScheduleOffering, SourcesMetadata } from "@/lib/types";

const WEEKDAY_ORDER = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"] as const;

export type WeeklyAgendaItem = {
  weekdayCode: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  groupCode: string;
  displayTitle: string;
  roomCode: string | null;
  campusName: string | null;
}

export type WeeklyAgendaDay = {
  weekdayCode: string;
  items: WeeklyAgendaItem[];
}

export type CatalogSnapshotSummary = {
  latestObservedAt: string | null;
  latestPromotionAt: string | null;
  latestRunStatus: SourcesMetadata["scrape_runs"][number]["status"] | null;
  promotedReleaseId: string | null;
  trackedSourceCount: number;
  totalSnapshotCount: number;
}

export function buildWeeklyAgenda(offerings: ScheduleOffering[]): { weekdayCode: "LU" | "MA" | "MI" | "JU" | "VI" | "SA" | "DO"; items: WeeklyAgendaItem[]; }[] {
  const grouped = new Map<string, WeeklyAgendaItem[]>();

  for (const offering of offerings) {
    for (const meeting of offering.meetings) {
      const items = grouped.get(meeting.weekday_code) ?? [];
      items.push({
        weekdayCode: meeting.weekday_code,
        startTime: meeting.start_time,
        endTime: meeting.end_time,
        courseCode: offering.course_code,
        groupCode: offering.group_code,
        displayTitle: offering.display_title,
        roomCode: meeting.room_code ?? offering.room_code,
        campusName: meeting.campus_name ?? offering.campus_name,
      });
      grouped.set(meeting.weekday_code, items);
    }
  }

  return WEEKDAY_ORDER.filter((weekdayCode) => grouped.has(weekdayCode)).map((weekdayCode) => ({
    weekdayCode,
    items: (grouped.get(weekdayCode) ?? []).sort((left, right) =>
      left.startTime.localeCompare(right.startTime),
    ),
  })) satisfies WeeklyAgendaDay[];
}

export function summarizeCatalogSnapshot(metadata: SourcesMetadata | null): CatalogSnapshotSummary {
  if (!metadata) {
    return {
      latestObservedAt: null,
      latestPromotionAt: null,
      latestRunStatus: null,
      promotedReleaseId: null,
      trackedSourceCount: 0,
      totalSnapshotCount: 0,
    };
  }

  return {
    latestObservedAt: getLatestObservedAt(metadata),
    latestPromotionAt: getLatestPromotion(metadata)?.promoted_at ?? null,
    latestRunStatus: getLatestRun(metadata)?.status ?? null,
    promotedReleaseId: getLatestPromotion(metadata)?.release_id ?? null,
    trackedSourceCount: new Set(metadata.source_snapshots.map((snapshot) => snapshot.source_id)).size,
    totalSnapshotCount: metadata.source_snapshots.length,
  };
}

function getLatestObservedAt(metadata: SourcesMetadata): string | null {
  return metadata.source_snapshots
    .map((snapshot) => snapshot.observed_at)
    .sort((left, right) => right.localeCompare(left))[0] ?? null;
}

function getLatestPromotion(
  metadata: SourcesMetadata,
): SourcesMetadata["promoted_releases"][number] | null {
  return (
    [...metadata.promoted_releases].sort((left, right) =>
      right.promoted_at.localeCompare(left.promoted_at),
    )[0] ?? null
  );
}

function getLatestRun(metadata: SourcesMetadata): SourcesMetadata["scrape_runs"][number] | null {
  return (
    [...metadata.scrape_runs].sort((left, right) =>
      getScrapeRunSortValue(right).localeCompare(getScrapeRunSortValue(left)),
    )[0] ?? null
  );
}

function getScrapeRunSortValue(
  scrapeRun: SourcesMetadata["scrape_runs"][number],
): string {
  return scrapeRun.completed_at ?? scrapeRun.started_at;
}
