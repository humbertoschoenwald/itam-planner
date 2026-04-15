"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWeeklyAgenda } from "@/lib/catalog-insights";
import { getUiCopy } from "@/lib/copy";
import type { LocaleCode, ScheduleOffering } from "@/lib/types";

interface SelectedWeekBoardProps {
  locale: LocaleCode;
  offerings: ScheduleOffering[];
}

const WEEKDAY_LABELS = {
  en: {
    DO: "Sun",
    JU: "Thu",
    LU: "Mon",
    MA: "Tue",
    MI: "Wed",
    SA: "Sat",
    VI: "Fri",
  },
  "es-MX": {
    DO: "Dom",
    JU: "Jue",
    LU: "Lun",
    MA: "Mar",
    MI: "Mié",
    SA: "Sáb",
    VI: "Vie",
  },
} as const;

export function SelectedWeekBoard({ locale, offerings }: SelectedWeekBoardProps) {
  const copy = getUiCopy(locale);
  const week = buildWeeklyAgenda(offerings);

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.plannerHome.weekBoard.eyebrow}</p>
        <CardTitle>{copy.plannerHome.weekBoard.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">{copy.plannerHome.weekBoard.description}</p>

        {week.length > 0 ? (
          <div className="week-grid">
            {week.map((day) => (
              <section key={day.weekdayCode} className="day-column">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {WEEKDAY_LABELS[locale][day.weekdayCode as keyof (typeof WEEKDAY_LABELS)[typeof locale]]}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {day.items.length}
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  {day.items.map((item) => (
                    <article key={`${item.courseCode}-${item.groupCode}-${item.startTime}-${item.weekdayCode}`} className="meeting-card">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        {item.startTime.slice(0, 5)}-{item.endTime.slice(0, 5)}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {item.courseCode} · {item.groupCode}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted">{item.displayTitle}</p>
                      <p className="mt-2 text-xs leading-5 text-muted">
                        {item.roomCode ?? copy.plannerHome.weekBoard.roomPending}
                        {item.campusName ? ` · ${item.campusName}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
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
