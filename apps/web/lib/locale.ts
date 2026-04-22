import type { LocaleCode } from "@/lib/types";

export const SUPPORTED_LOCALES = ["es-MX", "en"] as const satisfies readonly LocaleCode[];
export const DEFAULT_LOCALE: LocaleCode = "es-MX";

export const LOCALE_LABELS = {
  en: {
    "es-MX": "Spanish (MX)",
    en: "English",
  },
  "es-MX": {
    "es-MX": "Español (MX)",
    en: "Inglés",
  },
} as const satisfies Record<LocaleCode, Record<LocaleCode, string>>;

export function isSupportedLocale(value: string): value is LocaleCode {
  return SUPPORTED_LOCALES.includes(value as LocaleCode);
}

export function getLocaleLabels(locale: LocaleCode): Record<LocaleCode, string> {
  return LOCALE_LABELS[locale];
}
