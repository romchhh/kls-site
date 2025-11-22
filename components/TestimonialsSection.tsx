"use client";

import { useEffect, useRef, useState } from "react";
import { Quote, Star } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type TestimonialsSectionProps = {
  locale: Locale;
};

export function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const t = getTranslations(locale);
  const content = t.testimonials;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.05)_0%,_rgba(20,184,166,0)_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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

        {/* Horizontal scroll container */}
        <div 
          ref={scrollContainerRef}
          className="relative"
        >
          {/* Left gradient fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent" />
          
          {/* Right gradient fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-50 via-slate-50/95 to-transparent" />

          {/* Scrollable testimonials */}
          <div
            className={`flex gap-6 overflow-x-auto pb-6 scrollbar-hide ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.4s" } : { opacity: 0 }}
          >
            {content.items.map((testimonial, index) => (
              <div
                key={index}
                className="group relative flex-shrink-0 overflow-hidden rounded-3xl border-2 border-slate-200/60 bg-white/95 backdrop-blur-sm p-10 shadow-xl transition-all duration-500 hover:scale-105 hover:border-teal-300 hover:shadow-2xl card-hover"
                style={{ minWidth: "400px", maxWidth: "400px" }}
              >
                <div className="absolute -top-6 -right-6 h-24 w-24 text-teal-100/50 transition-transform duration-500 group-hover:scale-110">
                  <Quote size={96} />
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <p className="mb-6 text-base leading-relaxed text-slate-700">
                    "{testimonial.text}"
                  </p>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600/70">{testimonial.role}</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
