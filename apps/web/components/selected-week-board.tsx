"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { buildTimetableGrid } from "@/lib/presenters/catalog";
import type { LocaleCode, ScheduleOffering } from "@/lib/types";

type SelectedWeekBoardProps = {
  locale: LocaleCode;
  offerings: ScheduleOffering[];
  subjectTitleLookup: ReadonlyMap<string, string>;
}

export function SelectedWeekBoard({
  locale,
  offerings,
  subjectTitleLookup,
}: SelectedWeekBoardProps): React.JSX.Element {
  const copy = getUiCopy(locale);
  const timetable = buildTimetableGrid(offerings, subjectTitleLookup);

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.plannerHome.weekBoard.eyebrow}</p>
        <CardTitle>{copy.plannerHome.weekBoard.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">{copy.plannerHome.weekBoard.description}</p>

        {timetable.rows.length > 0 ? (
          <div className="timetable-frame">
            <table className="timetable-grid-table text-left text-xs leading-5">
              <thead>
                <tr>
                  <th className="timetable-head-cell">
                    {copy.common.timeColumnLabel}
                  </th>
                  {timetable.days.map((weekdayCode) => (
                    <th key={weekdayCode} className="timetable-head-cell border-l border-border/80">
                      {
                        copy.common.weekdayLabels[
                          weekdayCode as keyof typeof copy.common.weekdayLabels
                        ]
                      }
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.rows.map((row) => (
                  <tr key={row.label}>
                    <th className="timetable-time-cell align-top">
                      {row.label}
                    </th>
                    {timetable.days.map((weekdayCode) => {
                      const cellItems = row.cells[weekdayCode];

                      return (
                        <td key={`${row.label}-${weekdayCode}`} className="timetable-cell">
                          {cellItems.length === 0 ? null : (
                            <div className="grid gap-2">
                              {cellItems.map((item) =>
                                item.startsAtSlot ? (
                                  <article
                                    key={`${weekdayCode}-${row.label}-${item.meeting.courseCode}-${item.meeting.groupCode}-${item.meeting.startTime}`}
                                    className="timetable-entry text-[11px] leading-5"
                                  >
                                    <p className="font-semibold text-accent">
                                      {item.meeting.courseCode}({item.meeting.groupCode})
                                    </p>
                                    <p className="mt-1 font-medium text-foreground">
                                      {item.meeting.displayTitle}
                                    </p>
                                    <p className="mt-1 text-muted">
                                      {item.meeting.roomCode ?? copy.plannerHome.weekBoard.roomPending}
                                      {item.meeting.campusName ? ` · ${item.meeting.campusName}` : ""}
                                    </p>
                                  </article>
                                ) : (
                                  <span
                                    key={`${weekdayCode}-${row.label}-${item.meeting.courseCode}-${item.meeting.groupCode}-continuation`}
                                    aria-hidden
                                    className="timetable-continue"
                                  />
                                ),
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="soft-panel text-sm leading-6 text-muted">
            {copy.plannerHome.weekBoard.empty}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
