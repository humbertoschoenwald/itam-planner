import { describe, expect, it } from "vitest";

import { buildWeeklyAgenda, summarizeCatalogSnapshot } from "@/lib/catalog-insights";
import type { ScheduleOffering, SourcesMetadata } from "@/lib/types";

describe("catalog insights", () => {
  it("groups selected meetings by weekday and sorts them by start time", () => {
    const offerings: ScheduleOffering[] = [
      {
        offering_id: "offering-1",
        period_id: "2938",
        course_code: "ACT-11300",
        group_code: "001",
        crn: "1521",
        section_type: "T",
        display_title: "Calculo Actuarial I",
        instructor_name: "Profesor Uno",
        credits: 6,
        room_code: "RH105",
        campus_name: "RIO HONDO",
        raw_comments: null,
        meetings: [
          {
            weekday_code: "JU",
            start_time: "17:30:00",
            end_time: "19:00:00",
            room_code: "RH105",
            campus_name: "RIO HONDO",
          },
          {
            weekday_code: "MA",
            start_time: "17:30:00",
            end_time: "19:00:00",
            room_code: "RH105",
            campus_name: "RIO HONDO",
          },
        ],
      },
      {
        offering_id: "offering-2",
        period_id: "2938",
        course_code: "MAT-10100",
        group_code: "010",
        crn: "9999",
        section_type: "T",
        display_title: "Algebra Lineal",
        instructor_name: "Profesora Dos",
        credits: 6,
        room_code: "RH205",
        campus_name: "RIO HONDO",
        raw_comments: null,
        meetings: [
          {
            weekday_code: "MA",
            start_time: "08:00:00",
            end_time: "09:30:00",
            room_code: "RH205",
            campus_name: "RIO HONDO",
          },
        ],
      },
    ];

    const result = buildWeeklyAgenda(offerings);

    expect(result.map((day) => day.weekdayCode)).toEqual(["MA", "JU"]);
    expect(result[0]?.items.map((item) => item.courseCode)).toEqual([
      "MAT-10100",
      "ACT-11300",
    ]);
  });

  it("summarizes the latest published snapshot metadata", () => {
    const metadata: SourcesMetadata = {
      scrape_runs: [
        {
          run_id: "older",
          started_at: "2026-04-14T10:00:00+00:00",
          completed_at: "2026-04-14T10:10:00+00:00",
          status: "succeeded",
          notes: null,
        },
        {
          run_id: "latest",
          started_at: "2026-04-15T10:00:00+00:00",
          completed_at: "2026-04-15T10:12:00+00:00",
          status: "no_changes",
          notes: null,
        },
      ],
      promoted_releases: [
        {
          release_id: "release-1",
          run_id: "older",
          promoted_at: "2026-04-14T10:11:00+00:00",
          notes: null,
        },
        {
          release_id: "release-2",
          run_id: "latest",
          promoted_at: "2026-04-15T10:13:00+00:00",
          notes: null,
        },
      ],
      source_snapshots: [
        {
          snapshot_id: "source-a",
          run_id: "latest",
          source_id: "schedule-menu",
          upstream_url: "https://example.com/a",
          observed_at: "2026-04-15T10:11:00+00:00",
          content_hash: "a",
          parse_status: "parsed",
          media_type: "text/html",
          relative_path: null,
          size_bytes: 100,
        },
        {
          snapshot_id: "source-b",
          run_id: "latest",
          source_id: "schedule-menu",
          upstream_url: "https://example.com/b",
          observed_at: "2026-04-15T10:12:00+00:00",
          content_hash: "b",
          parse_status: "parsed",
          media_type: "text/html",
          relative_path: null,
          size_bytes: 120,
        },
        {
          snapshot_id: "source-c",
          run_id: "latest",
          source_id: "calendar-links",
          upstream_url: "https://example.com/c",
          observed_at: "2026-04-15T10:05:00+00:00",
          content_hash: "c",
          parse_status: "parsed",
          media_type: "text/html",
          relative_path: null,
          size_bytes: 90,
        },
      ],
    };

    expect(summarizeCatalogSnapshot(metadata)).toEqual({
      latestObservedAt: "2026-04-15T10:12:00+00:00",
      latestPromotionAt: "2026-04-15T10:13:00+00:00",
      latestRunStatus: "no_changes",
      promotedReleaseId: "release-2",
      trackedSourceCount: 2,
      totalSnapshotCount: 3,
    });
  });
});
