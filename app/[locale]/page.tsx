import { HeroSection } from "../../components/HeroSection";
import { Navigation } from "../../components/Navigation";
import { DeliveryTypesSection } from "../../components/DeliveryTypesSection";
import { WhyChooseUsSection } from "../../components/WhyChooseUsSection";
import { ServicesSection } from "../../components/ServicesSection";
import { PartnersSection } from "../../components/PartnersSection";
import { CostCalculationSection } from "../../components/CostCalculationSection";
import { CTASection } from "../../components/CTASection";
import { SiteFooter } from "../../components/SiteFooter";
import { ScrollToTop } from "../../components/ScrollToTop";
import { ContactButton } from "../../components/ContactButton";
import { Locale, getTranslations } from "../../lib/translations";
import Link from "next/link";
import { ArrowRight, MapPin, Globe, Truck } from "lucide-react";

// Дозволяємо динамічний рендеринг для правильної роботи відео
export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);

  const deliveryLinks = [
    {
      key: "ukraineTurnkey",
      href: `/${locale}/delivery/ukraine-turnkey`,
      title: t.delivery?.ukraineTurnkey || "Доставка в Україну під ключ",
      description: locale === "ua" 
        ? "Комплексна доставка вантажів з Китаю в Україну під ключ. Ми беремо на себе всі етапи логістичного процесу від отримання вантажу на складі в Китаї до доставки в Україну."
        : locale === "ru"
        ? "Комплексная доставка грузов из Китая в Украину под ключ. Мы берем на себя все этапы логистического процесса от получения груза на складе в Китае до доставки в Украину."
        : "Comprehensive delivery of cargo from China to Ukraine turnkey. We take care of all stages of the logistics process from receiving cargo at the warehouse in China to delivery to Ukraine.",
      icon: MapPin,
      gradient: "from-blue-500 to-teal-500",
      bgGradient: "from-blue-50 to-teal-50",
      subLinks: [
        { key: "sea", href: `/${locale}/delivery/sea`, label: t.delivery?.sea || "Морські перевезення" },
        { key: "air", href: `/${locale}/delivery/air`, label: t.delivery?.air || "Авіа перевезення" },
        { key: "rail", href: `/${locale}/delivery/rail`, label: t.delivery?.rail || "Залізничні вантажоперевезення" },
        { key: "multimodal", href: `/${locale}/delivery/multimodal`, label: t.delivery?.multimodal || "Мультимодальна доставка" },
      ],
    },
    {
      key: "euWorld",
      href: `/${locale}/delivery/eu-world`,
      title: t.delivery?.euWorld || "Доставка в країни ЄС та світу",
      description: locale === "ua"
        ? "Доставка вантажів в країни Європейського Союзу та інші країни світу. Широкий спектр логістичних рішень для міжнародної торгівлі."
        : locale === "ru"
        ? "Доставка грузов в страны Европейского Союза и другие страны мира. Широкий спектр логистических решений для международной торговли."
        : "Delivery of cargo to European Union countries and other countries around the world. A wide range of logistics solutions for international trade.",
      icon: Globe,
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
      subLinks: [
        { key: "fba", href: `/${locale}/delivery/fba`, label: t.delivery?.fba || "FBA" },
        { key: "ddp", href: `/${locale}/delivery/ddp`, label: t.delivery?.ddp || "DDP/DDU" },
        { key: "express", href: `/${locale}/delivery/express`, label: t.delivery?.express || "Експрес доставка" },
        { key: "portToPort", href: `/${locale}/delivery/port-to-port`, label: t.delivery?.portToPort || "Порт-до-порту" },
        { key: "crossBorder", href: `/${locale}/delivery/cross-border`, label: t.delivery?.crossBorder || "Міжкордонна доставка" },
      ],
    },
    {
      key: "international",
      href: `/${locale}/delivery/international`,
      title: t.delivery?.international || "Міжнародне перевезення та експедирування",
      description: locale === "ua"
        ? "Ми забезпечуємо повний комплекс логістичних рішень для міжнародних вантажних перевезень, поєднуючи надійність, прозорість та індивідуальний підхід."
        : locale === "ru"
        ? "Мы обеспечиваем полный комплекс логистических решений для международных грузовых перевозок, сочетая надежность, прозрачность и индивидуальный подход."
        : "We provide a full range of logistics solutions for international cargo transportation, combining reliability, transparency and an individual approach.",
      icon: Truck,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      subLinks: [
        { key: "seaContainer", href: `/${locale}/delivery/sea-container`, label: t.delivery?.seaContainer || "Морський контейнер" },
        { key: "airCargo", href: `/${locale}/delivery/air-cargo`, label: t.delivery?.airCargo || "Авіа вантаж" },
        { key: "railCargo", href: `/${locale}/delivery/rail-cargo`, label: t.delivery?.railCargo || "Залізничний вантаж" },
        { key: "roadCargo", href: `/${locale}/delivery/road-cargo`, label: t.delivery?.roadCargo || "Автомобільний вантаж" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <HeroSection locale={locale} />
      
      {/* Секція Доставка */}
      <section id="delivery" className="relative bg-gradient-to-b from-white via-gray-50 to-white py-20 overflow-hidden">
        {/* Декоративні елементи */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.nav.delivery}
            </h2>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {deliveryLinks.map((link) => {
              const Icon = link.icon;
              return (
                <div
                  key={link.key}
                  className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Градієнтний фон при hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Контент */}
                  <div className="relative z-10 p-8">
                    {/* Іконка */}
                    <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${link.gradient} p-4 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Заголовок */}
                    <Link href={link.href}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors cursor-pointer">
                        {link.title}
                      </h3>
                    </Link>
                    
                    {/* Опис */}
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {link.description}
                    </p>
                    
                    {/* Підпосилання */}
                    <div className="space-y-2 mb-6">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.key}
                          href={subLink.href}
                          className="block text-sm text-gray-700 hover:text-teal-600 transition-colors py-1 group/sub"
                        >
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                            {subLink.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Стрілка */}
                    <Link href={link.href} className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                      <span className="text-sm mr-2">
                        {locale === "ua" ? "Дізнатися більше" : locale === "ru" ? "Узнать больше" : "Learn more"}
                      </span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WhyChooseUsSection locale={locale} />
      <ServicesSection locale={locale} />
      <PartnersSection locale={locale} />
      <DeliveryTypesSection locale={locale} />
      <CTASection locale={locale} />
      <CostCalculationSection locale={locale} />
      <SiteFooter locale={locale} />
      <ScrollToTop />
      <ContactButton locale={locale} />
    </div>
  );
}
