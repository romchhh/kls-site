"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-28 md:py-36 text-white"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15)_0%,_rgba(255,255,255,0)_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.08)_0%,_rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className={`mb-6 text-5xl font-black tracking-tight md:text-6xl lg:text-7xl ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
          >
            {content.title}
          </h2>

          <p
            className={`mb-10 text-xl leading-relaxed text-white/95 md:text-2xl ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.2s" } : { opacity: 0 }}
          >
            {content.subtitle}
          </p>
          
          {/* Arrow */}
          <div className="mb-14 flex justify-center">
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
                className="opacity-40"
              />
            </div>
          </div>

          {/* Buttons */}
          <div
            className={`mb-16 flex flex-wrap justify-center gap-5 ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.4s" } : { opacity: 0 }}
          >
            <Link
              href={`/${locale}/contacts`}
              className="group relative overflow-hidden rounded-2xl bg-white px-12 py-5 text-lg font-bold text-teal-600 shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-teal-50 hover:shadow-3xl"
            >
              <span className="relative z-10 flex items-center gap-3">
                {content.primaryButton}
                <ArrowRight
                  size={24}
                  className="transition-transform duration-500 group-hover:translate-x-2"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50/0 via-teal-50/50 to-teal-50/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>

            <Link
              href={`/${locale}/contacts`}
              className="group relative overflow-hidden rounded-2xl border-2 border-white/60 bg-white/10 backdrop-blur-md px-12 py-5 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:scale-105 hover:border-white/80 hover:bg-white/20 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-3">
                {content.secondaryButton}
                <ArrowRight
                  size={24}
                  className="transition-transform duration-500 group-hover:translate-x-2"
                />
              </span>
            </Link>
          </div>

          {/* Features Grid */}
          <div
            className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.6s" } : { opacity: 0 }}
          >
            {content.features.map((feature, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={isVisible ? { animationDelay: `${0.7 + index * 0.1}s` } : { opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/30 group-hover:scale-110">
                    <CheckCircle2 size={24} className="text-teal-200" />
                  </div>
                  <span className="text-base font-semibold leading-tight text-white">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

