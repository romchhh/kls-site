import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";

const serviceTypes = [
  "payments",
  "warehousing",
  "sourcing",
  "insurance",
  "local",
] as const;

type ServiceType = (typeof serviceTypes)[number];

export default async function ServiceTypePage({
  params,
}: {
  params: Promise<{ locale: Locale; type: string }>;
}) {
  const { locale, type } = await params;
  const t = getTranslations(locale);
  const serviceType = type as ServiceType;

  if (!serviceTypes.includes(serviceType as ServiceType)) {
    return <div>Not found</div>;
  }

  const title = t.services[serviceType];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">{title}</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">
              {locale === "ua" &&
                "Детальна інформація про цю послугу буде додана найближчим часом."}
              {locale === "ru" &&
                "Подробная информация об этой услуге будет добавлена в ближайшее время."}
              {locale === "en" &&
                "Detailed information about this service will be added soon."}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

