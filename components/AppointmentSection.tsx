"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, MapPin, Phone, ArrowUpRight } from "lucide-react";

type AppointmentOption = {
  title: string;
  description: string;
  icon: typeof Phone;
  cta: string;
};

const appointmentOptions: AppointmentOption[] = [
  {
    title: "Call or Chat Online",
    description:
      "Reach a partner within minutes. We orchestrate your next steps while you stay focused on decisions that matter.",
    icon: Phone,
    cta: "Book a call",
  },
  {
    title: "Visit an Office",
    description:
      "Schedule a session in Dubai, London, or Zurich. We prepare cross-functional advisors aligned to your agenda.",
    icon: MapPin,
    cta: "Reserve a meeting",
  },
  {
    title: "Online Appointment",
    description:
      "Prefer virtual? We set up structured checkpoints with agendas, materials, and outcome tracking in advance.",
    icon: Calendar,
    cta: "Plan a session",
  },
];

type HoverState = {
  glowX: number;
  glowY: number;
  intensity: number;
};

export function AppointmentSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    appointmentOptions.map(() => false)
  );
  const [hoverStates, setHoverStates] = useState<HoverState[]>(() =>
    appointmentOptions.map(() => ({ glowX: 50, glowY: 50, intensity: 0 }))
  );
  const [parallax, setParallax] = useState(0);

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
  }, []);

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

  const cards = useMemo(
    () =>
      appointmentOptions.map((option, index) => {
        const isVisible = visibleStates[index];
        const hover = hoverStates[index] ?? { glowX: 50, glowY: 50, intensity: 0 };
        const Icon = option.icon;

        return (
          <div
            key={option.title}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-[1px] shadow-[0_25px_60px_-40px_rgba(15,23,42,0.5)] transition-all duration-700 ease-out backdrop-blur-xl ${
              isVisible
                ? "opacity-100 blur-0"
                : "translate-y-10 opacity-0 blur-sm"
            }`}
          >
            <div
              className="relative h-full rounded-[calc(1.5rem-1px)] bg-white/55 p-10 transition-all duration-500 group-hover:bg-white/65"
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
                  background: `radial-gradient(circle at ${hover.glowX}% ${hover.glowY}%, rgba(56,189,248,0.25), transparent 60%)`,
                }}
              />
              <div className="relative z-10 flex h-full flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_15px_40px_-30px_rgba(15,23,42,0.65)] transition-transform duration-500 group-hover:-translate-y-1">
                    <Icon className="h-6 w-6 text-slate-900" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.32em] text-slate-500">
                    Concierge
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {option.title}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-600/90">
                    {option.description}
                  </p>
                </div>

                <button className="group/cta relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition-transform duration-500 hover:scale-105 hover:border-slate-400">
                  <span className="relative z-10">{option.cta}</span>
                  <ArrowUpRight
                    size={18}
                    className="relative z-10 transition-transform duration-500 group-hover/cta:-translate-y-[2px] group-hover/cta:translate-x-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-200/70 via-transparent to-slate-200/60 opacity-70 transition-opacity duration-500 group-hover/cta:opacity-90" />
                </button>
              </div>
            </div>
          </div>
        );
      }),
    [hoverStates, visibleStates]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.55)_0%,_rgba(226,232,240,0)_55%)] transition-transform duration-[2000ms]"
        style={{
          transform: `translateY(${(parallax - 0.5) * 120}px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(148,163,184,0.18)_0%,rgba(148,163,184,0)_55%),linear-gradient(320deg,rgba(226,232,240,0.45)_0%,rgba(226,232,240,0)_65%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Coordination
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Schedule your appointment
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Every engagement starts with operational clarity. Choose how we connect, and our
            concierge team will align the right partners, materials, and timeline ahead of the call.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cards}
        </div>
      </div>
    </section>
  );
}

