import type { Metadata } from "next";

import { CalendarPageShell } from "@/components/calendar-page-shell";
import { readCalendarBootstrap, readOnboardingBootstrap } from "@/lib/catalog-static";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(DEFAULT_LOCALE, "calendar");

export default async function CalendarPage() {
  const [calendarBootstrap, onboardingBootstrap] = await Promise.all([
    readCalendarBootstrap(),
    readOnboardingBootstrap(),
  ]);

  return (
    <CalendarPageShell
      paymentCalendar={calendarBootstrap.paymentCalendar}
      plans={onboardingBootstrap.plans}
      schoolCalendar={calendarBootstrap.schoolCalendar}
    />
  );
}
