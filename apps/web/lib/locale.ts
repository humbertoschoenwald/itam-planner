import type { LocaleCode } from "@/lib/types";

export const SUPPORTED_LOCALES = ["es-MX", "en"] as const satisfies readonly LocaleCode[];
export const DEFAULT_LOCALE: LocaleCode = "es-MX";

export function isSupportedLocale(value: string): value is LocaleCode {
  return SUPPORTED_LOCALES.includes(value as LocaleCode);
}
