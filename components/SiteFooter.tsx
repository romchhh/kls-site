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
  const content = t.footer;
  const nav = content.navLinks;
  const services = content.serviceLinks;
  const support = content.supportLinks;
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
    <footer ref={footerRef} id="contact" className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18)_0%,_rgba(2,6,23,0)_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(20,184,166,0.12)_0%,_rgba(20,184,166,0)_55%),linear-gradient(320deg,rgba(20,184,166,0.2)_0%,_rgba(20,184,166,0)_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1.5fr_1.5fr]">
          <div className={`space-y-6 ${
            isVisible ? 'animate-slide-in-left' : ''
          }`}
          style={isVisible ? { animationDelay: '0.1s' } : { opacity: 0 }}
          >
            <Link href={`/${locale}`} className="flex items-center" aria-label="KLS home">
              <Image
                src="/бірюза на прозорому2x.png"
                alt="KLS"
                width={240}
                height={75}
                className="h-16 w-auto"
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

          <div className={isVisible ? 'animate-slide-in-bottom' : ''}
            style={isVisible ? { animationDelay: '0.3s' } : { opacity: 0 }}
          >
            <h4 className="text-xs uppercase tracking-[0.35em] text-white/50">
              {content.services}
            </h4>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              {services.map((link, index) => (
                <Link
                  key={`service-${link.href}-${index}`}
                  href={link.href}
                  className="block transition-colors duration-300 hover:text-teal-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={isVisible ? 'animate-slide-in-bottom' : ''}
            style={isVisible ? { animationDelay: '0.4s' } : { opacity: 0 }}
          >
            <h4 className="text-xs uppercase tracking-[0.35em] text-white/50">
              {content.support}
            </h4>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              {support.map((link, index) => (
                <Link
                  key={`support-${link.href}-${index}`}
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
                {content.addresses}
              </h4>
              <div className="mt-6 space-y-6 text-sm text-white/75">
                <div>
                  <p className="mb-2 flex items-center gap-2 font-medium text-white">
                    <MapPin size={14} /> {content.china}
                  </p>
                  <p className="mb-1">
                    Room 1203, Tower A, Jin Mao Building, 88 Century Avenue, Pudong New Area,
                    Shanghai, 200120, China
                  </p>
                  <a
                    href="tel:+862155551234"
                    className="flex items-center gap-2 transition-colors hover:text-teal-400"
                  >
                    <Phone size={14} /> +86 21 5555 1234
                  </a>
                  <a
                    href="mailto:info@klslogistics.cn"
                    className="flex items-center gap-2 transition-colors hover:text-teal-400"
                  >
                    <Mail size={14} /> info@klslogistics.cn
                  </a>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-2 font-medium text-white">
                    <MapPin size={14} /> {content.ukraine}
                  </p>
                  <p className="mb-1">
                    Office 402, Business Center "Optima Plaza", 38 Naukova Street, Lviv, 79060,
                    Ukraine
                  </p>
                  <a
                    href="tel:+380322294567"
                    className="flex items-center gap-2 transition-colors hover:text-teal-400"
                  >
                    <Phone size={14} /> +380 32 229 4567
                  </a>
                  <a
                    href="mailto:support@klslogistics.ua"
                    className="flex items-center gap-2 transition-colors hover:text-teal-400"
                  >
                    <Mail size={14} /> support@klslogistics.ua
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-16 border-t border-white/10 pt-8 text-center ${
          isVisible ? 'animate-slide-in-top' : ''
        }`}
        style={isVisible ? { animationDelay: '0.6s' } : { opacity: 0 }}
        >
          <p className="mb-4 text-sm text-white/60">{content.tagline}</p>
          <p className="text-xs text-white/50">
            {content.developedBy}{" "}
            <a
              href="https://telebots.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-teal-400"
            >
              TeleBots
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
