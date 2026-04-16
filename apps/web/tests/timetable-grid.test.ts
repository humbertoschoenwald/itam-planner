import { describe, expect, it } from "vitest";

import { buildTimetableGrid } from "@/lib/timetable-grid";
import type { ScheduleOffering } from "@/lib/types";

describe("buildTimetableGrid", () => {
  it("builds a monday-through-sunday grid bounded by the selected class range", () => {
    const offerings: ScheduleOffering[] = [
      {
        campus_name: "RIO HONDO",
        course_code: "COM-11101",
        credits: 6,
        crn: "1001",
        display_title: "RAZONAMIENTO ALGORITMICO",
        group_code: "001",
        instructor_name: "TEST",
        meetings: [
          {
            campus_name: "RIO HONDO",
            end_time: "10:30:00",
            room_code: "RH101",
            start_time: "09:00:00",
            weekday_code: "MA",
          },
        ],
        offering_id: "2938:COM-11101:001",
        period_id: "2938",
        raw_comments: null,
        room_code: "RH101",
        section_type: "T",
      },
      {
        campus_name: "RIO HONDO",
        course_code: "MAT-14300",
        credits: 6,
        crn: "1002",
        display_title: "GEOMETRIA VECTORIAL",
        group_code: "002",
        instructor_name: "TEST",
        meetings: [
          {
            campus_name: "RIO HONDO",
            end_time: "14:30:00",
            room_code: "RH104",
            start_time: "13:00:00",
            weekday_code: "JU",
          },
        ],
        offering_id: "2938:MAT-14300:002",
        period_id: "2938",
        raw_comments: null,
        room_code: "RH104",
        section_type: "T",
      },
    ];

    const timetable = buildTimetableGrid(
      offerings,
      new Map([
        ["COM-11101", "Comunicación Escrita"],
        ["MAT-14300", "Geometría Vectorial"],
      ]),
    );

    expect(timetable.days).toEqual(["LU", "MA", "MI", "JU", "VI", "SA", "DO"]);
    expect(timetable.rows[0]?.label).toBe("09:00-09:30");
    expect(timetable.rows.at(-1)?.label).toBe("14:00-14:30");
    expect(timetable.rows[0]?.cells.MA[0]?.meeting.displayTitle).toBe("Comunicación Escrita");
    expect(
      timetable.rows.find((row) => row.label === "13:00-13:30")?.cells.JU[0]?.startsAtSlot,
    ).toBe(true);
  });
});
