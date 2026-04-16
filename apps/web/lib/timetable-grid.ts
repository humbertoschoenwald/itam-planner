import { getCanonicalSubjectTitle } from "@/lib/planner-subjects";
import type { ScheduleOffering } from "@/lib/types";

export const TIMETABLE_WEEKDAY_ORDER = [
  "LU",
  "MA",
  "MI",
  "JU",
  "VI",
  "SA",
  "DO",
] as const;

export interface TimetableGridMeeting {
  campusName: string | null;
  courseCode: string;
  displayTitle: string;
  endTime: string;
  groupCode: string;
  roomCode: string | null;
  startTime: string;
}

export interface TimetableGridCellItem {
  meeting: TimetableGridMeeting;
  startsAtSlot: boolean;
}

export interface TimetableGridRow {
  cells: Record<(typeof TIMETABLE_WEEKDAY_ORDER)[number], TimetableGridCellItem[]>;
  label: string;
  slotEnd: string;
  slotStart: string;
}

export interface TimetableGridModel {
  days: readonly (typeof TIMETABLE_WEEKDAY_ORDER)[number][];
  rows: TimetableGridRow[];
}

export function buildTimetableGrid(
  offerings: ScheduleOffering[],
  subjectTitleLookup: ReadonlyMap<string, string>,
): TimetableGridModel {
  const meetings = offerings.flatMap((offering) =>
    offering.meetings.map((meeting) => ({
      campusName: meeting.campus_name,
      courseCode: offering.course_code,
      displayTitle: getCanonicalSubjectTitle(
        offering.course_code,
        subjectTitleLookup,
        offering.display_title,
      ),
      endTime: meeting.end_time.slice(0, 5),
      groupCode: offering.group_code,
      roomCode: meeting.room_code ?? offering.room_code,
      startTime: meeting.start_time.slice(0, 5),
      weekdayCode: meeting.weekday_code,
    })),
  );

  if (meetings.length === 0) {
    return { days: TIMETABLE_WEEKDAY_ORDER, rows: [] };
  }

  const earliestMinutes = Math.min(...meetings.map((meeting) => toMinutes(meeting.startTime)));
  const latestMinutes = Math.max(...meetings.map((meeting) => toMinutes(meeting.endTime)));
  const rows: TimetableGridRow[] = [];

  for (let current = earliestMinutes; current < latestMinutes; current += 30) {
    const slotStart = toTimeString(current);
    const slotEnd = toTimeString(current + 30);
    const cells = TIMETABLE_WEEKDAY_ORDER.reduce<
      Record<(typeof TIMETABLE_WEEKDAY_ORDER)[number], TimetableGridCellItem[]>
    >(
      (collection, weekdayCode) => {
        collection[weekdayCode] = meetings
          .filter(
            (meeting) =>
              meeting.weekdayCode === weekdayCode &&
              toMinutes(meeting.startTime) <= current &&
              current < toMinutes(meeting.endTime),
          )
          .map((meeting) => ({
            meeting,
            startsAtSlot: toMinutes(meeting.startTime) === current,
          }));
        return collection;
      },
      {
        DO: [],
        JU: [],
        LU: [],
        MA: [],
        MI: [],
        SA: [],
        VI: [],
      },
    );

    rows.push({
      cells,
      label: `${slotStart}-${slotEnd}`,
      slotEnd,
      slotStart,
    });
  }

  return {
    days: TIMETABLE_WEEKDAY_ORDER,
    rows,
  };
}

function toMinutes(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10);
}

function toTimeString(value: number) {
  const hours = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (value % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}
