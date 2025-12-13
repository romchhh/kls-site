import { Navigation } from "../../../components/Navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { Locale, getTranslations } from "../../../lib/translations";
import Link from "next/link";
import { ArrowRight, Package, DollarSign, Search, Shield, Truck, FileText } from "lucide-react";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

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
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
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
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
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
      icon: Search,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
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
      icon: Shield,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50",
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
      icon: Truck,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
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
      icon: FileText,
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
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
      icon: Truck,
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-bold text-gray-900 md:text-6xl">
              {t.services.mainTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t.services.mainDescription}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.key}
                  href={service.href}
                  className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${service.color} p-4 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {service.title}
                    </h2>

                    {/* Description */}
                    <p className="mb-6 text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Arrow */}
                    <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                      <span className="text-sm mr-2">
                        {locale === "ua" ? "Дізнатися більше" : locale === "ru" ? "Узнать больше" : "Learn more"}
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
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

