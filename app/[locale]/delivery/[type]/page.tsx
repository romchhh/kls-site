import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../../lib/translations";

const deliveryTypes = [
  "air",
  "sea",
  "rail",
  "multimodal",
  "express",
  "ddp",
  "fba",
  "lcl",
] as const;

type DeliveryType = (typeof deliveryTypes)[number];

export default async function DeliveryTypePage({
  params,
}: {
  params: Promise<{ locale: Locale; type: string }>;
}) {
  const { locale, type } = await params;
  const t = getTranslations(locale);
  const deliveryType = type as DeliveryType;

  if (!deliveryTypes.includes(deliveryType as DeliveryType)) {
    return <div>Not found</div>;
  }

  const title = t.delivery[deliveryType];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">{title}</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">
              {locale === "ua" &&
                "Детальна інформація про цей тип доставки буде додана найближчим часом."}
              {locale === "ru" &&
                "Подробная информация об этом типе доставки будет добавлена в ближайшее время."}
              {locale === "en" &&
                "Detailed information about this delivery type will be added soon."}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

