import { ReactNode } from "react";
import { Metadata } from "next";
import { Locale } from "../../lib/translations";
import { generateMetadata as genMeta } from "../../lib/metadata";
import { StructuredData } from "../../components/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale: Locale = (locale === "ua" || locale === "ru" || locale === "en") ? locale : "ua";
  return genMeta(validLocale);
}

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
  return (
    <>
      <StructuredData locale={validLocale} type="Organization" />
      <StructuredData locale={validLocale} type="WebSite" />
      <StructuredData locale={validLocale} type="LocalBusiness" />
      {children}
    </>
  );
}

