import type { ScheduleOffering, SourcesMetadata } from "@/lib/types";

const WEEKDAY_ORDER = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"] as const;

export interface WeeklyAgendaItem {
  weekdayCode: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  groupCode: string;
  displayTitle: string;
  roomCode: string | null;
  campusName: string | null;
}

export interface WeeklyAgendaDay {
  weekdayCode: string;
  items: WeeklyAgendaItem[];
}

export interface CatalogSnapshotSummary {
  latestObservedAt: string | null;
  latestPromotionAt: string | null;
  latestRunStatus: SourcesMetadata["scrape_runs"][number]["status"] | null;
  promotedReleaseId: string | null;
  trackedSourceCount: number;
  totalSnapshotCount: number;
}

export function buildWeeklyAgenda(offerings: ScheduleOffering[]) {
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

  const latestObservedAt = metadata.source_snapshots
    .map((snapshot) => snapshot.observed_at)
    .sort((left, right) => right.localeCompare(left))[0] ?? null;
  const latestPromotion = [...metadata.promoted_releases].sort((left, right) =>
    right.promoted_at.localeCompare(left.promoted_at),
  )[0];
  const latestRun = [...metadata.scrape_runs].sort((left, right) =>
    (right.completed_at ?? right.started_at).localeCompare(left.completed_at ?? left.started_at),
  )[0];

  return {
    latestObservedAt,
    latestPromotionAt: latestPromotion?.promoted_at ?? null,
    latestRunStatus: latestRun?.status ?? null,
    promotedReleaseId: latestPromotion?.release_id ?? null,
    trackedSourceCount: new Set(metadata.source_snapshots.map((snapshot) => snapshot.source_id)).size,
    totalSnapshotCount: metadata.source_snapshots.length,
  };
}
