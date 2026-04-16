import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SelectedWeekBoard } from "@/components/selected-week-board";
import type { ScheduleOffering } from "@/lib/types";

const OFFERINGS: ScheduleOffering[] = [
  {
    offering_id: "2938:COM-16306:001:1521",
    period_id: "2938",
    course_code: "COM-16306",
    group_code: "001",
    crn: "1521",
    section_type: "T",
    display_title: "RAZONAMIENTO ALGORITMICO",
    instructor_name: "Instructor Demo",
    credits: 6,
    room_code: "Room 201",
    campus_name: "Main campus",
    raw_comments: null,
    meetings: [
      {
        weekday_code: "MA",
        start_time: "07:00:00",
        end_time: "08:30:00",
        room_code: "Room 201",
        campus_name: "Main campus",
      },
    ],
  },
];

describe("SelectedWeekBoard", () => {
  it("renders the time-column header from the Spanish locale dictionary", () => {
    render(
      <SelectedWeekBoard
        locale="es-MX"
        offerings={OFFERINGS}
        subjectTitleLookup={new Map()}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Hora" })).toBeInTheDocument();
  });

  it("renders the time-column header from the English locale dictionary", () => {
    render(
      <SelectedWeekBoard
        locale="en"
        offerings={OFFERINGS}
        subjectTitleLookup={new Map()}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Time" })).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Hora" })).not.toBeInTheDocument();
  });
});
