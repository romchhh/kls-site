"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { TeamMember } from "../types/content";

type TeamSectionProps = {
  team: TeamMember[];
};

export function TeamSection({ team }: TeamSectionProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() =>
    team.map(() => false)
  );

  useEffect(() => {
    setVisibleStates(team.map(() => false));
  }, [team]);

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
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [team]);

  const teamCards = useMemo(
    () =>
      team.map((member, index) => {
        const isVisible = visibleStates[index];

        return (
          <div
            key={member.name}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-[1px] transition-all duration-700 ease-out backdrop-blur-xl ${
              isVisible
                ? "opacity-100 blur-0"
                : "translate-y-8 opacity-0 blur-[2px]"
            }`}
          >
            <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white/35 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] transition-all duration-500 group-hover:bg-white/45">
              <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)]">
                <div className="absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute -inset-[150%] animate-[spin_18s_linear_infinite] bg-[conic-gradient(from_0deg,_rgba(255,255,255,0)_0deg,_rgba(255,255,255,0.45)_90deg,_rgba(255,255,255,0)_180deg)] opacity-40 blur-3xl" />
                </div>
                <Image
                  src={member.img}
                  alt={member.name}
                  width={480}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-[110%] bg-gradient-to-t from-slate-900/85 via-slate-900/0 to-transparent p-6 transition-transform duration-700 group-hover:translate-y-0">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                        {member.role}
                      </p>
                    </div>
                    <button className="group/button relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/40 text-white transition-all duration-500 hover:border-white/70">
                      <ArrowUpRight
                        size={18}
                        className="relative z-10 transition-transform duration-500 group-hover/button:-translate-y-[2px] group-hover/button:translate-x-[2px]"
                      />
                      <div className="absolute inset-0 bg-white/15 transition-opacity duration-500 group-hover/button:opacity-80" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between px-6 pb-6 pt-5">
                <div>
                  <span className="mb-3 inline-flex items-center rounded-full border border-slate-200/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Leadership
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.25em] text-slate-500">
                    {member.role}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <p className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/75" />
                    Available for board briefings
                  </p>
                  <button className="group/more relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-slate-200 px-4 py-2 font-semibold uppercase tracking-[0.2em] text-slate-600 transition-all duration-500 hover:scale-105 hover:border-slate-300">
                    <span className="relative z-10">Profile</span>
                    <ArrowUpRight
                      size={16}
                      className="relative z-10 transition-transform duration-500 group-hover/more:-translate-y-[2px] group-hover/more:translate-x-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-60 transition-opacity duration-500 group-hover/more:opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }),
    [team, visibleStates]
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white/80 to-slate-50/80 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18)_0%,_rgba(255,255,255,0)_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Team
          </span>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Veteran leadership across jurisdictions
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600/80">
            Our partners combine global experience with boutique agility, guiding complex legal and
            financial transitions with clarity, discipline, and speed.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {teamCards}
        </div>
      </div>
    </section>
  );
}

