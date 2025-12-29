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
    description: locale === "ua"
      ? "KLS Logistics — провідна логістична компанія, яка надає комплексні рішення для міжнародної доставки та логістики."
      : locale === "ru"
      ? "KLS Logistics — ведущая логистическая компания, предоставляющая комплексные решения для международной доставки и логистики."
      : "KLS Logistics is a leading logistics company providing comprehensive solutions for international shipping and logistics.",
    copyright: "© 2025 KLS. Всі права захищені.",
    navigation: "Навігація",
    services: "Послуги",
    support: "Підтримка",
    addresses: "Адреси",
    china: "Китай",
    ukraine: "Україна",
    tagline: locale === "ua"
      ? "Рухаємось відстанями, об'єднуємо доставкою."
      : locale === "ru"
      ? "Движемся расстояниями, объединяем доставкой."
      : "Driven by Distance, United by Delivery.",
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
    <footer ref={footerRef} id="site-footer" data-footer-id="site-footer" className="relative overflow-hidden py-20 text-white" style={{ backgroundColor: '#052430' }}>
      {/* Декоративні градієнтні елементи */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1.5fr]">
          <div className={`space-y-6 ${
            isVisible ? 'animate-slide-in-left' : ''
          }`}
          style={isVisible ? { animationDelay: '0.1s' } : { opacity: 0 }}
          >
            <Link href={`/${locale}`} className="flex items-center" aria-label="KLS home">
              <Image
                src="/ЛОГО(1).png"
                alt="KLS Logistics"
                width={120}
                height={36}
                className="h-8 w-auto md:h-10 brightness-0 invert"
                priority
              />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              {content.description}
            </p>
            <p className="text-xs text-white/60">
              {locale === "ua"
                ? "© 2025 KLS. Всі права захищені."
                : locale === "ru"
                ? "© 2025 KLS. Все права защищены."
                : "© 2025 KLS. All rights reserved."}
            </p>
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

          <div className={`space-y-6 ${
            isVisible ? 'animate-slide-in-right' : ''
          }`}
          style={isVisible ? { animationDelay: '0.5s' } : { opacity: 0 }}
          >
            {/* Соціальні мережі зверху */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/klslogistics"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center transition-all duration-200 hover:opacity-80"
                aria-label="Instagram"
              >
                <Image
                  src="/InstagramLogo.svg"
                  alt="Instagram"
                  width={32}
                  height={32}
                  className="brightness-0 invert transition-transform duration-200 group-hover:scale-110"
                />
              </a>
              <a
                href="https://www.tiktok.com/@klslogistics"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center transition-all duration-200 hover:opacity-80"
                aria-label="TikTok"
              >
                <Image
                  src="/TiktokLogo.svg"
                  alt="TikTok"
                  width={32}
                  height={32}
                  className="brightness-0 invert transition-transform duration-200 group-hover:scale-110"
                />
              </a>
              <a
                href="https://t.me/klslogistics"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center transition-all duration-200 hover:opacity-80"
                aria-label="Telegram"
              >
                <Image
                  src="/TelegramLogo.svg"
                  alt="Telegram"
                  width={32}
                  height={32}
                  className="brightness-0 invert transition-transform duration-200 group-hover:scale-110"
                />
              </a>
              <a
                href="https://www.facebook.com/klslogistics"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center transition-all duration-200 hover:opacity-80"
                aria-label="Facebook"
              >
                <Image
                  src="/FacebookLogo.svg"
                  alt="Facebook"
                  width={32}
                  height={32}
                  className="brightness-0 invert transition-transform duration-200 group-hover:scale-110"
                />
              </a>
            </div>

            {/* Контакти */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.35em] text-white/50 mb-4">
                {contactTitle}
              </h4>
              <div className="space-y-4">
                <a
                  href="https://t.me/KlsInternationalBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white text-sm font-medium"
                >
                  <Image
                    src="/TelegramLogo.svg"
                    alt="Telegram"
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                  <span>TELEGRAM-BOT</span>
                </a>
                <a
                  href="mailto:support@kls.international"
                  className="flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
                >
                  <Mail size={16} />
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
          <p className="mb-4 text-sm text-white/70">{content.tagline}</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] text-white/50">
              {content.developedBy}
            </span>
            <a
              href="https://new.telebots.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] text-white transition-all duration-200 hover:bg-white/20 hover:border-white/30"
            >
              <span>TELEBOTS</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
