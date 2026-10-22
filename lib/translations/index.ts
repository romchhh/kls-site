import { ua } from "./ua";
import { ru } from "./ru";
import { en } from "./en";

export type Locale = "ua" | "ru" | "en";

export const locales: Locale[] = ["ua", "ru", "en"];
export const defaultLocale: Locale = "ua";

export const translations = {
  ua,
  ru,
  en,
};

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getShipmentStatusTranslation(status: string, locale: Locale): string {
  const t = getTranslations(locale);
  const timelineStatuses = (t.cabinet as any)?.timelineStatuses || {};
  return timelineStatuses[status] || status.replace(/_/g, " ");
}
