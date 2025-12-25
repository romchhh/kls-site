import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../lib/translations";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const iconMap: Record<string, string> = {
    payments: "/money-transfers.svg",
    warehousing: "/warehousing-services.svg",
    sourcing: "/sourcing-service.svg",
    insurance: "/cargo-insurance.svg",
    customs: "/customs-brokerage.svg",
    forwarding: "/cargo-forwarding.svg",
    local: "/local-delivery.svg",
  };

  const services = [
    {
      key: "warehousing",
      title: t.services.warehousing,
      description: locale === "ua"
        ? "Комплексні складські послуги для зберігання, обробки та підготовки ваших вантажів"
        : locale === "ru"
        ? "Комплексные складские услуги для хранения, обработки и подготовки ваших грузов"
        : "Comprehensive warehousing services for storage, processing and preparation of your cargo",
      href: `/${locale}/services/warehousing`,
    },
    {
      key: "payments",
      title: t.services.payments,
      description: locale === "ua"
        ? "Швидкі, безпечні та вигідні грошові перекази в Китай для бізнесу та приватних осіб"
        : locale === "ru"
        ? "Быстрые, безопасные и выгодные денежные переводы в Китай для бизнеса и частных лиц"
        : "Fast, secure and profitable money transfers to China for businesses and individuals",
      href: `/${locale}/services/payments`,
    },
    {
      key: "sourcing",
      title: t.services.sourcing,
      description: locale === "ua"
        ? "Професійний пошук та закупівля товарів в Китаї та Кореї. Контроль якості та перевірка постачальників"
        : locale === "ru"
        ? "Профессиональный поиск и закупка товаров в Китае и Корее. Контроль качества и проверка поставщиков"
        : "Professional search and procurement of goods in China and Korea. Quality control and supplier verification",
      href: `/${locale}/services/sourcing`,
    },
    {
      key: "insurance",
      title: t.services.insurance,
      description: locale === "ua"
        ? "Повне страхування вашого вантажу на всьому маршруті доставки. Захист від непередбачених ситуацій"
        : locale === "ru"
        ? "Полное страхование вашего груза на всем маршруте доставки. Защита от непредвиденных ситуаций"
        : "Complete insurance coverage for your cargo throughout the delivery route. Protection from unforeseen situations",
      href: `/${locale}/services/insurance`,
    },
    {
      key: "local",
      title: t.services.local,
      description: locale === "ua"
        ? "Швидка та надійна доставка по Україні та іншим країнам. Логістичні рішення для останньої милі"
        : locale === "ru"
        ? "Быстрая и надежная доставка по Украине и другим странам. Логистические решения для последней мили"
        : "Fast and reliable delivery across Ukraine and other countries. Logistics solutions for the last mile",
      href: `/${locale}/services/local`,
    },
    {
      key: "customs",
      title: t.services.customs,
      description: locale === "ua"
        ? "Повний комплекс митно-брокерських послуг для імпортних та експортних вантажів"
        : locale === "ru"
        ? "Полный комплекс таможенно-брокерских услуг для импортных и экспортных грузов"
        : "Full range of customs brokerage services for import and export cargo",
      href: `/${locale}/services/customs`,
    },
    {
      key: "forwarding",
      title: t.services.forwarding,
      description: locale === "ua"
        ? "Експедирування вантажів з повним супроводом та організацією міжнародних перевезень"
        : locale === "ru"
        ? "Экспедирование грузов с полным сопровождением и организацией международных перевозок"
        : "Cargo forwarding with full support and organization of international transportation",
      href: `/${locale}/services/forwarding`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-3 text-3xl md:text-5xl font-bold text-gray-900">
              {t.services.mainTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
              {t.services.mainDescription}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              return (
                <Link
                  key={service.key}
                  href={service.href}
                  className="group relative flex-shrink-0 rounded-3xl border-2 border-gray-200 bg-white p-5 sm:p-7 shadow-none transition-all duration-500 hover:border-teal-300 hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex h-full flex-col min-h-[280px] sm:min-h-[320px]">
                    {/* Icon */}
                    <div className="mb-4 sm:mb-6 flex justify-center transition-transform duration-500 group-hover:scale-110">
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                        <Image
                          src={iconMap[service.key] || "/money-transfers.svg"}
                          alt={service.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 sm:mb-5 text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                      {service.description}
                    </p>

                    {/* Кнопка «Детальніше» у стилі інших CTA */}
                    <div className="mt-auto">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-2.5 text-sm md:text-base font-semibold text-teal-700 transition-all duration-200 ease-out group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-800">
                        <span>{t.services.readMore}</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>
                  </div>
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

