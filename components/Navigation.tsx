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
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isMobileDeliveryOpen, setIsMobileDeliveryOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const t = getTranslations(locale) ?? translations[defaultLocale];
  
  // Визначаємо, чи ми на головній сторінці
  const isHomePage = pathname === `/${locale}`;
  
  // Refs для таймерів затримки
  const langTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deliveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleDeliveryMouseEnter = () => {
    if (deliveryTimeoutRef.current) {
      clearTimeout(deliveryTimeoutRef.current);
    }
    setIsDeliveryOpen(true);
  };

  const handleDeliveryMouseLeave = () => {
    deliveryTimeoutRef.current = setTimeout(() => {
      setIsDeliveryOpen(false);
    }, 200);
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  // Очистка таймерів при розмонтуванні
  useEffect(() => {
    return () => {
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
      if (deliveryTimeoutRef.current) clearTimeout(deliveryTimeoutRef.current);
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    };
  }, []);

  // Категорії доставки
  const deliveryCategories = [
    {
      name: locale === "ua" ? "Доставка в Україну під ключ" : locale === "ru" ? "Доставка в Украину под ключ" : "Delivery to Ukraine Turnkey",
      href: `/${locale}/delivery/ukraine-turnkey`,
    },
    {
      name: locale === "ua" ? "Доставка в країни ЄС та світу" : locale === "ru" ? "Доставка в страны ЕС и мира" : "Delivery to EU and World",
      href: `/${locale}/delivery/eu-world`,
    },
    {
      name: locale === "ua" ? "Міжнародне перевезення та експедирування" : locale === "ru" ? "Международные перевозки и экспедирование" : "International Transportation and Forwarding",
      href: `/${locale}/delivery/international`,
    },
  ];

  // Категорії послуг
  const servicesCategories = [
    {
      name: t.services.warehousing,
      href: `/${locale}/services/warehousing`,
    },
    {
      name: t.services.payments,
      href: `/${locale}/services/payments`,
    },
    {
      name: t.services.sourcing,
      href: `/${locale}/services/sourcing`,
    },
    {
      name: t.services.insurance,
      href: `/${locale}/services/insurance`,
    },
    {
      name: t.services.local,
      href: `/${locale}/services/local`,
    },
    {
      name: t.services.customs,
      href: `/${locale}/services/customs`,
    },
    {
      name: t.services.forwarding,
      href: `/${locale}/services/forwarding`,
    },
  ];


  const getLocalizedPath = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    return `/${newLocale}${pathWithoutLocale}`;
  };

  // Логотип - завжди використовуємо ЛОГО(1).png
  const logoSrc = "/logos/ЛОГО(1).png";

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
              src={logoSrc}
              alt="KLS Logistics"
              width={120}
              height={36}
              priority
              className={`h-7 w-auto md:h-8 transition-opacity ${
                isHomePage && scrollY <= 50
                  ? "opacity-100"
                  : "opacity-90 hover:opacity-100"
              }`}
            />
          </Link>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="hidden items-center space-x-6 lg:flex">
            <div
              className="relative"
              onMouseEnter={handleDeliveryMouseEnter}
              onMouseLeave={handleDeliveryMouseLeave}
            >
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
                    ? "text-white/90 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {t.nav.delivery}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${isDeliveryOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </Link>
              {isDeliveryOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30 py-2 z-50"
                  style={{
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)"
                  }}
                  onMouseEnter={handleDeliveryMouseEnter}
                  onMouseLeave={handleDeliveryMouseLeave}
                >
                  {deliveryCategories.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      className={`block px-4 py-3 text-base rounded-lg mx-2 transition-all duration-200 ${
                        pathname === category.href
                          ? "bg-teal-50/80 text-teal-700 font-medium"
                          : "text-gray-700 hover:bg-teal-50/80 hover:text-teal-700"
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <Link
                href={`/${locale}/services`}
                className={`rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                  isHomePage && scrollY <= 50
                    ? pathname?.includes("/services")
                      ? "text-white"
                      : "text-white/90 hover:text-white"
                    : pathname?.includes("/services")
                    ? "text-teal-700"
                    : "text-gray-700 hover:text-teal-700"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {t.nav.services}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </Link>
              {isServicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30 py-2 z-50"
                  style={{
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)"
                  }}
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  {servicesCategories.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      className={`block px-4 py-3 text-base rounded-lg mx-2 transition-all duration-200 ${
                        pathname === category.href
                          ? "bg-teal-50/80 text-teal-700 font-medium"
                          : "text-gray-700 hover:bg-teal-50/80 hover:text-teal-700"
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/contacts`}
              className={`rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                isHomePage && scrollY <= 50
                  ? pathname === `/${locale}/contacts`
                    ? "text-white"
                    : "text-white/90 hover:text-white"
                  : pathname === `/${locale}/contacts`
                  ? "text-teal-700"
                  : "text-gray-700 hover:text-teal-700"
              }`}
            >
              {t.nav.contacts}
            </Link>
          </div>
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
            className="group relative overflow-hidden flex items-center gap-2 rounded-xl px-6 py-3.5 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#006D77' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#005a63';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#006D77';
            }}
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
                src={logoSrc}
                alt="KLS Logistics"
                width={120}
                height={36}
                priority
                className="h-8 w-auto transition-opacity opacity-100"
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
            <div className="flex-1 overflow-y-auto px-4 pt-32 pb-20">
              <div className="mx-auto max-w-md space-y-3">
                {/* Доставка з підсекціями */}
                <div className="space-y-1">
                  <div className="flex w-full items-center justify-between">
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
                      className="flex-1 py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                    >
                      {t.nav.delivery}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMobileDeliveryOpen(!isMobileDeliveryOpen);
                      }}
                      className="p-2 text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                    >
                      {isMobileDeliveryOpen ? (
                        <Minus size={20} className="flex-shrink-0" />
                      ) : (
                        <Plus size={20} className="flex-shrink-0" />
                      )}
                    </button>
                  </div>
                  {isMobileDeliveryOpen && (
                    <div className="space-y-1 pl-2 pr-2">
                      {deliveryCategories.map((category, index) => (
                        <Link
                          key={index}
                          href={category.href}
                          className={`block py-2 px-3 text-base transition-colors rounded-lg hover:bg-white/5 ${
                            pathname === category.href
                              ? "text-teal-300 font-semibold bg-white/10"
                              : "text-white/80 hover:text-teal-300"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Послуги з підсекціями */}
                <div className="space-y-1">
                  <div className="flex w-full items-center justify-between">
                    <Link
                      href={`/${locale}/services`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                    >
                      {t.nav.services}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsMobileServicesOpen(!isMobileServicesOpen);
                      }}
                      className="p-2 text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                    >
                      {isMobileServicesOpen ? (
                        <Minus size={20} className="flex-shrink-0" />
                      ) : (
                        <Plus size={20} className="flex-shrink-0" />
                      )}
                    </button>
                  </div>
                  {isMobileServicesOpen && (
                    <div className="space-y-1 pl-2 pr-2">
                      {servicesCategories.map((category, index) => (
                        <Link
                          key={index}
                          href={category.href}
                          className={`block py-2 px-3 text-base transition-colors rounded-lg hover:bg-white/5 ${
                            pathname === category.href
                              ? "text-teal-300 font-semibold bg-white/10"
                              : "text-white/80 hover:text-teal-300"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
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
                    className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 active:scale-95"
                    style={{ backgroundColor: '#006D77' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#005a63';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#006D77';
                    }}
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
