"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Globe, Package, HandCoins, Warehouse, DollarSign, MapPin, Scale, Home, Users } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
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

    const cards = container.querySelectorAll("a");
    
    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Find the card that is most visible in the viewport
      let maxVisible = 0;
      let maxIndex = 0;
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate how much of the card is visible
        const cardLeft = rect.left;
        const cardRight = rect.right;
        const containerLeft = containerRect.left;
        const containerRight = containerRect.right;
        
        const visibleLeft = Math.max(0, cardLeft - containerLeft);
        const visibleRight = Math.max(0, containerRight - cardRight);
        const visibleWidth = Math.min(rect.width, containerRect.width) - visibleLeft - visibleRight;
        
        if (visibleWidth > maxVisible) {
          maxVisible = visibleWidth;
          maxIndex = index;
        }
      });
      
      setCurrentIndex(maxIndex);
    };

    // Use requestAnimationFrame for smoother updates
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollState);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollState(); // Initial check

    // Update on resize
    const handleResize = () => {
      updateScrollState();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [content.types.length]);

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
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {/* Cards Container with Navigation */}
        <div className="relative">
          {/* Left Arrow - Mobile only */}
          <button
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-teal-600" />
          </button>

          {/* Right Arrow - Mobile only */}
          <button
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-teal-600" />
          </button>

          {/* Cards Grid - Horizontal scroll on mobile, grid on desktop */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-2 md:items-stretch md:overflow-x-visible md:pb-0 md:snap-none scrollbar-hide"
            style={{
              scrollPaddingLeft: '1rem',
              scrollPaddingRight: '1rem',
            }}
          >
            {content.types.map((type, index) => (
              <Link
                key={type.key}
                href={getTypeHref(type.key)}
                className={`group relative flex min-h-[300px] sm:min-h-[340px] w-[calc(100%-2rem)] flex-shrink-0 snap-center flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg md:min-w-0 md:w-auto md:h-full md:snap-none first:ml-4 last:mr-4 md:first:ml-0 md:last:mr-0 ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={
                  isVisible ? { animationDelay: `${0.4 + index * 0.1}s` } : { opacity: 0 }
                }
              >
                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col">
                    {/* Icon in circle with blue background and border */}
                    <div className="mb-3 sm:mb-4 flex justify-center">
                      <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-50 md:h-44 md:w-44">
                        <Image
                          src={iconMap[type.key] || "/Group.png"}
                          alt={type.title}
                          width={256}
                          height={256}
                          className="object-contain w-20 h-20 sm:w-24 sm:h-24 md:w-auto md:h-auto"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 sm:mb-4 text-center text-lg sm:text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                      {type.title}
                    </h3>

                    {/* Features (compact, без розділювачів) */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                      {type.features.map((feature, featureIndex) => {
                        const FeatureIcon = featureIconMap[feature.icon] || Package;
                        
                        return (
                          <div 
                            key={featureIndex} 
                            className="relative flex flex-1 flex-col items-center justify-start"
                          >
                            <div className="flex flex-1 flex-col items-center px-1 sm:px-2 md:px-4">
                              {/* Icon */}
                              <div className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-teal-600 md:h-12 md:w-12">
                                <FeatureIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                              </div>
                              
                              {/* Text */}
                              <p className="text-center text-[10px] sm:text-xs font-normal leading-tight text-slate-700 md:text-sm">
                                {feature.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <div className="mt-3 sm:mt-4 flex justify-center">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-teal-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-teal-700 transition-all duration-200 ease-out group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-800 md:px-5 md:py-2.5">
                      <span>{content.learnMore}</span>
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Indicators (Dots) - Mobile only */}
          <div className="mt-6 flex justify-center gap-2 md:hidden">
            {content.types.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (!container) return;
                  const firstCard = container.querySelector("a") as HTMLElement;
                  if (!firstCard) return;
                  
                  const cardWidth = firstCard.offsetWidth;
                  const gap = 16; // gap-4 = 16px
                  const scrollPosition = index * (cardWidth + gap);
                  
                  container.scrollTo({
                    left: scrollPosition,
                    behavior: "smooth",
                  });
                }}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-teal-600 scale-125"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

