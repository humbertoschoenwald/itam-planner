const WEEKDAY_CODE_BY_ENGLISH_DAY = {
  Fri: "VI",
  Mon: "LU",
  Sat: "SA",
  Sun: "DO",
  Thu: "JU",
  Tue: "MA",
  Wed: "MI",
} as const;

export interface MexicoCityDateContext {
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
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";

  return {
    isoDate: `${year}-${month}-${day}`,
    weekdayCode:
      WEEKDAY_CODE_BY_ENGLISH_DAY[weekday as keyof typeof WEEKDAY_CODE_BY_ENGLISH_DAY] ?? "LU",
  };
}
