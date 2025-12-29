"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Zap } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";
import { ContactQuickModal } from "./ContactQuickModal";

type WhyChooseUsSectionProps = {
  locale: Locale;
};

// Icon mapping for features - using SVG files from why-choose-us folder
// Supports multiple languages
const featureIconMap: Record<string, string> = {
  // Ukrainian
  "Надійність": "/why-choose-us/reliability.svg",
  "Прозорість": "/why-choose-us/transparency.svg",
  "Швидка доставка": "/why-choose-us/fast-delivery.svg",
  "Доступні ціни": "/why-choose-us/affordable-prices.svg",
  "Митне оформлення": "/why-choose-us/customs-clearance.svg",
  "Персональний підхід": "/why-choose-us/personal-approach.svg",
  "24/7 Підтримка": "/why-choose-us/support-24-7.svg",
  "Глобальна мережа": "/why-choose-us/global-network.svg",
  "Гарантія найкращої ціни": "/why-choose-us/best-price-guarantee.svg",
  "Персональний менеджер": "/why-choose-us/personal-manager.svg",
  "Швидкий розрахунок": "/why-choose-us/quick-calculation.svg",
  "Якість": "/why-choose-us/quality.svg",
  // Russian
  "Надежность": "/why-choose-us/reliability.svg",
  "Прозрачность": "/why-choose-us/transparency.svg",
  "Быстрая доставка": "/why-choose-us/fast-delivery.svg",
  "Доступные цены": "/why-choose-us/affordable-prices.svg",
  "Таможенное оформление": "/why-choose-us/customs-clearance.svg",
  "Персональный подход": "/why-choose-us/personal-approach.svg",
  "Поддержка 24/7": "/why-choose-us/support-24-7.svg",
  "Глобальная сеть": "/why-choose-us/global-network.svg",
  "Гарантия лучшей цены": "/why-choose-us/best-price-guarantee.svg",
  "Персональный менеджер": "/why-choose-us/personal-manager.svg",
  "Быстрый расчет": "/why-choose-us/quick-calculation.svg",
  "Качество": "/why-choose-us/quality.svg",
  // English
  "Reliability": "/why-choose-us/reliability.svg",
  "Transparency": "/why-choose-us/transparency.svg",
  "Fast Delivery": "/why-choose-us/fast-delivery.svg",
  "Affordable Prices": "/why-choose-us/affordable-prices.svg",
  "Customs Clearance": "/why-choose-us/customs-clearance.svg",
  "Personal Approach": "/why-choose-us/personal-approach.svg",
  "24/7 Support": "/why-choose-us/support-24-7.svg",
  "Global Network": "/why-choose-us/global-network.svg",
  "Best Price Guarantee": "/why-choose-us/best-price-guarantee.svg",
  "Personal Manager": "/why-choose-us/personal-manager.svg",
  "Quick Calculation": "/why-choose-us/quick-calculation.svg",
  "Quality": "/why-choose-us/quality.svg",
};


export function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  const t = getTranslations(locale);
  const content = t?.whyChooseUs;
  
  if (!content || !content.features || content.features.length === 0) {
    return null;
  }

  const features = content.features;
  const [isVisible, setIsVisible] = useState(false);
  // Initialize with 3 different indexes
  const getInitialIndexes = () => {
    if (features.length < 3) return [0, 0, 0];
    return [0, 1, 2];
  };
  const [currentFeatureIndexes, setCurrentFeatureIndexes] = useState<number[]>(getInitialIndexes());
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

    const slideFeature = (blockIdx: number) => {
      setCurrentFeatureIndexes((prev) => {
        const newIndexes = [...prev];
        // Find next index that is different from other two cards
        let nextIndex = (prev[blockIdx] + 1) % features.length;
        let attempts = 0;
        while ((nextIndex === prev[0] || nextIndex === prev[1] || nextIndex === prev[2]) && attempts < features.length) {
          nextIndex = (nextIndex + 1) % features.length;
          attempts++;
        }
        newIndexes[blockIdx] = nextIndex;
        return newIndexes;
      });
    };

    // Each card changes independently with different intervals
    const intervals = [4000, 4500, 5000];

    const initialTimeouts = intervals.map((interval, index) => {
      return setTimeout(() => {
        const changeFeature = () => {
          slideFeature(index);
        };
        intervalRefs.current[index] = setInterval(changeFeature, interval);
      }, 2000 + index * 500);
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
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white pt-[160px] pb-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-100/30 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-20 h-96 w-96 translate-x-1/2 rounded-full bg-amber-100/20 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mx-auto mb-20 max-w-3xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {content.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Left side - Single large image block */}
          <div
            className={`relative flex flex-col ${
              isVisible ? "animate-slide-in-left" : ""
            }`}
            style={isVisible ? { animationDelay: "0.3s" } : { opacity: 0 }}
          >
            <div className="group relative flex h-full min-h-[520px] overflow-hidden rounded-3xl border-2 border-white/20 bg-[#E8FDF8] shadow-2xl transition-all duration-500 hover:border-teal-200/40 hover:shadow-3xl">
              {/* Content overlay */}
              <div className="relative z-10 flex h-full flex-col justify-between p-10 md:p-12">
                <div>
                  <h3 className="mb-3 text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                    KLS Logistics
                  </h3>
                  <p className="text-lg font-normal leading-relaxed text-gray-700 md:text-xl">
                    {content.cardText || "Швидко та легко керувати своїми логістичними операціями щодня"}
                  </p>
                </div>
                
                {/* Contact button full width */}
                <div className="mt-auto">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#006D77] px-10 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:bg-[#005a63] hover:scale-[1.02] hover:shadow-2xl md:px-12 md:py-5"
                  >
                    <span className="relative z-10">
                      {content.contactButton || "Зв'язатися з нами"}
                    </span>
                      <svg className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Three feature cards with smooth slide-up animation */}
          <div className="flex h-full flex-col justify-between space-y-6">
            {[0, 1, 2].map((cardIndex) => {
              const currentIndex = currentFeatureIndexes[cardIndex];
              const currentFeature = features[currentIndex];

              return (
                <div
                  key={cardIndex}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white via-white to-slate-50/50 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:border-teal-200/60 hover:shadow-2xl ${
                    isVisible ? "animate-slide-in-right" : ""
                  }`}
                  style={{
                    ...(isVisible
                      ? { animationDelay: `${0.4 + cardIndex * 0.1}s` }
                      : { opacity: 0 }),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Animated gradient accent on left */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 via-teal-400 to-teal-600 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
                  
                  {/* Decorative corner element */}
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Icon in top left */}
                  <div className="absolute top-6 left-6">
                    <div className="flex h-20 w-20 items-center justify-center transition-all duration-300 group-hover:scale-110">
                      {(() => {
                        const iconPath = featureIconMap[currentFeature.title];
                        if (iconPath) {
                          return (
                            <Image
                              src={iconPath}
                              alt={currentFeature.title}
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          );
                        } else {
                          // Fallback to lucide icon if icon not found
                          return <Zap size={48} strokeWidth={2.5} />;
                        }
                      })()}
                    </div>
                  </div>

                  {/* Content with smooth slide-up animation */}
                  <div className="relative min-h-[150px] pl-20">
                    <div 
                      key={currentIndex}
                      className="animate-slide-up"
                    >
                      <h3 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-teal-700 md:text-3xl">
                        {currentFeature.title}
                      </h3>
                      <p className="text-base font-normal leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700 md:text-lg">
                        {currentFeature.description}
                      </p>
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
      
      <style jsx>{`
        @keyframes slide-in-top {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-top {
          animation: slide-in-top 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
      
      {/* Contact Modal */}
      <ContactQuickModal 
        locale={locale} 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
}