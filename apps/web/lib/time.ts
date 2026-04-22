const WEEKDAY_CODE_BY_ENGLISH_DAY = {
  Fri: "VI",
  Mon: "LU",
  Sat: "SA",
  Sun: "DO",
  Thu: "JU",
  Tue: "MA",
  Wed: "MI",
} as const;

export type MexicoCityDateContext = {
  isoDate: string;
  weekdayCode: keyof typeof WEEKDAY_CODE_BY_ENGLISH_DAY extends never
    ? never
    : (typeof WEEKDAY_CODE_BY_ENGLISH_DAY)[keyof typeof WEEKDAY_CODE_BY_ENGLISH_DAY];
}

export function getMexicoCityDateContext(now: Date = new Date()): MexicoCityDateContext {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Mexico_City",
    weekday: "short",
    year: "numeric",
  });

  const parts = formatter.formatToParts(now);
  const year = getDatePartValue(parts, "year", "1970");
  const month = getDatePartValue(parts, "month", "01");
  const day = getDatePartValue(parts, "day", "01");
  const weekday = getDatePartValue(parts, "weekday", "Mon");

  return {
    isoDate: `${year}-${month}-${day}`,
    weekdayCode: resolveWeekdayCode(weekday),
  };
}

function getDatePartValue(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
  fallback: string,
): string {
  return parts.find((part) => part.type === type)?.value ?? fallback;
}

function resolveWeekdayCode(weekday: string): MexicoCityDateContext["weekdayCode"] {
  return WEEKDAY_CODE_BY_ENGLISH_DAY[weekday as keyof typeof WEEKDAY_CODE_BY_ENGLISH_DAY];
}
