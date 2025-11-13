"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { NavItem } from "../types/content";

type NavigationProps = {
  items: NavItem[];
};

export function Navigation({ items }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrollY > 50 ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center">
          <a href="#home" aria-label="Vault Partners home">
            <Image
              src="/Vault-new-logo.png"
              alt="Vault Partners"
              width={160}
              height={48}
              priority
              className={`h-10 w-auto transition-opacity ${
                scrollY > 50 ? "opacity-80 hover:opacity-100" : "opacity-100"
              }`}
            />
          </a>
        </div>

        <div className="hidden items-center space-x-8 lg:flex">
          {items.map((item) => {
            const hash = item.toLowerCase().replace(/\s+/g, "-");

            return (
              <a
                key={item}
                href={`#${hash}`}
                className={`text-sm font-medium transition-colors ${
                  scrollY > 50
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-white/90 hover:text-white"
                } ${item === "Home" ? "border-b-2 border-current pb-1" : ""}`}
              >
                {item}
              </a>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <button
            className={`group relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold uppercase tracking-wide shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-105 ${
              scrollY > 50 ? "text-slate-900" : "text-white"
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
                scrollY > 50
                  ? "from-slate-200/70 via-slate-100/60 to-white/40 group-hover:from-slate-200/90 group-hover:via-slate-100/80 group-hover:to-white/60"
                  : "from-white/20 via-white/15 to-white/10 group-hover:from-white/30 group-hover:via-white/20 group-hover:to-white/15"
              }`}
            />
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-xl ${
                  scrollY > 50 ? "!via-white/25" : ""
                }`}
              />
            </div>
            <span className="relative z-10 drop-shadow-lg">Vault Private Equity</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`rounded-lg p-2 transition-colors lg:hidden ${
            scrollY > 50 ? "hover:bg-gray-100" : "hover:bg-white/20"
          }`}
          aria-label="Toggle menu"
        >
          <Menu size={24} className={scrollY > 50 ? "text-gray-900" : "text-white"} />
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/30 lg:hidden"
            style={{ zIndex: 40 }}
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 lg:hidden" style={{ zIndex: 60 }}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="m-6 rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          <div className="relative border-t border-white/10 lg:hidden" style={{ zIndex: 50 }}>
            <div className="space-y-3 px-6 py-4">
              {items.map((item) => {
                const hash = item.toLowerCase().replace(/\s+/g, "-");

                return (
                  <a
                    key={item}
                    href={`#${hash}`}
                    className="block py-2 text-white/90 transition-colors hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                );
              })}
              <button className="group relative mt-2 w-full overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white/20 via-white/15 to-white/10 hover:from-white/30 hover:via-white/20 hover:to-white/15">
                <span className="relative z-10 drop-shadow-lg">Vault Private Equity</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

