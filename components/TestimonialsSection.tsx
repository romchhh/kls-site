"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import type { Testimonial } from "../types/content";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

type HoverState = {
  glowX: number;
  glowY: number;
  intensity: number;
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    testimonials.map(() => false)
  );
  const [hoverStates, setHoverStates] = useState<HoverState[]>(() =>
    testimonials.map(() => ({ glowX: 50, glowY: 50, intensity: 0 }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    setVisibleStates(testimonials.map(() => false));
    setHoverStates(testimonials.map(() => ({ glowX: 50, glowY: 50, intensity: 0 })));
    setActiveIndex(0);
  }, [testimonials]);

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
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [testimonials]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) {
        return;
      }
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = Math.max(0, Math.min(rect.height, window.innerHeight - rect.top));
      setParallax(offset / (rect.height || 1));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const testimonialCards = useMemo(
    () =>
      testimonials.map((testimonial, index) => {
        const isVisible = visibleStates[index];
        const hover = hoverStates[index] ?? { glowX: 50, glowY: 50, intensity: 0 };
        const isActive = index === activeIndex;

        return (
          <div
            key={testimonial.author}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-[1px] shadow-[0_30px_60px_-45px_rgba(15,23,42,0.85)] transition-all duration-700 ease-out backdrop-blur-xl ${
              isVisible
                ? "opacity-100 blur-0"
                : "translate-y-10 opacity-0 blur-sm"
            } ${isActive ? "scale-[1.02]" : "scale-100"}`}
          >
            <div
              className="relative flex h-full flex-col justify-between rounded-[calc(1.5rem-1px)] bg-slate-950/50 p-8 transition-all duration-700 group-hover:bg-slate-950/65"
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const glowX = ((event.clientX - bounds.left) / bounds.width) * 100;
                const glowY = ((event.clientY - bounds.top) / bounds.height) * 100;
                setHoverStates((prev) => {
                  const next = [...prev];
                  next[index] = { glowX, glowY, intensity: 1 };
                  return next;
                });
              }}
              onMouseLeave={() => {
                setHoverStates((prev) => {
                  const next = [...prev];
                  next[index] = { glowX: 50, glowY: 50, intensity: 0 };
                  return next;
                });
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at ${hover.glowX}% ${hover.glowY}%, rgba(56,189,248,0.55), transparent 65%)`,
                }}
              />
              <Quote className="absolute -top-10 -right-6 h-32 w-32 text-sky-500/10 transition-transform duration-700 group-hover:-translate-y-2 group-hover:translate-x-2" />
              <div className="relative z-10 space-y-6">
                <p className="text-base leading-relaxed text-slate-200">
                  “{testimonial.text}”
                </p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span className="font-semibold uppercase tracking-[0.24em] text-slate-200">
                    {testimonial.author}
                  </span>
                  <button className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-300 transition-transform duration-500 hover:scale-105 hover:border-white/35">
                    <span className="relative z-10">Share</span>
                    <ArrowUpRight
                      size={16}
                      className="relative z-10 transition-transform duration-500 group-hover/cta:-translate-y-[2px] group-hover/cta:translate-x-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-transparent to-indigo-500/20 opacity-60 transition-opacity duration-500 group-hover/cta:opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }),
    [activeIndex, hoverStates, testimonials, visibleStates]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-950 py-24 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.18)_0%,_rgba(2,6,23,0)_55%)] transition-transform duration-[2000ms]"
        style={{
          transform: `translateY(${(parallax - 0.5) * 120}px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(56,189,248,0.1)_0%,rgba(56,189,248,0)_55%),linear-gradient(320deg,rgba(129,140,248,0.15)_0%,rgba(129,140,248,0)_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
            Testimonials
          </span>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            What our partners trust us with
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Stories from the family offices, funds, and operating teams we partner with across
            jurisdictions. Their resilience is the benchmark for every mandate we accept.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {testimonialCards}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:flex-row">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Ready to collaborate?</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Arrange a closed-door briefing with our leadership team.
            </h3>
          </div>
          <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-transform duration-500 hover:scale-105 hover:border-white/40">
            <span className="relative z-10">Let’s connect</span>
            <ArrowUpRight
              size={18}
              className="relative z-10 transition-transform duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/25 via-transparent to-indigo-500/25 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
          </button>
        </div>
      </div>
    </section>
  );
}

