"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield, Eye, Zap, DollarSign, FileText, User, Headphones, Globe } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

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
  const t = getTranslations(locale);
  const content = t.whyChooseUs;
  // Use all features for rotation
  const features = content.features;
  // Each card starts with a different feature index
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeatureIndexes, setCurrentFeatureIndexes] = useState<number[]>([0, 1, 2]);
  const [isFlipping, setIsFlipping] = useState<boolean[]>([false, false, false]);
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
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div
          className={`mx-auto mb-16 max-w-3xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {content.title}
          </h2>
          <p className="mb-6 text-base font-normal leading-relaxed text-slate-600 md:text-lg">
            {content.subtitle}
          </p>
          
          {/* Arrow */}
          <div className="mt-6 flex justify-center">
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={isVisible ? { animationDelay: "0.3s" } : {}}
            >
              <Image
                src="/Arrow 01.png"
                alt=""
                width={100}
                height={100}
                className="opacity-40"
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
            <div className="group relative flex h-full min-h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50 shadow-2xl transition-all duration-500 hover:shadow-3xl">
              {/* Blurred background image */}
              <div className="absolute inset-0">
                <Image
                  src="/hero-image-1.jpg"
                  alt="KLS Logistics"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  style={{
                    filter: "blur(10px) brightness(0.65) saturate(0.9)",
                    transform: "scale(1.1)",
                  }}
                />
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/80 group-hover:via-black/40" />
              
              {/* Content overlay */}
              <div className="relative z-10 flex h-full flex-col justify-center p-10">
                <h3 className="mb-3 text-4xl font-black tracking-tight text-white md:text-5xl">
                  KLS Logistics
                </h3>
                <p className="mb-2 text-lg font-normal leading-relaxed text-white/95 md:text-xl">
                  {content.imageLabels.international}
                </p>
                <p className="mb-8 text-base font-normal text-white/90 md:text-lg">
                  {content.cardText}
                </p>
                
                {/* Contact button */}
                <Link
                  href={`/${locale}/contacts`}
                  className="inline-block w-fit rounded-2xl bg-slate-900 px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-2xl md:px-10 md:py-4"
                >
                  {content.contactButton}
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Three feature cards with dynamic change */}
          <div className="flex h-full flex-col justify-center space-y-4">
            {[0, 1, 2].map((cardIndex) => {
              const currentIndex = currentFeatureIndexes[cardIndex];
              const currentFeature = features[currentIndex];
              const nextIndex = (currentIndex + 1) % features.length;
              const nextFeature = features[nextIndex];
              const flipping = isFlipping[cardIndex];

              return (
                <div
                  key={cardIndex}
                  className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                    isVisible ? "animate-slide-in-right" : ""
                  }`}
                  style={
                    isVisible
                      ? { animationDelay: `${0.4 + cardIndex * 0.1}s` }
                      : { opacity: 0 }
                  }
                >
                  {/* Accent line on left */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 to-teal-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  {/* Icon in top right with flip animation */}
                  <div className="absolute top-6 right-6">
                    <div
                      className={`flip-container ${
                        flipping ? "flip" : ""
                      }`}
                      style={{ width: "64px", height: "64px" }}
                    >
                      <div className="flip-front">
                        <div className="flex h-16 w-16 items-center justify-center text-teal-600 transition-all duration-300 group-hover:text-teal-700 group-hover:scale-110">
                          {(() => {
                            const CurrentIcon = featureIcons[currentIndex % featureIcons.length];
                            return <CurrentIcon size={40} strokeWidth={2} />;
                          })()}
                        </div>
                      </div>
                      <div className="flip-back">
                        <div className="flex h-16 w-16 items-center justify-center text-teal-600 transition-all duration-300 group-hover:text-teal-700 group-hover:scale-110">
                          {(() => {
                            const NextIcon = featureIcons[nextIndex % featureIcons.length];
                            return <NextIcon size={40} strokeWidth={2} />;
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
                        <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                          {currentFeature.title}
                        </h3>
                        <p className="text-base font-normal leading-relaxed text-slate-600 md:text-lg">
                          {currentFeature.description}
                        </p>
                      </div>
                      <div className="flip-back">
                        <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                          {nextFeature.title}
                        </h3>
                        <p className="text-base font-normal leading-relaxed text-slate-600 md:text-lg">
                          {nextFeature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
