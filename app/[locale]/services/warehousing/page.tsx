import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import { generateServiceMetadata } from "../../../../lib/metadata";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const serviceNames = {
    ua: "Складські послуги",
    ru: "Складские услуги",
    en: "Warehousing Services",
  };
  const serviceDescriptions = {
    ua: "Професійні складські послуги в Китаї та Україні. Консолідація вантажів, зберігання, пакування та перепакування, інспекція та контроль якості. Оптимізація логістичних витрат та прискорення процесу доставки.",
    ru: "Профессиональные складские услуги в Китае и Украине. Консолидация грузов, хранение, упаковка и переупаковка, инспекция и контроль качества. Оптимизация логистических расходов и ускорение процесса доставки.",
    en: "Professional warehousing services in China and Ukraine. Cargo consolidation, storage, packaging and repackaging, inspection and quality control. Optimization of logistics costs and acceleration of delivery process.",
  };
  return generateServiceMetadata(locale, "warehousing", serviceNames, serviceDescriptions);
}

export default async function WarehousingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const consolidation = (t.services as any)?.pages?.consolidation;
  const storage = (t.services as any)?.pages?.storage;
  const inspection = (t.services as any)?.pages?.inspection;
  const packaging = (t.services as any)?.pages?.packaging;

  const title = t.services.warehousing;
  const subtitle = locale === "ua"
    ? "Комплексні складські послуги для зберігання, обробки та підготовки ваших вантажів"
    : locale === "ru"
    ? "Комплексные складские услуги для хранения, обработки и подготовки ваших грузов"
    : "Comprehensive warehousing services for storage, processing and preparation of your cargo";
  const intro = locale === "ua"
    ? "Професійне управління складськими запасами та логістикою. Ми забезпечуємо безпечне зберігання, консолідацію, інспекцію та пакування ваших вантажів."
    : locale === "ru"
    ? "Профессиональное управление складскими запасами и логистикой. Мы обеспечиваем безопасное хранение, консолидацию, инспекцию и упаковку ваших грузов."
    : "Professional warehouse inventory and logistics management. We provide secure storage, consolidation, inspection and packaging of your cargo.";

  const services = [
    {
      title: consolidation?.title || (locale === "ua" ? "Консолідація вантажів" : locale === "ru" ? "Консолидация грузов" : "Cargo Consolidation"),
      icon: "/services/warehousing-icons/warehousing-services.svg",
      intro: consolidation?.intro || (locale === "ua" ? "Ми приймаємо відправлення від різних постачальників, об'єднуємо їх у єдину партію та готуємо до оптимізованої доставки." : locale === "ru" ? "Мы принимаем отправления от разных поставщиков, объединяем их в единую партию и готовим к оптимизированной доставке." : "We receive shipments from different suppliers, combine them into a single batch and prepare for optimized delivery."),
      items: consolidation?.advantagesList || [],
    },
    {
      title: storage?.title || (locale === "ua" ? "Зберігання вантажів" : locale === "ru" ? "Хранение грузов" : "Cargo Storage"),
      icon: "/services/warehousing-icons/all-cargo-types.svg",
      intro: storage?.intro || (locale === "ua" ? "Пропонуємо короткострокове та довгострокове зберігання з контрольованими умовами." : locale === "ru" ? "Предлагаем краткосрочное и долгосрочное хранение с контролируемыми условиями." : "We offer short-term and long-term storage with controlled conditions."),
      items: storage?.advantagesList || [],
    },
    {
      title: inspection?.title || (locale === "ua" ? "Інспекція та перевірка" : locale === "ru" ? "Инспекция и проверка" : "Inspection and Verification"),
      icon: "/services/warehousing-icons/sourcing-services.svg",
      intro: inspection?.intro || (locale === "ua" ? "Проводимо контроль якості та відповідності товару перед відправкою або після отримання." : locale === "ru" ? "Проводим контроль качества и соответствия товара перед отправкой или после получения." : "We conduct quality control and product compliance checks before shipment or after receipt."),
      items: inspection?.services || inspection?.servicesList || [],
    },
    {
      title: packaging?.title || (locale === "ua" ? "Пакування вантажів" : locale === "ru" ? "Упаковка грузов" : "Cargo Packaging"),
      icon: "/services/warehousing-icons/luggage.svg",
      intro: packaging?.intro || (locale === "ua" ? "Професійне пакування для захисту вантажу під час транспортування." : locale === "ru" ? "Профессиональная упаковка для защиты груза во время транспортировки." : "Professional packaging to protect cargo during transportation."),
      items: packaging?.servicesList || [],
    },
  ];

  const advantages = [
    locale === "ua" ? "Безпечне зберігання" : locale === "ru" ? "Безопасное хранение" : "Secure storage",
    locale === "ua" ? "Професійна обробка" : locale === "ru" ? "Профессиональная обработка" : "Professional processing",
    locale === "ua" ? "Контроль якості" : locale === "ru" ? "Контроль качества" : "Quality control",
    locale === "ua" ? "Гнучкі умови" : locale === "ru" ? "Гибкие условия" : "Flexible terms",
    locale === "ua" ? "Повна звітність" : locale === "ru" ? "Полная отчетность" : "Full reporting",
  ];

  const clients = [
    locale === "ua" ? "імпортерів та експортерів" : locale === "ru" ? "импортеров и экспортеров" : "importers and exporters",
    locale === "ua" ? "e-commerce бізнесу" : locale === "ru" ? "e-commerce бизнеса" : "e-commerce businesses",
    locale === "ua" ? "компаній з регулярними поставками" : locale === "ru" ? "компаний с регулярными поставками" : "companies with regular deliveries",
    locale === "ua" ? "бізнесу, що потребує складування" : locale === "ru" ? "бизнеса, требующего складирования" : "businesses requiring storage",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services/warehouse-services.jpg"
            alt="KLS Logistics"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-[1]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20 md:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left - Text Content */}
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl" style={{ whiteSpace: 'pre-line' }}>
                {title}
              </h1>
              <p className="mb-6 text-base font-normal leading-relaxed text-white/95 md:text-lg">
                {subtitle}
              </p>
            </div>

            {/* Right - Contact Form */}
            <div className="flex justify-end">
              <div className="mt-12 max-w-md w-full shadow-2xl">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-[#E8FDF8] p-8">
            <p className="text-base font-normal leading-relaxed text-gray-700 md:text-lg">
              {intro}
            </p>
              </div>
            </div>
      </section>

      {/* Our Services Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {locale === "ua" ? "Наші послуги" : locale === "ru" ? "Наши услуги" : "Our services"}
              </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => (
              <div key={index} className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#006D77] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-md">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-teal-600">
                      {service.title}
                </h3>
                    <p className="mb-4 text-sm text-gray-600">{service.intro}</p>
                <ul className="space-y-2">
                      {service.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="mt-1.5 text-teal-600">•</span>
                          <span className="text-base text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                            {item}
                          </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
              </div>
            ))}
              </div>
            </div>
      </section>

      {/* Advantages Section */}
      <section className="relative bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {locale === "ua" ? "Наші переваги" : locale === "ru" ? "Наши преимущества" : "Our advantages"}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex w-full flex-col items-center text-center md:w-[calc(33.333%-1rem)]">
                <div className="mb-4 flex-shrink-0">
                  <Image
                    src="/icons/misc/Group 7.svg"
                    alt="Check"
                    width={43}
                    height={43}
                    className="object-contain"
                  />
                </div>
                <p className="text-base font-normal leading-relaxed text-white md:text-lg">
                  {advantage}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="pt-12 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {locale === "ua" ? "Для кого підходить" : locale === "ru" ? "Для кого подходит" : "For whom it suits"}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {clients.map((client, index) => (
              <div
                key={index}
                className="group rounded-2xl border-2 border-[#006D77] bg-white px-6 py-4 text-center transition-all duration-300 hover:border-[#006D77] hover:bg-[#E8FDF8] hover:shadow-sm"
              >
                <p className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-teal-700 [&::first-letter]:uppercase">
                  {client}
                </p>
            </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </div>
  );
}
