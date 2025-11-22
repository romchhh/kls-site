"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import { Locale, getTranslations } from "../lib/translations";

type PartnersSectionProps = {
  locale: Locale;
};

export function PartnersSection({ locale }: PartnersSectionProps) {
  const t = getTranslations(locale);
  const content = t.partners;
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

        <div className="relative mx-auto max-w-6xl overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/95 to-transparent" />
          <div className="flex min-w-full animate-[partners-marquee_26s_linear_infinite] gap-12">
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
                  className="group relative flex w-60 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 px-8 py-6 shadow-md backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-teal-200 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <PartnerWrapper>
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      width={200}
                      height={80}
                      className="relative z-10 h-12 w-auto object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                      priority={index === 0}
                      unoptimized={partner.logo.includes('.svg') || partner.logo.includes('.jpg')}
                    />
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

