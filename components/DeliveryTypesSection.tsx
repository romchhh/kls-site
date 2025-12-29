"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { ArrowRight, Clock, Globe, Package, HandCoins, Warehouse, DollarSign, MapPin, Scale, Home, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type DeliveryTypesSectionProps = {
  locale: Locale;
};

export function DeliveryTypesSection({ locale }: DeliveryTypesSectionProps) {
  // Безпечне отримання перекладів з fallback
  const safeLocale: Locale = locale && ["ua", "ru", "en"].includes(locale) ? locale : "ua";
  const t = getTranslations(safeLocale);
  const content = t?.deliveryTypes;
  
  // Якщо контент відсутній, не рендеримо компонент
  if (!content || !content.types || content.types.length === 0) {
    return null;
  }
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle scroll position and navigation buttons
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    container.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState(); // Initial check

    // Update on resize
    const handleResize = () => {
      updateScrollState();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
    };
  }, [content?.types?.length]);


  // Мапа іконок для типів доставки
  const iconMap: Record<string, string> = {
    air: "/Group.png",
    sea: "/Group-1.png",
    rail: "/Group-2.png",
    multimodal: "/Group-3.png",
  };

  // Мапа іконок для features
  const featureIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    clock: Clock,
    mapPin: MapPin,
    package: Package,
    handCoins: HandCoins,
    warehouse: Warehouse,
    dollar: DollarSign,
    scale: Scale,
    home: Home,
    users: Users,
  };

  const getTypeHref = (key: string) => {
    // Усі типи ведуть на основну сторінку доставки в Україну
    return `/${locale}/delivery/ukraine-turnkey`;
  };

  const scrollTo = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.querySelector("a") as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible bg-white py-24 md:py-32"
      style={{ overflow: 'visible' }}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ overflow: 'visible' }}>
        {/* Header Section */}
        <div
          className={`relative mx-auto mb-16 max-w-3xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
            {content.subtitle}
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative overflow-visible" style={{ overflow: 'visible', overflowY: 'visible' }}>
          {/* Cards - Scroll on mobile, Grid on desktop */}
          <div
            ref={scrollContainerRef}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-x-visible pb-4 pt-20 sm:pt-24 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollPaddingLeft: '1rem',
              scrollPaddingRight: '1rem',
            }}
          >
            {content.types.map((type, index) => (
              <Link
                key={type.key}
                href={getTypeHref(type.key)}
                className={`group relative flex min-h-[380px] sm:min-h-[420px] w-[280px] sm:w-auto flex-shrink-0 sm:flex-shrink flex-col overflow-visible rounded-2xl sm:rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg snap-center first:ml-4 last:mr-4 sm:first:ml-0 sm:last:mr-0 ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={
                  isVisible 
                    ? { animationDelay: `${0.4 + index * 0.1}s`, overflow: 'visible', overflowY: 'visible', overflowX: 'visible' } 
                    : { opacity: 0, overflow: 'visible', overflowY: 'visible', overflowX: 'visible' }
                }
              >
                {/* Icon - positioned absolutely at the top, extending beyond block */}
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-30 flex justify-center">
                  <div className={`flex items-center justify-center ${
                    type.key === 'rail' 
                      ? 'h-52 w-52 sm:h-56 sm:w-56' 
                      : 'h-44 w-44 sm:h-48 sm:w-48'
                  }`}>
                    <Image
                      src={iconMap[type.key] || "/Group.png"}
                      alt={type.title}
                      width={256}
                      height={256}
                      className={`object-contain w-full h-full ${
                        type.key === 'rail' ? 'scale-110' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6 md:p-8 pt-44 sm:pt-52">
                  <div className="flex flex-col mt-4 sm:mt-32 flex-1 min-h-0">

                    {/* Title */}
                    <h3 className="mb-3 sm:mb-4 text-center text-xl sm:text-lg md:text-xl font-bold leading-tight text-gray-900 break-words hyphens-auto">
                      {type.title}
                    </h3>

                    {/* Features - only first and last (2 items) */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4 relative">
                      {type.features.filter((_, idx) => idx === 0 || idx === type.features.length - 1).map((feature, featureIndex) => {
                        const FeatureIcon = featureIconMap[feature.icon] || Package;
                        
                        return (
                          <div 
                            key={featureIndex} 
                            className="relative flex flex-1 flex-col items-center justify-start min-w-0"
                          >
                            <div className="flex flex-1 flex-col items-center px-1 sm:px-2 md:px-4 w-full">
                              {/* Icon */}
                              <div className="mb-2 sm:mb-3 flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center text-teal-600 md:h-12 md:w-12 flex-shrink-0">
                                <FeatureIcon className="h-7 w-7 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                              </div>
                              
                              {/* Text */}
                              <p className="text-center text-xs sm:text-[11px] md:text-xs font-normal leading-relaxed text-slate-700 break-words hyphens-auto w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {feature.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {/* Vertical divider between features - dashed */}
                      <div 
                        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                        style={{
                          borderLeft: '1px dashed rgb(209, 213, 219)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <div className="mt-auto sm:mt-4 md:mt-6">
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 transition-all duration-200 ease-out group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-800">
                      <span>{content.learnMore}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation buttons під елементами скролу - Mobile only */}
          <div className="sm:hidden mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-600 shadow-sm transition-all duration-300 ease-out hover:bg-teal-50 hover:border-teal-300 hover:shadow-md hover:-translate-x-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0"
              aria-label="Попередні види доставки"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-600 shadow-sm transition-all duration-300 ease-out hover:bg-teal-50 hover:border-teal-300 hover:shadow-md hover:translate-x-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0"
              aria-label="Наступні види доставки"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
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

