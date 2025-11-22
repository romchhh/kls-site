"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type CTASectionProps = {
  locale: Locale;
};

export function CTASection({ locale }: CTASectionProps) {
  const t = getTranslations(locale);
  const content = t.cta;
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
      className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-24 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className={`mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
          >
            {content.title}
          </h2>

          <p
            className={`mb-12 text-lg leading-relaxed text-white/90 md:text-xl ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.2s" } : { opacity: 0 }}
          >
            {content.subtitle}
          </p>

          <div
            className={`mb-12 flex flex-wrap justify-center gap-6 ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.4s" } : { opacity: 0 }}
          >
            <Link
              href={`/${locale}/contacts`}
              className="group relative overflow-hidden rounded-2xl bg-white px-10 py-5 text-lg font-semibold text-teal-600 shadow-2xl transition-all duration-500 hover:scale-110 hover:bg-teal-50 hover:shadow-3xl btn-primary"
            >
              <span className="relative z-10 flex items-center gap-3">
                {content.primaryButton}
                <ArrowRight
                  size={22}
                  className="transition-transform duration-500 group-hover:translate-x-2"
                />
              </span>
            </Link>

            <Link
              href={`/${locale}/contacts`}
              className="group relative overflow-hidden rounded-2xl border-2 border-white/50 bg-white/20 backdrop-blur-md px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all duration-500 hover:scale-110 hover:border-white/70 hover:bg-white/30 hover:shadow-2xl"
            >
              <span className="relative z-10">{content.secondaryButton}</span>
            </Link>
          </div>

          <div
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.6s" } : { opacity: 0 }}
          >
            {content.features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 rounded-2xl bg-white/15 border border-white/20 p-6 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-white/25 hover:shadow-xl card-hover ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={isVisible ? { animationDelay: `${0.7 + index * 0.1}s` } : { opacity: 0 }}
              >
                <CheckCircle2 size={24} className="flex-shrink-0 text-teal-200" />
                <span className="text-base font-semibold text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

