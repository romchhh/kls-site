"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

  const scrollTo = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.querySelector("a")?.offsetWidth || 0;
    const gap = 24;
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
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
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
          <p className="text-base font-normal leading-relaxed text-slate-600 md:text-lg">
            {content.subtitle}
          </p>
          
          {/* Arrow from title to cards */}
          <div className="mt-8 flex justify-center">
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={isVisible ? { animationDelay: "0.3s" } : {}}
            >
              <Image
                src="/Arrow.png"
                alt=""
                width={120}
                height={120}
                className="opacity-40"
              />
            </div>
          </div>
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
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-2 md:overflow-x-visible md:pb-0 md:snap-none scrollbar-hide -mx-4 md:mx-0"
          >
            {content.types.map((type, index) => (
              <Link
                key={type.key}
                href={`/${locale}/delivery/${type.key}`}
                className={`group relative flex min-h-[300px] w-[78vw] flex-shrink-0 snap-start flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl md:min-w-0 md:w-auto md:snap-none ${
                  index === 0 ? "ml-6" : ""
                } ${
                  index === content.types.length - 1 ? "mr-4" : ""
                } ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={
                  isVisible ? { animationDelay: `${0.4 + index * 0.1}s` } : { opacity: 0 }
                }
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={type.image}
                    alt={type.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    style={{
                      filter: "brightness(0.85)",
                    }}
                  />
                  {/* Blur overlay on hover */}
                  <div className="absolute inset-0 delivery-card-blur" />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-5">
                  {/* Title */}
                  <div>
                    <h3 className="mb-3 break-words text-lg font-black leading-tight text-white md:mb-4 md:text-2xl lg:text-3xl">
                      {type.title}
                    </h3>

                    {/* Features List */}
                    <div className="space-y-2.5">
                      {type.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-2.5"
                        >
                          <div className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-white" />
                          <p className="text-sm font-normal leading-relaxed text-white/95 md:text-base">
                            {feature.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learn More Button - appears on hover */}
                  <div className="mt-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <div className="flex items-center gap-2.5 rounded-xl bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-900 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:gap-3 md:text-base md:px-6 md:py-3">
                      <span>{content.learnMore}</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 md:w-4 md:h-4" />
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
                  const gap = 24;
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

