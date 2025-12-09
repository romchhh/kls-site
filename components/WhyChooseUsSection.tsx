"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Shield, Eye, Zap, DollarSign, FileText, User, Headphones, Globe } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";
import { ContactQuickModal } from "./ContactQuickModal";

type WhyChooseUsSectionProps = {
  locale: Locale;
};

// Icon mapping for features
const featureIcons = [
  Shield,      // Надійність
  Eye,         // Прозорість
  Zap,         // Швидка доставка
  DollarSign,  // Доступні ціни
  FileText,    // Митне оформлення
  User,        // Персональний підхід
  Headphones,  // 24/7 Підтримка
  Globe,       // Глобальна мережа
];

export function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  // Безпечне отримання перекладів з fallback
  const safeLocale: Locale = locale && ["ua", "ru", "en"].includes(locale) ? locale : "ua";
  const t = getTranslations(safeLocale);
  const content = t?.whyChooseUs;
  
  // Якщо контент відсутній, не рендеримо компонент
  if (!content || !content.features || content.features.length === 0) {
    return null;
  }
  // Use all features for rotation
  const features = content.features;
  // Each card starts with a different feature index
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeatureIndexes, setCurrentFeatureIndexes] = useState<number[]>([0, 1, 2]);
  const [isFlipping, setIsFlipping] = useState<boolean[]>([false, false, false]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRefs = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

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

  useEffect(() => {
    if (!isVisible) return;

    const flipFeature = (blockIdx: number) => {
      setIsFlipping((prev) => {
        const newFlipping = [...prev];
        newFlipping[blockIdx] = true;
        return newFlipping;
      });

      setTimeout(() => {
        setCurrentFeatureIndexes((prev) => {
          const newIndexes = [...prev];
          // Each card cycles through all features independently
          newIndexes[blockIdx] = (prev[blockIdx] + 1) % features.length;
          return newIndexes;
        });
        
        setIsFlipping((prev) => {
          const newFlipping = [...prev];
          newFlipping[blockIdx] = false;
          return newFlipping;
        });
      }, 300); // Half of flip animation duration
    };

    // Each card flips independently with different intervals
    const intervals = [3500, 4000, 4500]; // Different intervals for each card

    const initialTimeouts = intervals.map((interval, index) => {
      return setTimeout(() => {
        const changeFeature = () => {
          flipFeature(index);
        };
        intervalRefs.current[index] = setInterval(changeFeature, interval);
      }, 2000 + index * 500); // Stagger initial delays
    });

    return () => {
      initialTimeouts.forEach(timeout => clearTimeout(timeout));
      intervalRefs.current.forEach(interval => {
        if (interval) {
          clearInterval(interval);
        }
      });
    };
  }, [isVisible, features.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-24 md:py-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-100/30 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-20 h-96 w-96 translate-x-1/2 rounded-full bg-amber-100/20 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div
          className={`mx-auto mb-20 max-w-3xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <div className="mb-4 inline-flex items-center rounded-full border-2 border-teal-200/60 bg-white/80 backdrop-blur-sm px-6 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-teal-600 shadow-lg">
            {content.title}
          </div>
          <h2 className="mb-6 mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {content.title}
          </h2>
          <p className="mb-8 text-lg font-normal leading-relaxed text-slate-600 md:text-xl">
            {content.subtitle}
          </p>
          
          {/* Arrow */}
          <div className="mt-8 flex justify-center">
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={isVisible ? { animationDelay: "0.3s" } : {}}
            >
              <Image
                src="/Arrow 01.png"
                alt=""
                width={120}
                height={120}
                className="opacity-30"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Left side - Single large image block */}
          <div
            className={`relative flex flex-col ${
              isVisible ? "animate-slide-in-left" : ""
            }`}
            style={isVisible ? { animationDelay: "0.3s" } : { opacity: 0 }}
          >
            <div className="group relative flex h-full min-h-[600px] overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50 shadow-2xl transition-all duration-500 hover:border-teal-200/40 hover:shadow-3xl">
              {/* Blurred background image */}
              <div className="absolute inset-0">
                <Image
                  src="/hero-image-1.jpg"
                  alt="KLS Logistics"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  style={{
                    filter: "blur(12px) brightness(0.6) saturate(0.85)",
                    transform: "scale(1.15)",
                  }}
                />
              </div>
              
              {/* Gradient overlay with animated shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15 transition-opacity duration-500 group-hover:from-black/85 group-hover:via-black/45" />
              
              {/* Animated shine effect */}
              <div className="pointer-events-none absolute -inset-[50%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100 group-hover:animate-[shimmer_3s_ease-in-out_infinite]" />
              
              {/* Content overlay */}
              <div className="relative z-10 flex h-full flex-col justify-center p-10 md:p-12">
                <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
                  KLS Logistics
                </div>
                <h3 className="mb-3 text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                  {content.imageLabels.international}
                </h3>
                <p className="mb-8 text-lg font-normal leading-relaxed text-white/95 drop-shadow-md md:text-xl">
                  {content.cardText}
                </p>
                
                {/* Contact button with enhanced styling */}
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="group/btn relative inline-block w-fit overflow-hidden rounded-2xl bg-white/95 px-8 py-4 text-base font-semibold text-slate-900 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-[1.02] hover:shadow-2xl md:px-10 md:py-4.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {content.contactButton}
                    <svg className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Three feature cards with dynamic change */}
          <div className="flex h-full flex-col justify-center space-y-6">
            {[0, 1, 2].map((cardIndex) => {
              const currentIndex = currentFeatureIndexes[cardIndex];
              const currentFeature = features[currentIndex];
              const nextIndex = (currentIndex + 1) % features.length;
              const nextFeature = features[nextIndex];
              const flipping = isFlipping[cardIndex];

              return (
                <div
                  key={cardIndex}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white via-white to-slate-50/50 p-8 shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-teal-200/60 hover:shadow-2xl hover:-translate-y-1 ${
                    isVisible ? "animate-slide-in-right" : ""
                  }`}
                  style={
                    isVisible
                      ? { animationDelay: `${0.4 + cardIndex * 0.1}s` }
                      : { opacity: 0 }
                  }
                >
                  {/* Animated gradient accent on left */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 via-teal-400 to-teal-600 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
                  
                  {/* Decorative corner element */}
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Icon in top right with flip animation */}
                  <div className="absolute top-6 right-6">
                    <div
                      className={`flip-container ${
                        flipping ? "flip" : ""
                      }`}
                      style={{ width: "64px", height: "64px" }}
                    >
                      <div className="flip-front">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-600 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-teal-100 group-hover:to-teal-200/50 group-hover:text-teal-700 group-hover:shadow-lg">
                          {(() => {
                            const CurrentIcon = featureIcons[currentIndex % featureIcons.length];
                            return <CurrentIcon size={40} strokeWidth={2.5} />;
                          })()}
                        </div>
                      </div>
                      <div className="flip-back">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-teal-600 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-teal-100 group-hover:to-teal-200/50 group-hover:text-teal-700 group-hover:shadow-lg">
                          {(() => {
                            const NextIcon = featureIcons[nextIndex % featureIcons.length];
                            return <NextIcon size={40} strokeWidth={2.5} />;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content with smooth flip animation */}
                  <div className="relative min-h-[140px] pr-20">
                    <div
                      className={`flip-container ${
                        flipping ? "flip" : ""
                      }`}
                    >
                      <div className="flip-front">
                        <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-teal-700 md:text-3xl">
                          {currentFeature.title}
                        </h3>
                        <p className="text-base font-normal leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700 md:text-lg">
                          {currentFeature.description}
                        </p>
                      </div>
                      <div className="flip-back">
                        <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-teal-700 md:text-3xl">
                          {nextFeature.title}
                        </h3>
                        <p className="text-base font-normal leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700 md:text-lg">
                          {nextFeature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle glow effect on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-500/0 via-teal-500/0 to-teal-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactQuickModal 
        locale={locale} 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
}
