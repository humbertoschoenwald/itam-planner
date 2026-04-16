"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWeeklyAgenda } from "@/lib/catalog-insights";
import { getUiCopy } from "@/lib/copy";
import { getMexicoCityDateContext } from "@/lib/time";
import type { LocaleCode, ScheduleOffering } from "@/lib/types";

interface TodayClassesCardProps {
  locale: LocaleCode;
  offerings: ScheduleOffering[];
}

export function TodayClassesCard({ locale, offerings }: TodayClassesCardProps) {
  const copy = getUiCopy(locale);
  const today = getMexicoCityDateContext();
  const day = buildWeeklyAgenda(offerings).find((item) => item.weekdayCode === today.weekdayCode);

  return (
    <Card className="section-shell">
      <CardHeader>
        <p className="eyebrow">{copy.plannerHome.todayBoard.eyebrow}</p>
        <CardTitle>{copy.plannerHome.todayBoard.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted">{copy.plannerHome.todayBoard.description}</p>
        <div className="soft-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {copy.common.weekdayLabels[
              today.weekdayCode as keyof typeof copy.common.weekdayLabels
            ]}{" "}
            · {today.isoDate}
          </p>
        </div>

        {day && day.items.length > 0 ? (
          <div className="grid gap-3">
            {day.items.map((item) => (
              <article
                key={`${item.courseCode}-${item.groupCode}-${item.startTime}-${item.weekdayCode}`}
                className="meeting-card"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {item.startTime.slice(0, 5)}-{item.endTime.slice(0, 5)}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {item.courseCode} · {item.groupCode}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">{item.displayTitle}</p>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {item.roomCode ?? copy.plannerHome.todayBoard.roomPending}
                  {item.campusName ? ` · ${item.campusName}` : ""}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="soft-panel text-sm leading-6 text-muted">
            {copy.plannerHome.todayBoard.empty}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
