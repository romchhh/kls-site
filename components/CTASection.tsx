"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
      className="relative overflow-hidden bg-white py-16 md:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className={`mb-6 text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
          >
            {content.title}
          </h2>

          <p
            className={`mb-8 text-lg leading-relaxed text-gray-600 md:text-xl ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.2s" } : { opacity: 0 }}
          >
            {content.subtitle}
          </p>
          
          {/* Arrow */}
          <div className="mb-8 flex justify-center">
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
                className="opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

