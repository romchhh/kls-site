"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Blog } from "../types/content";

type BlogsSectionProps = {
  blogs: Blog[];
};

type HoverState = {
  glowX: number;
  glowY: number;
  intensity: number;
};

const accentGradients: Record<string, string> = {
  Event: "from-sky-500/80 via-blue-500/70 to-indigo-500/65",
  News: "from-emerald-400/75 via-teal-400/65 to-cyan-400/55",
};

export function BlogsSection({ blogs }: BlogsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    blogs.map(() => false)
  );
  const [hoverStates, setHoverStates] = useState<HoverState[]>(() =>
    blogs.map(() => ({ glowX: 50, glowY: 50, intensity: 0 }))
  );
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    setVisibleStates(blogs.map(() => false));
    setHoverStates(blogs.map(() => ({ glowX: 50, glowY: 50, intensity: 0 })));
  }, [blogs]);

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
  }, [blogs]);

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

  const blogCards = useMemo(
    () =>
      blogs.map((blog, index) => {
        const isVisible = visibleStates[index];
        const hover = hoverStates[index] ?? { glowX: 50, glowY: 50, intensity: 0 };
        const accentGradient = accentGradients[blog.type] ?? "from-slate-500/80 via-slate-600/65 to-slate-700/55";

        return (
          <div
            key={blog.title}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-[1px] shadow-[0_30px_80px_-45px_rgba(15,23,42,0.75)] transition-all duration-700 ease-out backdrop-blur-xl ${
              isVisible
                ? "opacity-100 blur-0"
                : "translate-y-12 opacity-0 blur-sm"
            }`}
          >
            <div
              className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-br ${accentGradient} transition-transform duration-700 group-hover:scale-110`}
                style={{
                  transformOrigin: `${hover.glowX}% ${hover.glowY}%`,
                }}
              />

              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-90"
                style={{
                  background: `radial-gradient(circle at ${hover.glowX}% ${hover.glowY}%, rgba(255,255,255,0.45), transparent 60%)`,
                }}
              />

              <div
                className="relative flex h-full flex-col justify-between gap-8 p-8 transition-transform duration-500 group-hover:-translate-y-1"
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
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white">
                    {blog.type}
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                    <CalendarDays size={14} />
                    {blog.date}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                    {blog.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {blog.excerpt}
                  </p>
                </div>

                <button className="group/cta relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full border border-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-transform duration-500 hover:scale-105 hover:border-white/60">
                  <span className="relative z-10">Read full story</span>
                  <ArrowUpRight
                    size={18}
                    className="relative z-10 transition-transform duration-500 group-hover/cta:-translate-y-[2px] group-hover/cta:translate-x-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-60 transition-opacity duration-500 group-hover/cta:opacity-85" />
                </button>
              </div>
            </div>
          </div>
        );
      }),
    [blogs, hoverStates, visibleStates]
  );

  return (
    <section
      ref={sectionRef}
      id="blogs-&-news"
      className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-24 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25)_0%,_rgba(15,23,42,0)_55%)] transition-transform duration-[2000ms]"
        style={{
          transform: `translateY(${(parallax - 0.5) * 120}px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.08)_0%,rgba(56,189,248,0)_55%),linear-gradient(300deg,rgba(99,102,241,0.12)_0%,rgba(99,102,241,0)_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
            Blogs &amp; News
          </span>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Latest dispatches from the Vault ecosystem
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Reports, transactions, and leadership conversations curated for boards, founders, and
            investment teams operating across our jurisdictions.
          </p>
        </div>

        <div className="grid gap-10 sm:gap-12 md:grid-cols-3">
          {blogCards}
        </div>
      </div>
    </section>
  );
}

