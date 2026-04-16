import type { Metadata } from "next";

import { CalendarPageShell } from "@/components/calendar-page-shell";
import { readCalendarBootstrap, readOnboardingBootstrap } from "@/lib/catalog-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/calendar",
  },
  description:
    "Calendario público de ITAM Planner con eventos académicos generales y contexto del día cuando el planner local ya existe.",
  openGraph: {
    description:
      "Calendario público de ITAM Planner con eventos académicos generales y contexto del día cuando el planner local ya existe.",
    title: "Calendario",
    type: "website",
    url: "/calendar",
  },
  title: "Calendario",
  twitter: {
    description:
      "Calendario público de ITAM Planner con eventos académicos generales y contexto del día cuando el planner local ya existe.",
    title: "Calendario",
  },
};

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
