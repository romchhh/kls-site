"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { 
  ArrowRight
} from "lucide-react";

type ServicesSectionProps = {
  locale: Locale;
};

export function ServicesSection({ locale }: ServicesSectionProps) {
  const t = getTranslations(locale);
  const servicesContent = t?.services;
  
  if (!servicesContent) {
    return null;
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
      }

    return () => {
      if (scrollContainerRef.current) {
        observer.unobserve(scrollContainerRef.current);
      }
    };
  }, []);

  const iconMap: Record<string, string> = {
    payments: "/money-transfers.svg",
    warehousing: "/warehousing-services.svg",
    sourcing: "/sourcing-service.svg",
    insurance: "/cargo-insurance.svg",
    customs: "/customs-brokerage.svg",
    forwarding: "/cargo-forwarding.svg",
    local: "/local-delivery.svg",
  };

  const whiteIconMap: Record<string, string> = {
    payments: "/money-transfers-white.svg",
    warehousing: "/warehousing-services-white.svg",
    sourcing: "/sourcing-service-white.svg",
    insurance: "/cargo-insurance-white.svg",
    customs: "/customs-brokerage-white.svg",
    forwarding: "/cargo-forwarding-white.svg",
    local: "/local-delivery-white.svg",
  };

  const services = [
    {
      key: "payments",
      title: servicesContent.payments,
      description: locale === "ua"
        ? "Швидкі, безпечні та вигідні грошові перекази в Китай"
        : locale === "ru"
        ? "Быстрые, безопасные и выгодные денежные переводы в Китай"
        : "Fast, secure and profitable money transfers to China",
      href: `/${locale}/services/payments`,
      cost: locale === "ua" ? "Від 0.5%" : locale === "ru" ? "От 0.5%" : "From 0.5%",
      time: locale === "ua" ? "До 12 годин" : locale === "ru" ? "До 12 часов" : "Up to 12 hours",
    },
    {
      key: "warehousing",
      title: servicesContent.warehousing,
      description: locale === "ua"
        ? "Комплексні складські послуги для зберігання та обробки вантажів"
        : locale === "ru"
        ? "Комплексные складские услуги для хранения и обработки грузов"
        : "Comprehensive warehousing services for storage and cargo processing",
      href: `/${locale}/services/warehousing`,
      cost: locale === "ua" ? "Від 0.5$/кг/міс" : locale === "ru" ? "От 0.5$/кг/мес" : "From $0.5/kg/month",
      time: locale === "ua" ? "Без обмежень" : locale === "ru" ? "Без ограничений" : "Unlimited",
    },
    {
      key: "sourcing",
      title: servicesContent.sourcing,
      description: locale === "ua"
        ? "Професійний пошук та закупівля товарів в Китаї та Кореї"
        : locale === "ru"
        ? "Профессиональный поиск и закупка товаров в Китае и Корее"
        : "Professional search and procurement of goods in China and Korea",
      href: `/${locale}/services/sourcing`,
      cost: locale === "ua" ? "Від 1000$ за партію" : locale === "ru" ? "От 1000$ за партию" : "From $1000 per batch",
      time: locale === "ua" ? "7-14 днів" : locale === "ru" ? "7-14 дней" : "7-14 days",
    },
    {
      key: "insurance",
      title: servicesContent.insurance,
      description: locale === "ua"
        ? "Повне страхування вантажу на всьому маршруті доставки"
        : locale === "ru"
        ? "Полное страхование груза на всем маршруте доставки"
        : "Complete insurance coverage for cargo throughout the delivery route",
      href: `/${locale}/services/insurance`,
      cost: locale === "ua" ? "Від 0.3% від вартості" : locale === "ru" ? "От 0.3% от стоимости" : "From 0.3% of value",
      time: locale === "ua" ? "На весь період" : locale === "ru" ? "На весь период" : "For entire period",
    },
    {
      key: "customs",
      title: servicesContent.customs,
      description: locale === "ua"
        ? "Повний комплекс митно-брокерських послуг"
        : locale === "ru"
        ? "Полный комплекс таможенно-брокерских услуг"
        : "Full range of customs brokerage services",
      href: `/${locale}/services/customs`,
      cost: locale === "ua" ? "Від 50$ за декларацію" : locale === "ru" ? "От 50$ за декларацию" : "From $50 per declaration",
      time: locale === "ua" ? "1-3 дні" : locale === "ru" ? "1-3 дня" : "1-3 days",
    },
    {
      key: "forwarding",
      title: servicesContent.forwarding,
      description: locale === "ua"
        ? "Експедирування вантажів з повним супроводом"
        : locale === "ru"
        ? "Экспедирование грузов с полным сопровождением"
        : "Cargo forwarding with full support",
      href: `/${locale}/services/forwarding`,
      cost: locale === "ua" ? "Індивідуально" : locale === "ru" ? "Индивидуально" : "Individual",
      time: locale === "ua" ? "За запитом" : locale === "ru" ? "По запросу" : "On request",
    },
    {
      key: "local",
      title: servicesContent.local,
      description: locale === "ua"
        ? "Швидка та надійна локальна доставка по всьому Китаю"
        : locale === "ru"
        ? "Быстрая и надежная локальная доставка по всему Китаю"
        : "Fast and reliable local delivery across China",
      href: `/${locale}/services/local`,
      cost: locale === "ua" ? "Індивідуально" : locale === "ru" ? "Индивидуально" : "Individual",
      time: locale === "ua" ? "1-3 дні" : locale === "ru" ? "1-3 дня" : "1-3 days",
    },
  ];

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll("a")) as HTMLElement[];
    if (cards.length === 0) return;

    // Find the first card that is at least partially visible
    const containerRect = container.getBoundingClientRect();
    let currentIndex = 0;
    
    for (let i = 0; i < cards.length; i++) {
      const cardRect = cards[i].getBoundingClientRect();
      if (cardRect.left >= containerRect.left) {
        currentIndex = i;
        break;
      }
    }

    // Scroll to previous card
    if (currentIndex > 0) {
      cards[currentIndex - 1].scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest",
        inline: "center"
      });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll("a")) as HTMLElement[];
    if (cards.length === 0) return;

    // Find the last card that is at least partially visible
    const containerRect = container.getBoundingClientRect();
    let currentIndex = cards.length - 1;
    
    for (let i = cards.length - 1; i >= 0; i--) {
      const cardRect = cards[i].getBoundingClientRect();
      if (cardRect.right <= containerRect.right) {
        currentIndex = i;
        break;
      }
    }

    // Scroll to next card
    if (currentIndex < cards.length - 1) {
      cards[currentIndex + 1].scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest",
        inline: "center"
      });
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gray-100 pt-16 pb-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`relative mx-auto mb-16 max-w-3xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {servicesContent.mainTitle}
            </h2>
          <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
              {servicesContent.mainDescription}
            </p>
        </div>

        {/* Services Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollPaddingLeft: '1rem',
            scrollPaddingRight: '1rem',
          }}
        >
          {/* All Services Card */}
          <Link
            href={`/${locale}/services`}
            className={`group relative flex-shrink-0 w-[320px] rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 p-9 text-white shadow-none transition-all duration-500 hover:scale-105 snap-center first:ml-4 last:mr-4 sm:first:ml-0 sm:last:mr-0 ${
              isVisible ? 'animate-slide-in-bottom' : ''
            }`}
            style={isVisible ? { animationDelay: '0.2s' } : { opacity: 0 }}
          >
            <div className="flex h-full flex-col justify-between min-h-[320px]">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                  {locale === "ua" ? "Всі послуги" : locale === "ru" ? "Все услуги" : "All services"}
                </h3>
                {/* Білі іконки послуг */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {services.slice(0, 7).map((service) => (
                    <div key={service.key} className="flex justify-center">
                      <div className="relative h-20 w-20">
                        <Image
                          src={whiteIconMap[service.key] || "/money-transfers-white.svg"}
                          alt={service.title}
                          fill
                          className="object-contain opacity-90"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 transition-all duration-200 ease-out group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-800">
                  <span>{locale === "ua" ? "Всі послуги" : locale === "ru" ? "Все услуги" : "All services"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Service Cards */}
          {services.map((service, index) => {
            return (
              <Link
                key={service.key}
                href={service.href}
                className={`group relative flex-shrink-0 w-[calc(100%-2rem)] sm:w-[380px] rounded-3xl border-2 border-gray-200 bg-white p-5 sm:p-7 shadow-none transition-all duration-500 hover:border-teal-300 hover:scale-105 hover:-translate-y-1 snap-center first:ml-4 last:mr-4 sm:first:ml-0 sm:last:mr-0 ${
                  isVisible ? 'animate-slide-in-bottom' : ''
                }`}
                style={isVisible ? { animationDelay: `${0.3 + index * 0.1}s` } : { opacity: 0 }}
              >
                <div className="flex h-full flex-col min-h-[280px] sm:min-h-[320px]">
                  {/* Icon */}
                  <div className="mb-4 sm:mb-6 flex justify-center transition-transform duration-300 group-hover:scale-105">
                    <div className="relative h-24 w-24">
                      <Image
                        src={iconMap[service.key] || "/money-transfers.svg"}
                        alt={service.title}
                        fill
                        className="object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
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
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 transition-all duration-200 ease-out group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-800">
                      <span>{servicesContent.readMore}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Navigation buttons під елементами скролу */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={scrollLeft}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-600 shadow-sm transition-all duration-300 ease-out hover:bg-teal-50 hover:border-teal-300 hover:shadow-md hover:-translate-x-0.5"
            aria-label="Попередні послуги"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            onClick={scrollRight}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-600 shadow-sm transition-all duration-300 ease-out hover:bg-teal-50 hover:border-teal-300 hover:shadow-md hover:translate-x-0.5"
            aria-label="Наступні послуги"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
