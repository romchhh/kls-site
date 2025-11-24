"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type DeliveryTypesSectionProps = {
  locale: Locale;
};

export function DeliveryTypesSection({ locale }: DeliveryTypesSectionProps) {
  const t = getTranslations(locale);
  const content = t.deliveryTypes;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {content.types.map((type, index) => (
            <Link
              key={type.key}
              href={`/${locale}/delivery/${type.key}`}
              className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
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
              <div className="relative z-10 flex h-full flex-col justify-between p-6">
                {/* Title */}
                <div>
                  <h3 className="mb-6 text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl">
                    {type.title}
                  </h3>

                  {/* Features List */}
                  <div className="space-y-4">
                    {type.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-2 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-white" />
                        <p className="text-base font-normal leading-relaxed text-white/95 md:text-lg">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learn More Button - appears on hover */}
                <div className="mt-6 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-6 py-3.5 text-base font-semibold text-slate-900 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:gap-4 md:text-lg md:px-8 md:py-4">
                    <span>{content.learnMore}</span>
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

