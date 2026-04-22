import { describe, expect, it } from "vitest";

import {
  buildCalendarMonthView,
  getCalendarPageDisplayLimits,
} from "@/lib/presenters/calendar-page";
import type { SchoolCalendarDocument } from "@/lib/types";

const schoolEvents: SchoolCalendarDocument["events"] = [
  {
    active_from: "2026-01-01",
    active_to: "2026-12-31",
    event_date: "2026-04-21",
    label: "Asueto",
    notes: null,
    symbol: "A",
  },
  {
    active_from: "2026-01-01",
    active_to: "2026-12-31",
    event_date: "2026-04-21",
    label: "Pago",
    notes: null,
    symbol: "P",
  },
];

describe("calendar-page presenter", () => {
  it("returns tighter display limits for phone layouts", () => {
    expect(getCalendarPageDisplayLimits(true)).toEqual({
      dayEventBadges: 1,
      paymentEvents: 3,
      schoolEvents: 4,
    });
    expect(getCalendarPageDisplayLimits(false)).toEqual({
      dayEventBadges: 2,
      paymentEvents: 6,
      schoolEvents: 8,
    });
  });

  it("builds a month view with grouped daily events", () => {
    const view = buildCalendarMonthView("2026-04-21", schoolEvents, "es-MX", "2026-04-21");
    const matchingDay = view.days.find((day) => day.iso === "2026-04-21");

    expect(matchingDay?.events).toHaveLength(2);
    expect(view.eventCount).toBeGreaterThan(0);
    expect(view.weekdayLabels).toHaveLength(7);
  });
});
