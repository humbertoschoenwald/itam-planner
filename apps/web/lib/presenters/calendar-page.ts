import type {
  PaymentCalendarDocument,
  PaymentCalendarEvent,
  SchoolCalendarDocument,
  SchoolCalendarEvent,
} from "@/lib/types";

const CALENDAR_GRID_DAYS = 35;
const MONDAY_WEEK_OFFSET = 6;
const MONTH_INDEX_OFFSET = 1;
const MONTH_SEGMENT_INDEX = 1;
const YEAR_SEGMENT_INDEX = 0;
const FIRST_DAY_OF_MONTH = 1;
const ISO_MONTH_SEGMENT_COUNT = 2;
const ZERO_VALUE = 0;
const THREE_VALUE = 3;
const WEEKDAY_COUNT = 7;
const ISO_DATE_SLICE_END_INDEX = 10;
const EVENT_PRESENT_THRESHOLD = 0;
const DATE_DISTANCE_TODAY_THRESHOLD = 0;
const KEY_SEPARATOR = ":";
const EMPTY_STRING = "";
const SPACE_STRING = " ";
const ISO_DATE_SEPARATOR = "-";
const ISO_DATE_LOCALE = "en-CA";
const ENGLISH_COMPARE_LOCALE = "en";
const SPANISH_NORMALIZATION_LOCALE = "es-MX";
const DATE_FORMAT_DAY_DIGITS = "2-digit";
const DATE_FORMAT_MONTH_LONG = "long";
const DATE_FORMAT_MONTH_DIGITS = "2-digit";
const DATE_FORMAT_WEEKDAY_SHORT = "short";
const DATE_FORMAT_YEAR_NUMERIC = "numeric";
const UTC_TIME_ZONE = "UTC";
const MEXICO_CITY_TIME_ZONE = "America/Mexico_City";
const CALENDAR_REFERENCE_YEAR = 2026;
const CALENDAR_REFERENCE_MONTH_INDEX = 0;
const CALENDAR_REFERENCE_FIRST_MONDAY_DAY = 5;
const MAX_ISO_DATE_FALLBACK = "9999-12-31";
const MISSING_CALENDAR_EVENT_CODE = "missing-calendar-code";
const MISSING_CALENDAR_EVENT_SYMBOL = "missing-calendar-symbol";
const MISSING_CALENDAR_EVENT_LABEL = "missing-calendar-label";
const MISSING_CALENDAR_EVENT_PERIOD = "missing-calendar-period";
const PHONE_SCHOOL_EVENT_LIMIT = 4;
const DEFAULT_SCHOOL_EVENT_LIMIT = 8;
const PHONE_PAYMENT_EVENT_LIMIT = 3;
const DEFAULT_PAYMENT_EVENT_LIMIT = 6;
const PHONE_DAY_EVENT_BADGE_LIMIT = 1;
const DEFAULT_DAY_EVENT_BADGE_LIMIT = 2;

export type CalendarMonthView = {
  days: CalendarMonthDay[];
  eventCount: number;
  monthLabel: string;
  weekdayLabels: string[];
};

type CalendarMonthDay = {
  dayLabel: string;
  events: SchoolCalendarEvent[];
  inCurrentMonth: boolean;
  isToday: boolean;
  iso: string;
};

export type CalendarPageDisplayLimits = {
  dayEventBadges: number;
  paymentEvents: number;
  schoolEvents: number;
};

export function buildCalendarMonthView(
  focusIso: string,
  events: SchoolCalendarDocument["events"],
  locale: string,
  todayIso: string,
): CalendarMonthView {
  const { monthPart, yearPart } = parseIsoMonth(focusIso, todayIso);
  const firstOfMonth = new Date(
    Date.UTC(yearPart, monthPart - MONTH_INDEX_OFFSET, FIRST_DAY_OF_MONTH),
  );
  const firstWeekday = (firstOfMonth.getUTCDay() + MONDAY_WEEK_OFFSET) % WEEKDAY_COUNT;
  const gridStart = new Date(firstOfMonth);
  gridStart.setUTCDate(gridStart.getUTCDate() - firstWeekday);
  const eventMap = new Map<string, SchoolCalendarDocument["events"]>();

  for (const event of events) {
    const existing = eventMap.get(event.event_date) ?? [];
    existing.push(event);
    eventMap.set(event.event_date, existing);
  }

  const days = Array.from({ length: CALENDAR_GRID_DAYS }, (_, index) => {
    const current = new Date(gridStart);
    current.setUTCDate(gridStart.getUTCDate() + index);
    const iso = current.toISOString().slice(ZERO_VALUE, ISO_DATE_SLICE_END_INDEX);

    return {
      dayLabel: current.getUTCDate().toString(),
      events: eventMap.get(iso) ?? [],
      inCurrentMonth: current.getUTCMonth() === firstOfMonth.getUTCMonth(),
      isToday: iso === todayIso,
      iso,
    };
  });

  return {
    days,
    eventCount: days.filter((day) => day.events.length > EVENT_PRESENT_THRESHOLD).length,
    monthLabel: new Intl.DateTimeFormat(locale, {
      month: DATE_FORMAT_MONTH_LONG,
      timeZone: UTC_TIME_ZONE,
      year: DATE_FORMAT_YEAR_NUMERIC,
    }).format(firstOfMonth),
    weekdayLabels: Array.from({ length: WEEKDAY_COUNT }, (_, index) => {
      const date = new Date(
        Date.UTC(
          CALENDAR_REFERENCE_YEAR,
          CALENDAR_REFERENCE_MONTH_INDEX,
          CALENDAR_REFERENCE_FIRST_MONDAY_DAY + index,
        ),
      );
      return new Intl.DateTimeFormat(locale, {
        timeZone: UTC_TIME_ZONE,
        weekday: DATE_FORMAT_WEEKDAY_SHORT,
      })
        .format(date)
        .replace(/\./gu, EMPTY_STRING)
        .slice(ZERO_VALUE, THREE_VALUE);
    }),
  };
}

export function buildPaymentEventKey(event: PaymentCalendarEvent, index: number): string {
  return [
    event.academic_period ?? MISSING_CALENDAR_EVENT_PERIOD,
    event.code || MISSING_CALENDAR_EVENT_CODE,
    event.label || MISSING_CALENDAR_EVENT_LABEL,
    resolvePaymentAnchor(event),
    index.toString(),
  ].join(KEY_SEPARATOR);
}

export function buildSchoolEventKey(
  event: SchoolCalendarEvent,
  index: number,
  dayIso: string = event.event_date,
): string {
  return [
    dayIso,
    event.symbol || MISSING_CALENDAR_EVENT_SYMBOL,
    event.label || MISSING_CALENDAR_EVENT_LABEL,
    index.toString(),
  ].join(KEY_SEPARATOR);
}

export function getCalendarPageDisplayLimits(
  isPhoneViewport: boolean,
): CalendarPageDisplayLimits {
  if (isPhoneViewport) {
    return {
      dayEventBadges: PHONE_DAY_EVENT_BADGE_LIMIT,
      paymentEvents: PHONE_PAYMENT_EVENT_LIMIT,
      schoolEvents: PHONE_SCHOOL_EVENT_LIMIT,
    };
  }

  return {
    dayEventBadges: DEFAULT_DAY_EVENT_BADGE_LIMIT,
    paymentEvents: DEFAULT_PAYMENT_EVENT_LIMIT,
    schoolEvents: DEFAULT_SCHOOL_EVENT_LIMIT,
  };
}

export function getMexicoCityTodayIso(): string {
  return new Intl.DateTimeFormat(ISO_DATE_LOCALE, {
    day: DATE_FORMAT_DAY_DIGITS,
    month: DATE_FORMAT_MONTH_DIGITS,
    timeZone: MEXICO_CITY_TIME_ZONE,
    year: DATE_FORMAT_YEAR_NUMERIC,
  }).format(new Date());
}

export function getRelevantPaymentEvents(
  events: PaymentCalendarDocument["payment_events"],
  todayIso: string,
  preferredAcademicPeriod: string | null,
): PaymentCalendarEvent[] {
  const candidateEvents =
    preferredAcademicPeriod !== null
      ? events.filter((event) =>
          academicPeriodMatches(event.academic_period, preferredAcademicPeriod),
        )
      : [];

  const relevantEvents =
    candidateEvents.length > EVENT_PRESENT_THRESHOLD ? candidateEvents : events;
  const upcomingEvents = relevantEvents
    .filter(
      (event) =>
        compareDateDistance(resolvePaymentAnchor(event), todayIso) >=
        DATE_DISTANCE_TODAY_THRESHOLD,
    )
    .sort((left, right) =>
      resolvePaymentAnchor(left).localeCompare(
        resolvePaymentAnchor(right),
        ENGLISH_COMPARE_LOCALE,
      ),
    );
  const recentPastEvents = relevantEvents
    .filter(
      (event) =>
        compareDateDistance(resolvePaymentAnchor(event), todayIso) <
        DATE_DISTANCE_TODAY_THRESHOLD,
    )
    .sort((left, right) =>
      resolvePaymentAnchor(right).localeCompare(
        resolvePaymentAnchor(left),
        ENGLISH_COMPARE_LOCALE,
      ),
    );

  return [...upcomingEvents, ...recentPastEvents];
}

export function getRelevantSchoolEvents(
  events: SchoolCalendarDocument["events"],
  todayIso: string,
): SchoolCalendarEvent[] {
  const upcomingEvents = events
    .filter(
      (event) => compareDateDistance(event.event_date, todayIso) >= DATE_DISTANCE_TODAY_THRESHOLD,
    )
    .sort((left, right) => left.event_date.localeCompare(right.event_date, ENGLISH_COMPARE_LOCALE));
  const recentPastEvents = events
    .filter(
      (event) => compareDateDistance(event.event_date, todayIso) < DATE_DISTANCE_TODAY_THRESHOLD,
    )
    .sort((left, right) => right.event_date.localeCompare(left.event_date, ENGLISH_COMPARE_LOCALE));

  return [...upcomingEvents, ...recentPastEvents];
}

export function resolveSelectedAcademicPeriod(label: string | null): string | null {
  if (!label) {
    return null;
  }

  return label
    .replace(/[()]/gu, EMPTY_STRING)
    .replace(/\s+/gu, SPACE_STRING)
    .trim();
}

function academicPeriodMatches(source: string | null, target: string): boolean {
  if (!source) {
    return false;
  }

  const normalizedSource = source.toLocaleUpperCase(SPANISH_NORMALIZATION_LOCALE);
  const normalizedTarget = target.toLocaleUpperCase(SPANISH_NORMALIZATION_LOCALE);

  return normalizedSource.includes(normalizedTarget) || normalizedTarget.includes(normalizedSource);
}

function compareDateDistance(leftIso: string, rightIso: string): number {
  const left = Date.parse(`${leftIso}T00:00:00Z`);
  const right = Date.parse(`${rightIso}T00:00:00Z`);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return Number.POSITIVE_INFINITY;
  }

  return left - right;
}

function parseIsoMonth(
  focusIso: string,
  fallbackIso: string,
): { monthPart: number; yearPart: number } {
  const parsedFocus = parseIsoMonthParts(focusIso);

  if (parsedFocus !== null) {
    return parsedFocus;
  }

  return (
    parseIsoMonthParts(fallbackIso) ?? {
      monthPart: FIRST_DAY_OF_MONTH,
      yearPart: new Date().getUTCFullYear(),
    }
  );
}

function parseIsoMonthParts(
  isoDate: string,
): { monthPart: number; yearPart: number } | null {
  const segments = isoDate.split(ISO_DATE_SEPARATOR);
  if (segments.length < ISO_MONTH_SEGMENT_COUNT) {
    return null;
  }

  const yearPart = Number(segments[YEAR_SEGMENT_INDEX]);
  const monthPart = Number(segments[MONTH_SEGMENT_INDEX]);
  if (!Number.isFinite(yearPart) || !Number.isFinite(monthPart)) {
    return null;
  }

  return {
    monthPart,
    yearPart,
  };
}

function resolvePaymentAnchor(
  event: PaymentCalendarDocument["payment_events"][number],
): string {
  return event.event_date ?? event.date_range_start ?? event.active_from ?? MAX_ISO_DATE_FALLBACK;
}
