"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown, Globe, Plus, Minus, User } from "lucide-react";
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
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileDeliveryOpen, setIsMobileDeliveryOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();
  const t = getTranslations(locale) ?? translations[defaultLocale];
  
  // Визначаємо, чи ми на головній сторінці
  const isHomePage = pathname === `/${locale}`;
  
  // Refs для таймерів затримки
  const deliveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
      if (deliveryTimeoutRef.current) clearTimeout(deliveryTimeoutRef.current);
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    };
  }, []);

  // Структура доставки з 3-рівневим меню
  const deliveryCategories = [
    {
      key: "ukraineTurnkey",
      href: `/${locale}/delivery/ukraine-turnkey`,
      items: [
        { key: "sea", href: `/${locale}/delivery/sea` },
        { key: "air", href: `/${locale}/delivery/air` },
        { key: "rail", href: `/${locale}/delivery/rail` },
        { key: "multimodal", href: `/${locale}/delivery/multimodal` },
      ],
    },
    {
      key: "euWorld",
      href: `/${locale}/delivery/eu-world`,
      items: [
        { key: "fba", href: `/${locale}/delivery/fba` },
        { key: "ddp", href: `/${locale}/delivery/ddp` },
        { key: "express", href: `/${locale}/delivery/express` },
        { key: "portToPort", href: `/${locale}/delivery/port-to-port` },
        { key: "crossBorder", href: `/${locale}/delivery/cross-border` },
      ],
    },
    {
      key: "international",
      href: `/${locale}/delivery/international`,
      items: [
        { key: "seaContainer", href: `/${locale}/delivery/sea-container` },
        { key: "airCargo", href: `/${locale}/delivery/air-cargo` },
        { key: "railCargo", href: `/${locale}/delivery/rail-cargo` },
        { key: "roadCargo", href: `/${locale}/delivery/road-cargo` },
      ],
    },
  ];

  // Структура послуг з 2-рівневим меню
  const servicesCategories = [
    {
      key: "warehousing",
      href: `/${locale}/services/warehousing`,
      items: [
        { key: "consolidation", href: `/${locale}/services/consolidation` },
        { key: "storage", href: `/${locale}/services/storage` },
        { key: "inspection", href: `/${locale}/services/inspection` },
        { key: "packaging", href: `/${locale}/services/packaging` },
      ],
    },
    { key: "payments", href: `/${locale}/services/payments` },
    { key: "customs", href: `/${locale}/services/customs` },
    { key: "local", href: `/${locale}/services/local` },
    { key: "sourcing", href: `/${locale}/services/sourcing` },
    { key: "insurance", href: `/${locale}/services/insurance` },
    { key: "forwarding", href: `/${locale}/services/forwarding` },
  ];

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
          <div
            className="relative"
            onMouseEnter={handleDeliveryMouseEnter}
            onMouseLeave={handleDeliveryMouseLeave}
          >
            <button
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
                isHomePage && scrollY <= 50
                  ? pathname?.includes("/delivery")
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                  : pathname?.includes("/delivery")
                  ? "bg-teal-100 text-teal-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
              }`}
            >
              {t.nav.delivery}
              <ChevronDown size={18} className={`transition-transform duration-200 ${isDeliveryOpen ? "rotate-180" : ""}`} />
            </button>
            {isDeliveryOpen && (
              <div 
                className="absolute top-full left-0 mt-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30 py-6 z-50"
                style={{
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
                  minWidth: "600px",
                  maxWidth: "800px"
                }}
                onMouseEnter={handleDeliveryMouseEnter}
                onMouseLeave={handleDeliveryMouseLeave}
              >
                <div className="grid grid-cols-3 gap-6">
                  {deliveryCategories.map((category) => {
                    const categoryText = t.delivery[category.key as keyof typeof t.delivery];
                    return (
                      <div key={category.key} className="space-y-2">
                        <Link
                          href={category.href}
                          className="block px-3 py-2 text-base font-semibold text-gray-900 hover:text-teal-700 transition-colors border-b border-gray-200"
                        >
                          {typeof categoryText === 'string' ? categoryText : category.key}
                        </Link>
                        {category.items && category.items.length > 0 && (
                          <div className="space-y-1">
                            {category.items.map((item) => {
                              const itemText = t.delivery[item.key as keyof typeof t.delivery];
                              return (
                                <Link
                                  key={item.key}
                                  href={item.href}
                                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-teal-50/80 hover:text-teal-700 rounded-md transition-all duration-200"
                                >
                                  {typeof itemText === 'string' ? itemText : item.key}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          >
            <button
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-lg font-semibold transition-all duration-300 ${
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
              <ChevronDown size={18} className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
            </button>
            {isServicesOpen && (
              <div 
                className="absolute top-full left-0 mt-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/30 py-6 z-50"
                style={{
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
                  minWidth: "500px",
                  maxWidth: "700px"
                }}
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <div className="grid grid-cols-2 gap-6">
                  {servicesCategories.map((category) => {
                    const categoryText = t.services[category.key as keyof typeof t.services];
                    const hasItems = category.items && category.items.length > 0;
                    return (
                      <div key={category.key} className="space-y-2">
                        <Link
                          href={category.href}
                          className="block px-3 py-2 text-base font-semibold text-gray-900 hover:text-teal-700 transition-colors border-b border-gray-200"
                        >
                          {typeof categoryText === 'string' ? categoryText : category.key}
                        </Link>
                        {hasItems && (
                          <div className="space-y-1">
                            {category.items!.map((item) => {
                              const itemText = t.services[item.key as keyof typeof t.services];
                              return (
                                <Link
                                  key={item.key}
                                  href={item.href}
                                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-teal-50/80 hover:text-teal-700 rounded-md transition-all duration-200"
                                >
                                  {typeof itemText === 'string' ? itemText : item.key}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
                {/* Доставка з підсекціями */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileDeliveryOpen(!isMobileDeliveryOpen);
                      if (!isMobileDeliveryOpen) {
                        setIsMobileServicesOpen(false);
                        setIsMobileLangOpen(false);
                      }
                    }}
                    className="flex w-full items-center justify-between py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                  >
                    <span>{t.nav.delivery}</span>
                    {isMobileDeliveryOpen ? (
                      <Minus size={20} className="text-white flex-shrink-0" />
                    ) : (
                      <Plus size={20} className="text-white flex-shrink-0" />
                    )}
                  </button>
                  {isMobileDeliveryOpen && (
                    <div className="space-y-2 pl-2 pr-2">
                      {deliveryCategories.map((category) => {
                        const categoryText = t.delivery[category.key as keyof typeof t.delivery];
                        return (
                          <div key={category.key} className="space-y-1">
                            <Link
                              href={category.href}
                              className="block py-2 px-3 text-base font-semibold text-white transition-colors hover:text-teal-300 hover:bg-white/5 rounded-lg"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {typeof categoryText === 'string' ? categoryText : category.key}
                            </Link>
                            {category.items && category.items.length > 0 && (
                              <div className="space-y-0.5 pl-3 border-l-2 border-white/20">
                                {category.items.map((item) => {
                                  const itemText = t.delivery[item.key as keyof typeof t.delivery];
                                  return (
                                    <Link
                                      key={item.key}
                                      href={item.href}
                                      className="block py-1.5 px-3 text-sm text-white/80 transition-colors hover:text-teal-300 hover:bg-white/5 rounded-md"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {typeof itemText === 'string' ? itemText : item.key}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Послуги з підсекціями */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileServicesOpen(!isMobileServicesOpen);
                      if (!isMobileServicesOpen) {
                        setIsMobileDeliveryOpen(false);
                        setIsMobileLangOpen(false);
                      }
                    }}
                    className="flex w-full items-center justify-between py-3 px-2 text-lg font-semibold text-white transition-colors hover:text-teal-300 rounded-lg hover:bg-white/5"
                  >
                    <span>{t.nav.services}</span>
                    {isMobileServicesOpen ? (
                      <Minus size={20} className="text-white flex-shrink-0" />
                    ) : (
                      <Plus size={20} className="text-white flex-shrink-0" />
                    )}
                  </button>
                  {isMobileServicesOpen && (
                    <div className="space-y-2 pl-2 pr-2">
                      {servicesCategories.map((category) => {
                        const categoryText = t.services[category.key as keyof typeof t.services];
                        const hasItems = category.items && category.items.length > 0;
                        return (
                          <div key={category.key} className="space-y-1">
                            <Link
                              href={category.href}
                              className="block py-2 px-3 text-base font-semibold text-white transition-colors hover:text-teal-300 hover:bg-white/5 rounded-lg"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {typeof categoryText === 'string' ? categoryText : category.key}
                            </Link>
                            {hasItems && (
                              <div className="space-y-0.5 pl-3 border-l-2 border-white/20">
                                {category.items!.map((item) => {
                                  const itemText = t.services[item.key as keyof typeof t.services];
                                  return (
                                    <Link
                                      key={item.key}
                                      href={item.href}
                                      className="block py-1.5 px-3 text-sm text-white/80 transition-colors hover:text-teal-300 hover:bg-white/5 rounded-md"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {typeof itemText === 'string' ? itemText : item.key}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                      if (!isMobileLangOpen) {
                        setIsMobileDeliveryOpen(false);
                        setIsMobileServicesOpen(false);
                      }
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
