"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { 
  DollarSign, 
  Package, 
  Search, 
  Shield, 
  Truck, 
  FileText, 
  ArrowRight,
  Tag,
  Clock
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
      icon: DollarSign,
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
      icon: Package,
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
      icon: Search,
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
      icon: Shield,
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
      icon: FileText,
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
      icon: Truck,
      cost: locale === "ua" ? "Індивідуально" : locale === "ru" ? "Индивидуально" : "Individual",
      time: locale === "ua" ? "За запитом" : locale === "ru" ? "По запросу" : "On request",
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gray-100 pt-16 pb-20"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-10 flex flex-col items-center text-center gap-4 ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <div className="max-w-3xl">
            <h2 className="mb-3 text-3xl md:text-5xl font-bold text-gray-900">
              {servicesContent.mainTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {servicesContent.mainDescription}
            </p>
          </div>
        </div>

        {/* Services Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* All Services Card */}
          <Link
            href={`/${locale}/services`}
            className={`group relative flex-shrink-0 w-[380px] rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 p-9 text-white shadow-none transition-all duration-500 hover:scale-105 snap-start ${
              isVisible ? 'animate-slide-in-bottom' : ''
            }`}
            style={isVisible ? { animationDelay: '0.2s' } : { opacity: 0 }}
          >
            <div className="flex h-full flex-col justify-between min-h-[320px]">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                  {locale === "ua" ? "Всі послуги" : locale === "ru" ? "Все услуги" : "All services"}
                </h3>
                <p className="text-white/90 text-base">
                  {locale === "ua" ? "Переглянути всі наші послуги" : locale === "ru" ? "Посмотреть все наши услуги" : "View all our services"}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-end">
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-3">
                  <ArrowRight className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </Link>

          {/* Service Cards */}
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.key}
                href={service.href}
                className={`group relative flex-shrink-0 w-[380px] rounded-3xl border-2 border-gray-200 bg-white p-7 shadow-none transition-all duration-500 hover:border-teal-300 hover:scale-105 hover:-translate-y-1 snap-start ${
                  isVisible ? 'animate-slide-in-bottom' : ''
                }`}
                style={isVisible ? { animationDelay: `${0.3 + index * 0.1}s` } : { opacity: 0 }}
              >
                <div className="flex h-full flex-col min-h-[320px]">
                  {/* Icon */}
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:from-teal-100 group-hover:to-teal-200">
                    <Icon className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 leading-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-5 text-base text-gray-600 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  {/* Вартість (терміни прибрано за побажанням) */}
                  <div className="mb-6 space-y-3">
                    {service.cost && (
                      <div className="flex items-center gap-3 text-sm md:text-base">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
                          <Tag className="h-4 w-4 text-teal-600 md:h-5 md:w-5" />
                        </div>
                        <span className="text-gray-700 font-semibold">
                          {locale === "ua"
                            ? "Вартість:"
                            : locale === "ru"
                            ? "Стоимость:"
                            : "Cost:"}{" "}
                          <span className="text-teal-600">{service.cost}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Кнопка «Детальніше» у стилі інших CTA */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-2.5 text-sm md:text-base font-semibold text-teal-700 transition-all duration-200 ease-out group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-800">
                      <span>{servicesContent.readMore}</span>
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
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
