import { ReactNode } from "react";
import { Locale } from "../../lib/translations";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate and cast locale to Locale type
  const validLocale: Locale = (locale === "ua" || locale === "ru" || locale === "en") ? locale : "ua";
  return <>{children}</>;
}

