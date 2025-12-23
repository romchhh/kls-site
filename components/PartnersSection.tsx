"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import { Locale, getTranslations } from "../lib/translations";

type PartnersSectionProps = {
  locale: Locale;
};

export function PartnersSection({ locale }: PartnersSectionProps) {
  const t = getTranslations(locale);
  const content = t?.partners;
  
  if (!content || !content.partners) {
    console.error(`Translations for partners not found for locale: ${locale}`);
    return null; // Or render a fallback UI
  }
  
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const marqueePartners = [...content.partners, ...content.partners];

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
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`mb-16 text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
        >
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {content.title}
          </h2>
          <p className="text-lg leading-relaxed text-slate-600/80">
            {content.subtitle}
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/95 to-transparent" />
          <div className="flex animate-[partners-marquee_10s_linear_infinite] gap-4 md:gap-12" style={{ display: 'inline-flex', width: 'max-content' }}>
            {marqueePartners.map((partner, index) => {
              const PartnerWrapper = partner.url 
                ? ({ children }: { children: ReactNode }) => (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      {children}
                    </a>
                  )
                : ({ children }: { children: ReactNode }) => <>{children}</>;
              
              return (
                <div
                  key={`${partner.name}-${index}`}
                  className="group relative flex h-32 w-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gray-50 transition-all duration-500 md:h-40 md:w-56"
                >
                  <PartnerWrapper>
                    <div className="flex h-full w-full items-center justify-center">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={160}
                        height={120}
                        className="relative z-10 max-h-20 w-auto object-contain md:max-h-24"
                        priority={index === 0}
                        unoptimized={true}
                      />
                    </div>
                  </PartnerWrapper>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

