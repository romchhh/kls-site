"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Locale, getTranslations } from "../lib/translations";

type CTASectionProps = {
  locale: Locale;
};

export function CTASection({ locale }: CTASectionProps) {
  const t = getTranslations(locale);
  const content = t?.cta || {
    title: "Готові почати?",
    subtitle: "Зв'яжіться з нами сьогодні",
  };
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
      className="relative overflow-hidden pt-16 pb-8 md:pt-20 md:pb-10"
      style={{ backgroundColor: '#052430' }}
    >
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className={`mb-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
          >
            {content.title}
          </h2>

          {/* Subtitle та стрілка приховані за побажанням */}
        </div>
      </div>
    </section>
  );
}

