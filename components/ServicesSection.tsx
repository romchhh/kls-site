"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type ServicesSectionProps = {
  locale: Locale;
};

type HoverStyle = {
  glowX: number;
  glowY: number;
  intensity: number;
};

export function ServicesSection({ locale }: ServicesSectionProps) {
  const t = getTranslations(locale);
  const services = t.services.items;
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    services.map(() => false)
  );
  const [scrollBlurIntensity, setScrollBlurIntensity] = useState(0);
  const [hoverStyles, setHoverStyles] = useState<HoverStyle[]>(() =>
    services.map(() => ({
      glowX: 50,
      glowY: 50,
      intensity: 0,
    }))
  );
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    setVisibleStates(services.map(() => false));
    setHoverStyles(
      services.map(() => ({
        glowX: 50,
        glowY: 50,
        intensity: 0,
      }))
    );
  }, [services]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === sectionRef.current) {
            setIsHeaderVisible(true);
            
            // Запускаємо послідовну анімацію карток після появи заголовка
            services.forEach((_, index) => {
              setTimeout(() => {
                setVisibleStates((prev) => {
                  if (prev[index]) {
                    return prev;
                  }
                  const next = [...prev];
                  next[index] = true;
                  return next;
                });
              }, 500 + index * 150); // Затримка 500ms для заголовка + 150ms між картками
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    // Спостерігаємо за секцією
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [services]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) {
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.min(Math.abs(sectionCenter - viewportCenter), window.innerHeight);
      const normalized = 1 - distance / window.innerHeight;
      const intensity = Math.max(0, Math.min(normalized, 1));
      setScrollBlurIntensity(intensity);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const serviceCards = useMemo(
    () =>
      services.map((service, index) => {
        const isVisible = visibleStates[index];
        const hoverStyle = hoverStyles[index] ?? {
          glowX: 50,
          glowY: 50,
          intensity: 0,
        };

        return (
          <div
            key={`${service.title}-${index}`}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className={`group relative overflow-hidden rounded-3xl border-2 border-white/30 bg-white/15 p-[2px] shadow-2xl backdrop-blur-xl card-hover ${
              isVisible
                ? "opacity-100 blur-0 scale-100 translate-y-0"
                : "translate-y-20 opacity-0 blur-sm scale-95"
            }`}
            style={isVisible ? { 
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            } : {
              transition: "none"
            }}
          >
            <div
              className="relative h-full rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-white/60 via-white/40 to-white/20 p-10 transition-all duration-500 group-hover:from-white/70 group-hover:via-white/50 group-hover:to-white/30"
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const glowX = ((event.clientX - bounds.left) / bounds.width) * 100;
                const glowY = ((event.clientY - bounds.top) / bounds.height) * 100;
                setHoverStyles((prev) => {
                  const next = [...prev];
                  next[index] = {
                    glowX,
                    glowY,
                    intensity: 1,
                  };
                  return next;
                });
              }}
              onMouseLeave={() => {
                setHoverStyles((prev) => {
                  const next = [...prev];
                  next[index] = {
                    glowX: 50,
                    glowY: 50,
                    intensity: 0,
                  };
                  return next;
                });
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at ${hoverStyle.glowX}% ${hoverStyle.glowY}%, rgba(20,184,166,0.25), transparent 60%)`,
                }}
              />
              <div className="pointer-events-none absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-teal-200/20 mix-blend-overlay blur-3xl transition-all duration-700 group-hover:translate-x-[6rem] group-hover:bg-teal-300/30" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45)_0%,_rgba(255,255,255,0)_55%)]" />
                <div className="absolute -inset-[120%] animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_0deg,_rgba(255,255,255,0)_0deg,_rgba(255,255,255,0.65)_90deg,_rgba(255,255,255,0)_180deg)] opacity-30 blur-3xl" />
              </div>
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <span className="mb-3 inline-flex items-center rounded-full border border-teal-200/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-teal-700/80">
                    {t.services.title}
                  </span>
                  <h3 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-4">
                    {service.title}
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-slate-600/90 mb-6">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="group/read relative inline-flex items-center gap-2 self-start overflow-hidden rounded-full border border-teal-200/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 transition-all duration-500 hover:scale-105 hover:border-teal-300/60"
                >
                  <span className="relative z-10">
                    {t.services.readMore}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="relative z-10 transition-transform duration-500 group-hover/read:translate-x-1 group-hover/read:-translate-y-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-100/20 via-teal-100/15 to-transparent opacity-60 transition-opacity duration-500 group-hover/read:opacity-80" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/read:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/20 to-transparent blur-sm" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        );
      }),
    [services, visibleStates, hoverStyles, locale, t]
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 py-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.2 + (1 - scrollBlurIntensity) * 0.25,
          filter: `blur(${Math.max(1.5, (1 - scrollBlurIntensity) * 6)}px)`,
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[35rem] w-[35rem] -translate-x-1/2 rounded-full bg-teal-100/35 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className={`mx-auto mb-24 max-w-4xl text-center ${
          isHeaderVisible ? 'animate-slide-in-top' : ''
        }`}
        style={isHeaderVisible ? { animationDelay: '0.1s' } : { opacity: 0 }}
        >
          <div className={`mb-6 inline-flex items-center rounded-full border-2 border-teal-200/60 bg-white/80 backdrop-blur-sm px-6 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-teal-600 shadow-lg ${
            isHeaderVisible ? 'animate-slide-in-top' : ''
          }`}
          style={isHeaderVisible ? { animationDelay: '0.1s' } : { opacity: 0 }}
          >
            {t.services.title}
          </div>
          <h2 className={`mb-6 text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl lg:text-7xl ${
            isHeaderVisible ? 'animate-slide-in-top' : ''
          }`}
          style={isHeaderVisible ? { animationDelay: '0.2s' } : { opacity: 0 }}
          >
            {t.services.mainTitle}
          </h2>
          <p className={`mt-6 text-xl leading-relaxed text-slate-600/80 md:text-2xl ${
            isHeaderVisible ? 'animate-slide-in-bottom' : ''
          }`}
          style={isHeaderVisible ? { animationDelay: '0.3s' } : { opacity: 0 }}
          >
            {t.services.mainDescription}
          </p>
        </div>

        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {serviceCards}
        </div>
      </div>
    </section>
  );
}
