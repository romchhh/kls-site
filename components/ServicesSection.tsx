"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "../types/content";

type ServicesSectionProps = {
  services: Service[];
};

type HoverStyle = {
  glowX: number;
  glowY: number;
  intensity: number;
};

export function ServicesSection({ services }: ServicesSectionProps) {
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
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((node) => node === entry.target);
            if (index >= 0) {
              setVisibleStates((prev) => {
                if (prev[index]) {
                  return prev;
                }
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [cardRefs, services]);

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
            key={service.title}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-[1px] shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] transition-all duration-700 ease-out backdrop-blur-xl ${
              isVisible
                ? "opacity-100 blur-0"
                : "translate-y-10 opacity-0 blur-sm"
            }`}
          >
            <div
              className="relative h-full rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-white/45 via-white/30 to-white/15 p-8 transition-all duration-500 group-hover:from-white/55 group-hover:via-white/35 group-hover:to-white/25"
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
                  background: `radial-gradient(circle at ${hoverStyle.glowX}% ${hoverStyle.glowY}%, rgba(56,189,248,0.25), transparent 60%)`,
                }}
              />
              <div className="pointer-events-none absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/20 mix-blend-overlay blur-3xl transition-all duration-700 group-hover:translate-x-[6rem] group-hover:bg-white/30" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45)_0%,_rgba(255,255,255,0)_55%)]" />
                <div className="absolute -inset-[120%] animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_0deg,_rgba(255,255,255,0)_0deg,_rgba(255,255,255,0.65)_90deg,_rgba(255,255,255,0)_180deg)] opacity-30 blur-3xl" />
              </div>
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <span className="mb-3 inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-600/80">
                    Service
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {service.title}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-slate-600/90">
                  {service.description}
                </p>
                <button className="group/read relative inline-flex items-center gap-2 self-start overflow-hidden rounded-full border border-white/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition-all duration-500 hover:scale-105 hover:border-white/60">
                  <span className="relative z-10">Read More</span>
                  <ArrowUpRight
                    size={18}
                    className="relative z-10 transition-transform duration-500 group-hover/read:translate-x-1 group-hover/read:-translate-y-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/15 to-transparent opacity-60 transition-opacity duration-500 group-hover/read:opacity-80" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/read:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      }),
    [services, visibleStates, hoverStyles]
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
      <div className="pointer-events-none absolute left-1/2 top-16 h-[35rem] w-[35rem] -translate-x-1/2 rounded-full bg-sky-100/35 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Services
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Tailored counsel for ambitious teams
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600/80">
            Each partnership begins with a transparent roadmap, liquid-glass clarity, and a focus on
            resilient growth across governance, finance, and advisory functions.
          </p>
        </div>

        <div className="grid gap-10 sm:gap-12 md:grid-cols-2">
          {serviceCards}
        </div>
      </div>
    </section>
  );
}