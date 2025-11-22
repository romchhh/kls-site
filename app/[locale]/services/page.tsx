import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../lib/translations";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            {t.services.title}
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <a
              href={`/${locale}/services/payments`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.services.payments}
              </h2>
            </a>
            <a
              href={`/${locale}/services/warehousing`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.services.warehousing}
              </h2>
            </a>
            <a
              href={`/${locale}/services/sourcing`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.services.sourcing}
              </h2>
            </a>
            <a
              href={`/${locale}/services/insurance`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.services.insurance}
              </h2>
            </a>
            <a
              href={`/${locale}/services/local`}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {t.services.local}
              </h2>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

