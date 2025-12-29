import { HeroSection } from "../../components/HeroSection";
import { Navigation } from "../../components/Navigation";
import { DeliveryTypesSection } from "../../components/DeliveryTypesSection";
import { WhyChooseUsSection } from "../../components/WhyChooseUsSection";
import { ServicesSection } from "../../components/ServicesSection";
import { PartnersSection } from "../../components/PartnersSection";
import { CostCalculationSection } from "../../components/CostCalculationSection";
import { SiteFooter } from "../../components/SiteFooter";
import { ScrollToTop } from "../../components/ScrollToTop";
import { ContactButton } from "../../components/ContactButton";
import { Locale, getTranslations } from "../../lib/translations";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import React from "react";

// Дозволяємо динамічний рендеринг для правильної роботи відео
export const dynamic = 'force-dynamic';

// Helper function to format delivery titles with line breaks
function formatDeliveryTitle(key: string, locale: Locale, title: string): React.ReactNode {
  if (key === "ukraineTurnkey") {
    if (locale === "ua") {
      return <>Доставка в Україну<br />під ключ</>;
    } else if (locale === "ru") {
      return <>Доставка в Украину<br />под ключ</>;
    } else {
      return <>Delivery to Ukraine<br />turnkey</>;
    }
  } else if (key === "euWorld") {
    if (locale === "ua") {
      return <>Доставка в країни ЄС<br />та світу</>;
    } else if (locale === "ru") {
      return <>Доставка в страны ЕС<br />и мира</>;
    } else {
      return <>Delivery to EU countries<br />and the world</>;
    }
  } else if (key === "international") {
    if (locale === "ua") {
      return <>Міжнародне перевезення<br />та експедирування</>;
    } else if (locale === "ru") {
      return <>Международные перевозки<br />и экспедирование</>;
    } else {
      return <>International transportation<br />and forwarding</>;
    }
  }
  return title;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getTranslations(locale);
  
  // Безпечний доступ до перекладів
  const delivery = t?.delivery || {};
  const nav = t?.nav || {};

  const deliveryLinks = [
    {
      key: "ukraineTurnkey",
      href: `/${locale}/delivery/ukraine-turnkey`,
      title: delivery.ukraineTurnkey || "Доставка в Україну під ключ",
      description: locale === "ua" 
        ? "Комплексна доставка вантажів з Китаю в Україну під ключ. Ми беремо на себе всі етапи логістичного процесу від отримання вантажу на складі в Китаї до доставки в Україну."
        : locale === "ru"
        ? "Комплексная доставка грузов из Китая в Украину под ключ. Мы берем на себя все этапы логистического процесса от получения груза на складе в Китае до доставки в Украину."
        : "Comprehensive delivery of cargo from China to Ukraine turnkey. We take care of all stages of the logistics process from receiving cargo at the warehouse in China to delivery to Ukraine.",
      image: "/delivery/ukraine-turnkey.svg",
      gradient: "from-blue-500 to-teal-500",
      bgGradient: "from-blue-50 to-teal-50",
      subLinks: [
        { key: "sea", href: `/${locale}/delivery/ukraine-turnkey`, label: delivery.sea || "Морські перевезення" },
        { key: "air", href: `/${locale}/delivery/ukraine-turnkey`, label: delivery.air || "Авіа перевезення" },
        { key: "rail", href: `/${locale}/delivery/ukraine-turnkey`, label: delivery.rail || "Залізничні перевезення" },
        { key: "multimodal", href: `/${locale}/delivery/ukraine-turnkey`, label: delivery.multimodal || "Мультимодальна доставка" },
      ],
    },
    {
      key: "euWorld",
      href: `/${locale}/delivery/eu-world`,
      title: delivery.euWorld || "Доставка в країни ЄС та світу",
      description: locale === "ua"
        ? "Доставка вантажів в країни Європейського Союзу та інші країни світу. Широкий спектр логістичних рішень для міжнародної торгівлі."
        : locale === "ru"
        ? "Доставка грузов в страны Европейского Союза и другие страны мира. Широкий спектр логистических решений для международной торговли."
        : "Delivery of cargo to European Union countries and other countries around the world. A wide range of logistics solutions for international trade.",
      image: "/delivery/eu-world.svg",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
      subLinks: [
        { key: "fba", href: `/${locale}/delivery/eu-world`, label: delivery.fba || "FBA" },
        { key: "ddp", href: `/${locale}/delivery/eu-world`, label: delivery.ddp || "DDP/DDU" },
        { key: "express", href: `/${locale}/delivery/eu-world`, label: delivery.express || "Експрес доставка" },
        { key: "portToPort", href: `/${locale}/delivery/eu-world`, label: delivery.portToPort || "Порт-до-порту" },
        { key: "crossBorder", href: `/${locale}/delivery/eu-world`, label: delivery.crossBorder || "Міжкордонна доставка" },
      ],
    },
    {
      key: "international",
      href: `/${locale}/delivery/international`,
      title: delivery.international || "Міжнародне перевезення та експедирування",
      description: locale === "ua"
        ? "Ми забезпечуємо повний комплекс логістичних рішень для міжнародних вантажних перевезень, поєднуючи надійність, прозорість та індивідуальний підхід."
        : locale === "ru"
        ? "Мы обеспечиваем полный комплекс логистических решений для международных грузовых перевозок, сочетая надежность, прозрачность и индивидуальный подход."
        : "We provide a full range of logistics solutions for international cargo transportation, combining reliability, transparency and an individual approach.",
      image: "/delivery/international.svg",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      subLinks: [
        { key: "seaContainer", href: `/${locale}/delivery/international`, label: delivery.seaContainer || "Морські контейнерні перевезення (FCL / LCL)" },
        { key: "airCargo", href: `/${locale}/delivery/international`, label: delivery.airCargo || "Авіаційні вантажні перевезення (FCL / LCL)" },
        { key: "railCargo", href: `/${locale}/delivery/international`, label: delivery.railCargo || "Залізничні вантажні перевезення FCL / LCL" },
        { key: "roadCargo", href: `/${locale}/delivery/international`, label: delivery.roadCargo || "Автомобільні вантажні перевезення (FTL / LTL)" },
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
          <div className="relative mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {nav.delivery || "Доставка"}
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {deliveryLinks.map((link) => {
              return (
                <div
                  key={link.key}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-gray-200 bg-gray-50 transition-all duration-300 hover:border-teal-300 hover:bg-[#E8FDF8] hover:shadow-md"
                >
                  
                  {/* Контент */}
                  <div className="relative z-10 flex flex-col h-full p-8">
                    {/* Іконка */}
                    <div className="mb-6 flex justify-center transition-transform duration-300 group-hover:scale-105">
                      <div className="relative h-24 w-24">
                        <Image
                          src={link.image}
                          alt={link.title}
                          fill
                          className="object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </div>
                    </div>
                    
                    {/* Заголовок */}
                    <Link href={link.href}>
                      <h3 className="text-xl font-bold text-gray-700 mb-3 transition-colors duration-300 group-hover:text-teal-600 cursor-pointer">
                        {formatDeliveryTitle(link.key, locale, link.title)}
                      </h3>
                    </Link>
                    
                    {/* Опис */}
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                      {link.description}
                    </p>
                    
                    {/* Підпосилання */}
                    <div className="space-y-2 mb-6 flex-grow">
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
                    
                    {/* Стрілка - зафіксована знизу */}
                    <Link 
                      href={link.href} 
                      className="group/btn mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 transition-all duration-200 ease-out hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800"
                    >
                      <span>
                        {locale === "ua" ? "Дізнатися більше" : locale === "ru" ? "Узнать больше" : "Learn more"}
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
      <CostCalculationSection locale={locale} />
      <SiteFooter locale={locale} />
      <ScrollToTop />
      <ContactButton locale={locale} />
    </div>
  );
}
