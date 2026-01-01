import { Navigation } from "../../../../components/Navigation";
import { SiteFooter } from "../../../../components/SiteFooter";
import { ContactForm } from "../../../../components/ContactForm";
import { Locale, getTranslations } from "../../../../lib/translations";
import Image from "next/image";

export default async function WarehousingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const consolidation = (t.services as any).pages.consolidation;
  const storage = (t.services as any).pages.storage;
  const inspection = (t.services as any).pages.inspection;
  const packaging = (t.services as any).pages.packaging;

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
      title: consolidation.title,
      icon: "/services/warehousing.svg",
      intro: consolidation.intro,
      items: consolidation.advantagesList,
    },
    {
      title: storage.title,
      icon: "/why-choose-us/quality.svg",
      intro: storage.intro,
      items: storage.advantagesList,
    },
    {
      title: inspection.title,
      icon: "/why-choose-us/reliability.svg",
      intro: inspection.intro,
      items: inspection.services || inspection.servicesList || [],
    },
    {
      title: packaging.title,
      icon: "/why-choose-us/transparency.svg",
      intro: packaging.intro,
      items: packaging.servicesList || [],
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
            src="/images/vygruzka-gruzovikov-v-logisticeskom-centre-s-vozduha 1.jpg"
            alt="KLS Logistics"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-[1]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Left - Text Content */}
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
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
