"use client";

import Link from "next/link";
import Image from "next/image";
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

  // Color schemes for different service cards
  const colorSchemes = [
    { // Грошові операції - зелені відтінки
      border: "border-emerald-200/30",
      badge: "border-emerald-200/30 text-emerald-700/80",
      button: "border-emerald-200/40 text-emerald-700 hover:border-emerald-300/60",
      glow: "rgba(16, 185, 129, 0.25)",
      glowBlur: "bg-emerald-200/20",
      glowBlurHover: "bg-emerald-300/30",
      buttonGradient: "from-emerald-100/20 via-emerald-100/15",
      buttonGradientHover: "via-emerald-100/20",
    },
    { // Складські послуги - блакитні відтінки
      border: "border-blue-200/30",
      badge: "border-blue-200/30 text-blue-700/80",
      button: "border-blue-200/40 text-blue-700 hover:border-blue-300/60",
      glow: "rgba(59, 130, 246, 0.25)",
      glowBlur: "bg-blue-200/20",
      glowBlurHover: "bg-blue-300/30",
      buttonGradient: "from-blue-100/20 via-blue-100/15",
      buttonGradientHover: "via-blue-100/20",
    },
    { // Сервіс пошуку/закупівлі - фіолетові відтінки
      border: "border-purple-200/30",
      badge: "border-purple-200/30 text-purple-700/80",
      button: "border-purple-200/40 text-purple-700 hover:border-purple-300/60",
      glow: "rgba(168, 85, 247, 0.25)",
      glowBlur: "bg-purple-200/20",
      glowBlurHover: "bg-purple-300/30",
      buttonGradient: "from-purple-100/20 via-purple-100/15",
      buttonGradientHover: "via-purple-100/20",
    },
    { // Страхування вантажу - помаранчеві відтінки
      border: "border-orange-200/30",
      badge: "border-orange-200/30 text-orange-700/80",
      button: "border-orange-200/40 text-orange-700 hover:border-orange-300/60",
      glow: "rgba(249, 115, 22, 0.25)",
      glowBlur: "bg-orange-200/20",
      glowBlurHover: "bg-orange-300/30",
      buttonGradient: "from-orange-100/20 via-orange-100/15",
      buttonGradientHover: "via-orange-100/20",
    },
    { // Локальна доставка - рожеві відтінки
      border: "border-pink-200/30",
      badge: "border-pink-200/30 text-pink-700/80",
      button: "border-pink-200/40 text-pink-700 hover:border-pink-300/60",
      glow: "rgba(236, 72, 153, 0.25)",
      glowBlur: "bg-pink-200/20",
      glowBlurHover: "bg-pink-300/30",
      buttonGradient: "from-pink-100/20 via-pink-100/15",
      buttonGradientHover: "via-pink-100/20",
    },
  ];

  const serviceCards = useMemo(
    () =>
      services.map((service, index) => {
        const isVisible = visibleStates[index];
        const colors = colorSchemes[index % colorSchemes.length];
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
            className={`group relative overflow-hidden rounded-3xl border-2 ${colors.border} bg-white/15 p-[2px] shadow-2xl backdrop-blur-xl card-hover ${
              index === 0 
                ? "min-h-[400px] lg:row-span-2 lg:min-h-full" 
                : "min-h-[200px]"
            } ${
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
              className="relative h-full rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-white/60 via-white/40 to-white/20 p-8 transition-all duration-500 group-hover:from-white/70 group-hover:via-white/50 group-hover:to-white/30 md:p-10"
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
                  background: `radial-gradient(circle at ${hoverStyle.glowX}% ${hoverStyle.glowY}%, ${colors.glow}, transparent 60%)`,
                }}
              />
              <div 
                className="pointer-events-none absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full mix-blend-overlay blur-3xl transition-all duration-700 group-hover:translate-x-[6rem]"
                style={{
                  backgroundColor: index === 0 ? "rgba(16, 185, 129, 0.2)" : 
                                  index === 1 ? "rgba(59, 130, 246, 0.2)" :
                                  index === 2 ? "rgba(168, 85, 247, 0.2)" :
                                  index === 3 ? "rgba(249, 115, 22, 0.2)" :
                                  "rgba(236, 72, 153, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = index === 0 ? "rgba(16, 185, 129, 0.3)" : 
                                                          index === 1 ? "rgba(59, 130, 246, 0.3)" :
                                                          index === 2 ? "rgba(168, 85, 247, 0.3)" :
                                                          index === 3 ? "rgba(249, 115, 22, 0.3)" :
                                                          "rgba(236, 72, 153, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index === 0 ? "rgba(16, 185, 129, 0.2)" : 
                                                          index === 1 ? "rgba(59, 130, 246, 0.2)" :
                                                          index === 2 ? "rgba(168, 85, 247, 0.2)" :
                                                          index === 3 ? "rgba(249, 115, 22, 0.2)" :
                                                          "rgba(236, 72, 153, 0.2)";
                }}
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45)_0%,_rgba(255,255,255,0)_55%)]" />
                <div className="absolute -inset-[120%] animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_0deg,_rgba(255,255,255,0)_0deg,_rgba(255,255,255,0.65)_90deg,_rgba(255,255,255,0)_180deg)] opacity-30 blur-3xl" />
              </div>
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <span className={`mb-3 inline-flex items-center rounded-full border ${colors.badge} px-3 py-1 text-xs uppercase tracking-[0.3em]`}>
                    {t.services.title}
                  </span>
                  <h3 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl break-words">
                    {service.title}
                  </h3>
                </div>
                <Link
                  href={service.href}
                  className={`group/read relative inline-flex items-center gap-3 self-start overflow-hidden rounded-full border ${colors.button} px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-500 hover:scale-105`}
                >
                  <span className="relative z-10">
                    {t.services.readMore}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="relative z-10 transition-transform duration-500 group-hover/read:translate-x-1 group-hover/read:-translate-y-1"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r to-transparent opacity-60 transition-opacity duration-500 group-hover/read:opacity-80"
                    style={{
                      background: index === 0 ? "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.15), transparent)" :
                                  index === 1 ? "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.15), transparent)" :
                                  index === 2 ? "linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.15), transparent)" :
                                  index === 3 ? "linear-gradient(to right, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.15), transparent)" :
                                  "linear-gradient(to right, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.15), transparent)",
                    }}
                  />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/read:opacity-100">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent blur-sm"
                      style={{
                        background: index === 0 ? "linear-gradient(to right, transparent, rgba(16, 185, 129, 0.2), transparent)" :
                                        index === 1 ? "linear-gradient(to right, transparent, rgba(59, 130, 246, 0.2), transparent)" :
                                        index === 2 ? "linear-gradient(to right, transparent, rgba(168, 85, 247, 0.2), transparent)" :
                                        index === 3 ? "linear-gradient(to right, transparent, rgba(249, 115, 22, 0.2), transparent)" :
                                        "linear-gradient(to right, transparent, rgba(236, 72, 153, 0.2), transparent)",
                      }}
                    />
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
          
          {/* Arrow */}
          <div className="mt-8 flex justify-start pl-8">
            <div
              className={`transition-all duration-700 ${
                isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={isHeaderVisible ? { animationDelay: "0.4s" } : {}}
            >
              <Image
                src="/Arrow 05.png"
                alt=""
                width={100}
                height={100}
                className="opacity-40 rotate-180"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {serviceCards}
        </div>
      </div>
    </section>
  );
}
