"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Locale, getTranslations } from "../lib/translations";

type WhyChooseUsSectionProps = {
  locale: Locale;
};

export function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  const t = getTranslations(locale);
  const content = t.whyChooseUs;
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeatureIndexes, setCurrentFeatureIndexes] = useState<number[]>([0, 1, 2, 3]);
  const [isFlipping, setIsFlipping] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    let blockIndex = 0;
    const flipFeature = (blockIdx: number) => {
      setIsFlipping((prev) => {
        const newFlipping = [...prev];
        newFlipping[blockIdx] = true;
        return newFlipping;
      });

      setTimeout(() => {
        setCurrentFeatureIndexes((prev) => {
          const newIndexes = [...prev];
          // Change to next feature, cycling through all features
          newIndexes[blockIdx] = (prev[blockIdx] + 1) % content.features.length;
          return newIndexes;
        });
        
        setIsFlipping((prev) => {
          const newFlipping = [...prev];
          newFlipping[blockIdx] = false;
          return newFlipping;
        });
      }, 300); // Half of flip animation duration
    };

    const changeNextBlock = () => {
      flipFeature(blockIndex);
      blockIndex = (blockIndex + 1) % content.features.length;
    };

    // Initial delay before starting
    const initialTimeout = setTimeout(() => {
      // Start flipping blocks sequentially with delay - every 5 seconds
      intervalRef.current = setInterval(changeNextBlock, 5000);
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, content.features.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`mx-auto mb-20 max-w-4xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.3s" } : { opacity: 0 }}
        >
          <h2 className="mb-6 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          <p className="text-xl leading-relaxed text-slate-600/80 md:text-2xl">
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left side - Images */}
          <div className="grid gap-6">
            <div
              className={`relative h-96 overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 hover:scale-105 card-hover ${
                isVisible ? "animate-slide-in-left" : ""
              }`}
              style={isVisible ? { animationDelay: "0.4s" } : { opacity: 0 }}
            >
              <Image
                src="/hero-image-1.jpg"
                alt="KLS Logistics - Global shipping"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-lg font-semibold text-white">
                  {content.imageLabels.international}
                </p>
              </div>
            </div>
            <div
              className={`relative h-80 overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 hover:scale-105 card-hover ${
                isVisible ? "animate-slide-in-left" : ""
              }`}
              style={isVisible ? { animationDelay: "0.6s" } : { opacity: 0 }}
            >
              <Image
                src="/hero-image-2.jpg"
                alt="KLS Logistics - Reliable delivery"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-lg font-semibold text-white">
                  {content.imageLabels.reliable}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Features with flip animation */}
          <div className="flex flex-col justify-center space-y-6">
            {content.features.map((feature, index) => {
              const currentIndex = currentFeatureIndexes[index];
              const currentFeature = content.features[currentIndex];
              const nextIndex = (currentIndex + 1) % content.features.length;
              const nextFeature = content.features[nextIndex];
              const flipping = isFlipping[index];

              return (
                <div
                  key={index}
                  className={`group rounded-3xl border-2 border-gray-200/60 bg-white/90 backdrop-blur-sm p-8 shadow-lg transition-all duration-500 hover:scale-105 hover:border-teal-300 hover:shadow-2xl card-hover ${
                    isVisible ? "animate-slide-in-right" : ""
                  }`}
                  style={
                    isVisible
                      ? { animationDelay: `${0.5 + index * 0.15}s` }
                      : { opacity: 0 }
                  }
                >
                  <div className="flex items-start gap-6">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-teal-600 group-hover:to-teal-500 group-hover:text-white shadow-md">
                      <span className="text-2xl font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-h-[120px] relative overflow-hidden">
                      <div
                        className={`flip-container ${
                          flipping ? "flip" : ""
                        }`}
                      >
                        <div className="flip-front">
                          <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                            {currentFeature.title}
                          </h3>
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {currentFeature.description}
                          </p>
                        </div>
                        <div className="flip-back">
                          <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                            {nextFeature.title}
                          </h3>
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {nextFeature.description}
                          </p>
                        </div>
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
