import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";
import Link from "next/link";

export default async function WarehousingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const services = [
    { key: "consolidation", href: `/${locale}/services/consolidation` },
    { key: "storage", href: `/${locale}/services/storage` },
    { key: "inspection", href: `/${locale}/services/inspection` },
    { key: "packaging", href: `/${locale}/services/packaging` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            {t.services.warehousing}
          </h1>
          <div className="mb-12 prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg">
              {locale === "ua" &&
                "Комплексні складські послуги для зберігання, обробки та підготовки ваших вантажів. Професійне управління складськими запасами та логістикою."}
              {locale === "ru" &&
                "Комплексные складские услуги для хранения, обработки и подготовки ваших грузов. Профессиональное управление складскими запасами и логистикой."}
              {locale === "en" &&
                "Comprehensive warehousing services for storage, processing and preparation of your cargo. Professional warehouse inventory and logistics management."}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const serviceText = t.services[service.key as keyof typeof t.services];
              return (
                <Link
                  key={service.key}
                  href={service.href}
                  className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
                >
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {typeof serviceText === 'string' ? serviceText : service.key}
                  </h2>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

