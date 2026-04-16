"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUiCopy } from "@/lib/copy";
import { buildTimetableGrid } from "@/lib/timetable-grid";
import type { LocaleCode, ScheduleOffering } from "@/lib/types";

interface SelectedWeekBoardProps {
  locale: LocaleCode;
  offerings: ScheduleOffering[];
  subjectTitleLookup: ReadonlyMap<string, string>;
}

export function SelectedWeekBoard({
  locale,
  offerings,
  subjectTitleLookup,
}: SelectedWeekBoardProps) {
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
          <div className="overflow-x-auto rounded-[1.35rem] border border-border bg-surface-elevated">
            <table className="w-full min-w-[880px] border-collapse text-left text-xs leading-5">
              <thead>
                <tr>
                  <th className="border-b border-border bg-background px-3 py-3 font-semibold text-foreground">
                    {copy.common.timeColumnLabel}
                  </th>
                  {timetable.days.map((weekdayCode) => (
                    <th
                      key={weekdayCode}
                      className="border-b border-l border-border bg-background px-3 py-3 font-semibold text-foreground"
                    >
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
                    <th className="border-t border-border bg-background px-3 py-2 align-top font-medium text-muted">
                      {row.label}
                    </th>
                    {timetable.days.map((weekdayCode) => {
                      const cellItems = row.cells[weekdayCode];

                      return (
                        <td
                          key={`${row.label}-${weekdayCode}`}
                          className="border-l border-t border-border px-2 py-2 align-top"
                        >
                          {cellItems.length === 0 ? null : (
                            <div className="grid gap-2">
                              {cellItems.map((item) =>
                                item.startsAtSlot ? (
                                  <article
                                    key={`${weekdayCode}-${row.label}-${item.meeting.courseCode}-${item.meeting.groupCode}-${item.meeting.startTime}`}
                                    className="rounded-[1rem] border border-accent/20 bg-accent-soft px-2 py-2 text-[11px] leading-5"
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
                                    className="block h-6 rounded-[0.85rem] bg-accent/15"
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
