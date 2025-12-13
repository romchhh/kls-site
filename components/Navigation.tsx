"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown, Globe, Plus, Minus, User, ArrowRight } from "lucide-react";
import {
  Locale,
  getTranslations,
  locales,
  defaultLocale,
  translations,
} from "../lib/translations";

type NavigationProps = {
  locale: Locale;
};

export function Navigation({ locale }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const t = getTranslations(locale) ?? translations[defaultLocale];
  
  // Визначаємо, чи ми на головній сторінці
  const isHomePage = pathname === `/${locale}`;
  
  // Refs для таймерів затримки
  const langTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      return () => {
        document.body.style.overflow = original;
        document.body.style.position = "";
        document.body.style.width = "";
      };
    }
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    return undefined;
  }, [isMenuOpen]);

  // Функції для обробки з затримкою
  const handleLangMouseEnter = () => {
    if (langTimeoutRef.current) {
      clearTimeout(langTimeoutRef.current);
    }
    setIsLangOpen(true);
  };

  const handleLangMouseLeave = () => {
    langTimeoutRef.current = setTimeout(() => {
      setIsLangOpen(false);
    }, 200);
  };

  // Очистка таймерів при розмонтуванні
  useEffect(() => {
    return () => {
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    };
  }, []);


  const getLocalizedPath = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    return `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <nav className="fixed z-50 w-full transition-all duration-300 pt-4 px-4">
      <div
        className={`mx-auto flex h-20 max-w-7xl items-center justify-between rounded-2xl px-8 transition-all duration-300 ${
          isHomePage 
            ? (scrollY > 50 ? "nav-glass" : "nav-glass-transparent")
            : "nav-glass"
        }`}
      >
        <div className="flex items-center">
          <Link href={`/${locale}`} aria-label="KLS home">
            <Image
              src="/turquoise-transparent-2x.png"
              alt="KLS"
              width={280}
              height={84}
              priority
              className={`h-20 w-auto transition-opacity ${
                isHomePage && scrollY > 50 
                  ? "opacity-80 hover:opacity-100" 
                  : "opacity-100"
              }`}
            />
          </Link>
        </div>

        <div className="hidden items-center space-x-6 lg:flex">
          <Link
            href={isHomePage ? "#delivery" : `/${locale}#delivery`}
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                const element = document.getElementById('delivery');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              } else {
                // Якщо не на головній, переходимо на головну і скролимо
                e.preventDefault();
                window.location.href = `/${locale}#delivery`;
                setTimeout(() => {
                  const element = document.getElementById('delivery');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }
            }}
            className={`rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
              isHomePage && scrollY <= 50
                ? "text-white/90 hover:bg-white/10 hover:text-white"
                : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
          >
            {t.nav.delivery}
          </Link>

          <Link
            href={`/${locale}/services`}
            className={`rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
              isHomePage && scrollY <= 50
                ? pathname?.includes("/services")
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
                : pathname?.includes("/services")
                ? "bg-teal-100 text-teal-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
          >
            {t.nav.services}
          </Link>

          <Link
            href={`/${locale}/contacts`}
            className={`rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
              isHomePage && scrollY <= 50
                ? pathname === `/${locale}/contacts`
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
                : pathname === `/${locale}/contacts`
                ? "bg-teal-100 text-teal-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
          >
            {t.nav.contacts}
          </Link>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <div
            className="relative"
            onMouseEnter={handleLangMouseEnter}
            onMouseLeave={handleLangMouseLeave}
          >
            <button
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                isHomePage && scrollY <= 50
                  ? "text-white/90 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Globe size={18} />
              {locale.toUpperCase()}
              <ChevronDown size={18} className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
            </button>
            {isLangOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-32 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30 py-2 z-50"
                style={{
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)"
                }}
                onMouseEnter={handleLangMouseEnter}
                onMouseLeave={handleLangMouseLeave}
              >
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={getLocalizedPath(loc)}
                    className={`block px-4 py-2.5 text-base rounded-lg mx-2 transition-all duration-200 ${
                      loc === locale
                        ? "bg-teal-50/80 text-teal-700 font-medium"
                        : "text-gray-700 hover:bg-teal-50/80 hover:text-teal-700"
                    }`}
                  >
                    {loc === "ua" ? "UA" : loc === "ru" ? "RU" : "EN"}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/cabinet`}
            className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-gray-800 px-6 py-3.5 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gray-700 hover:scale-105"
          >
            <User size={18} className="relative z-10" />
            <span className="relative z-10">{t.nav.cabinet}</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`rounded-xl p-2.5 transition-all duration-300 lg:hidden backdrop-blur-sm ${
            isHomePage && scrollY <= 50
              ? "hover:bg-white/20 bg-white/10 border border-white/20"
              : "hover:bg-gray-100/80 bg-white/50 border border-gray-200/50"
          }`}
          aria-label="Toggle menu"
        >
          <Menu size={28} className={isHomePage && scrollY <= 50 ? "text-white" : "text-gray-900"} />
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/40 lg:hidden"
            style={{ zIndex: 40 }}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Лого в бургер-меню */}
          <div className="fixed top-4 left-4 lg:hidden z-50 flex items-center" style={{ height: '96px' }}>
            <Link href={`/${locale}`} aria-label="KLS home" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/turquoise-transparent-2x.png"
                alt="KLS"
                width={280}
                height={84}
                priority
                className="h-24 w-auto transition-opacity opacity-100"
              />
            </Link>
          </div>
          
          {/* Хрестик закриття */}
          <div className="fixed top-4 right-4 lg:hidden z-50 flex items-center" style={{ height: '96px', zIndex: 60 }}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-xl p-2.5 transition-all duration-300 backdrop-blur-sm ${
                isHomePage && scrollY <= 50
                  ? "hover:bg-white/20 bg-white/10 border border-white/20"
                  : "hover:bg-gray-100/80 bg-white/50 border border-gray-200/50"
              }`}
              aria-label="Close menu"
            >
              <X size={28} className={isHomePage && scrollY <= 50 ? "text-white" : "text-gray-900"} />
            </button>
          </div>
          
          <div className="fixed inset-0 flex flex-col lg:hidden" style={{ zIndex: 50 }}>
            <div className="flex-1 overflow-y-auto px-4 py-20">
              <div className="mx-auto max-w-md space-y-3">
                {/* Доставка */}
                <Link
                  href={isHomePage ? "#delivery" : `/${locale}#delivery`}
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    if (isHomePage) {
                      e.preventDefault();
                      setTimeout(() => {
                        const element = document.getElementById('delivery');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    } else {
                      e.preventDefault();
                      window.location.href = `/${locale}#delivery`;
                      setTimeout(() => {
                        const element = document.getElementById('delivery');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  className="flex w-full items-center justify-between py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                >
                  <span>{t.nav.delivery}</span>
                  <ArrowRight size={20} className="text-white flex-shrink-0" />
                </Link>

                {/* Послуги з підсекціями */}
                <div className="space-y-1">
                  <Link
                    href={`/${locale}/services`}
                    className="flex w-full items-center justify-between py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{t.nav.services}</span>
                    <ArrowRight size={20} className="text-white flex-shrink-0" />
                  </Link>
                </div>

                {/* Контакти */}
                <Link
                  href={`/${locale}/contacts`}
                  className="block py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.contacts}
                </Link>

                {/* Кабінет */}
                <div className="pt-2">
                  <Link
                    href={`/${locale}/cabinet`}
                    className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gray-800 text-white font-semibold shadow-lg transition-all duration-300 hover:bg-gray-700 active:scale-95"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="relative z-10" />
                    <span className="relative z-10 text-lg">{t.nav.cabinet}</span>
                  </Link>
                </div>

                {/* Мова з dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileLangOpen(!isMobileLangOpen);
                    }}
                    className="flex w-full items-center justify-between py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={18} />
                      {locale.toUpperCase()}
                    </span>
                    {isMobileLangOpen ? (
                      <Minus size={20} className="text-white flex-shrink-0" />
                    ) : (
                      <Plus size={20} className="text-white flex-shrink-0" />
                    )}
                  </button>
                  {isMobileLangOpen && (
                    <div className="space-y-1 pl-2 pr-2">
                      {locales.map((loc) => (
                        <Link
                          key={loc}
                          href={getLocalizedPath(loc)}
                          className={`block py-2 px-3 text-base transition-colors rounded-lg hover:bg-white/5 ${
                            loc === locale
                              ? "text-teal-300 font-semibold bg-white/10"
                              : "text-white/80 hover:text-teal-300"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {loc === "ua" ? "UA" : loc === "ru" ? "RU" : "EN"}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
