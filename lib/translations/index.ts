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

// Для зворотної сумісності зі старим файлом translations.ts
export const navTranslations = {
  ua: ua.nav,
  ru: ru.nav,
  en: en.nav,
};

export const deliveryTranslations = {
  ua: ua.delivery,
  ru: ru.delivery,
  en: en.delivery,
};

export const servicesTranslations = {
  ua: ua.services,
  ru: ru.services,
  en: en.services,
};

export const aboutTranslations = {
  ua: ua.about,
  ru: ru.about,
  en: en.about,
};

export const contactsTranslations = {
  ua: ua.contacts,
  ru: ru.contacts,
  en: en.contacts,
};

export function getShipmentStatusTranslation(status: string, locale: Locale): string {
  const t = getTranslations(locale);
  const shipmentStatuses = (t.cabinet as any)?.shipmentStatuses || {};
  return shipmentStatuses[status] || status.replace(/_/g, " ");
}
