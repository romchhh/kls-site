"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const t = getTranslations(locale);
  const content = t?.footer || {
    description: "KLS Logistics",
    copyright: "© 2024 KLS Logistics. All rights reserved.",
    navigation: "Навігація",
    services: "Послуги",
    support: "Підтримка",
    addresses: "Адреси",
    china: "Китай",
    ukraine: "Україна",
    tagline: "Глобальна доставка. Локальна експертиза.",
    developedBy: "Розроблено",
  };
  
  const navT = (t as any)?.nav || {};

  // Посилання з хедера / основних сторінок
  const nav = [
    { label: navT.home ?? "Головна", href: `/${locale}` },
    { label: navT.delivery ?? "Доставка", href: `/${locale}#delivery` },
    { label: navT.services ?? "Послуги", href: `/${locale}/services` },
    { label: navT.contacts ?? "Контакти", href: `/${locale}/contacts` },
    { label: navT.cabinet ?? "Кабінет", href: `/${locale}/cabinet` },
  ];

  // Контакти (телеграм + пошта)
  const contactTitle =
    locale === "ua"
      ? "Контакти"
      : locale === "ru"
      ? "Контакты"
      : "Contacts";
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
  },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} id="site-footer" data-footer-id="site-footer" className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18)_0%,_rgba(2,6,23,0)_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(20,184,166,0.12)_0%,_rgba(20,184,166,0)_55%),linear-gradient(320deg,rgba(20,184,166,0.2)_0%,_rgba(20,184,166,0)_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1.5fr]">
          <div className={`space-y-6 ${
            isVisible ? 'animate-slide-in-left' : ''
          }`}
          style={isVisible ? { animationDelay: '0.1s' } : { opacity: 0 }}
          >
            <Link href={`/${locale}`} className="flex items-center" aria-label="KLS home">
              <Image
                src="/ЛОГО.png"
                alt="KLS Logistics"
                width={140}
                height={42}
                className="h-8 w-auto md:h-10"
                priority
              />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              {content.description}
            </p>
            <p className="text-xs text-white/60">{content.copyright}</p>
          </div>

          <div className={isVisible ? 'animate-slide-in-bottom' : ''}
            style={isVisible ? { animationDelay: '0.2s' } : { opacity: 0 }}
          >
            <h4 className="text-xs uppercase tracking-[0.35em] text-white/50">
              {content.navigation}
            </h4>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              {nav.map((link, index) => (
                <Link
                  key={`nav-${link.href}-${index}`}
                  href={link.href}
                  className="block transition-colors duration-300 hover:text-teal-400"
                  >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={`space-y-8 ${
            isVisible ? 'animate-slide-in-right' : ''
          }`}
          style={isVisible ? { animationDelay: '0.5s' } : { opacity: 0 }}
          >
            <div>
              <h4 className="text-xs uppercase tracking-[0.35em] text-white/50">
                {contactTitle}
              </h4>
              <div className="mt-6 space-y-4 text-sm text-white/75">
                <a
                  href="https://t.me/KlsInternationalBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-teal-400"
                >
                  <MapPin size={14} className="hidden" />
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-teal-400" />
                    Telegram: @KlsInternationalBot
                  </span>
                </a>
                <a
                  href="mailto:support@kls.international"
                  className="flex items-center gap-2 transition-colors hover:text-teal-400"
                >
                  <Mail size={14} />
                  support@kls.international
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-16 border-t border-white/10 pt-8 text-center ${
          isVisible ? 'animate-slide-in-top' : ''
        }`}
        style={isVisible ? { animationDelay: '0.6s' } : { opacity: 0 }}
        >
          <p className="mb-3 text-xs text-white/50">{content.tagline}</p>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
              {content.developedBy}
            </span>
            <a
              href="https://new.telebots.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/50 transition-colors duration-200 hover:text-white hover:border-white/20"
            >
              <span>TELEBOTS</span>
              <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
