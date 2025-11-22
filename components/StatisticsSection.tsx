"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations";

type StatisticsSectionProps = {
  locale: Locale;
};

export function StatisticsSection({ locale }: StatisticsSectionProps) {
  const t = getTranslations(locale);
  const content = t.statistics;
  const [isVisible, setIsVisible] = useState(false);
  const [countedNumbers, setCountedNumbers] = useState<string[]>([]);
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
      { threshold: 0.2 }
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

    const numbers = content.stats.map((stat) => {
      const match = stat.number.match(/(\d+\.?\d*)/);
      return match ? match[1] : stat.number;
    });

    numbers.forEach((num, index) => {
      const duration = 2000;
      const steps = 60;
      const stepValue = parseFloat(num) / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= parseFloat(num)) {
          setCountedNumbers((prev) => {
            const next = [...prev];
            next[index] = num.includes(".") ? num : num;
            return next;
          });
          clearInterval(interval);
        } else {
          setCountedNumbers((prev) => {
            const next = [...prev];
            next[index] = current.toFixed(1);
            return next;
          });
        }
      }, duration / steps);
    });
  }, [isVisible, content.stats]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/30 to-white py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.08)_0%,_rgba(20,184,166,0)_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={`mx-auto mb-20 max-w-4xl text-center ${
            isVisible ? "animate-slide-in-top" : ""
          }`}
          style={isVisible ? { animationDelay: "0.2s" } : { opacity: 0 }}
        >
          <h2 className="mb-6 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          <p className="text-xl leading-relaxed text-slate-600/80 md:text-2xl">
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, index) => {
            const displayNumber =
              countedNumbers[index] ||
              (stat.number.includes("+") || stat.number.includes("/") || stat.number.includes("%")
                ? "0"
                : "0");
            const suffix = stat.number.includes("+")
              ? "+"
              : stat.number.includes("/")
              ? "/7"
              : stat.number.includes("%")
              ? "%"
              : "";

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl border-2 border-teal-100/60 bg-white/90 backdrop-blur-md p-10 shadow-xl transition-all duration-500 hover:scale-110 hover:border-teal-300 hover:shadow-2xl card-hover ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={
                  isVisible ? { animationDelay: `${0.3 + index * 0.15}s` } : { opacity: 0 }
                }
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/70 via-teal-50/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-6 text-6xl font-bold tracking-tight text-teal-600 md:text-7xl">
                    {displayNumber}
                    {suffix}
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-slate-900">
                    {stat.label}
                  </h3>
                  <p className="text-base text-slate-600/80">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

