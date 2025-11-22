import { ReactNode } from "react";
import { Locale } from "../../lib/translations";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <>{children}</>;
}

