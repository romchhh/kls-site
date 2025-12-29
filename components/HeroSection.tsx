"use client";

import { useEffect, useRef, useState } from "react";
import { Locale, getTranslations } from "../lib/translations/index";
import { LiquidGlassButton } from "./LiquidGlassButton";
import { ContactQuickModal } from "./ContactQuickModal";

type HeroSectionProps = {
  locale: Locale;
};

export function HeroSection({ locale }: HeroSectionProps) {
  const t = getTranslations(locale) as any;
  const hero = t?.hero || {};
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("playsinline", "true");
      video.muted = true;
      video.defaultMuted = true;
      video.controls = false;
      
      // Приховати всі елементи плеєра через CSS
      video.style.outline = 'none';
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      }
    }

    // Запускаємо анімації після завантаження
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/hero-background.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        disablePictureInPicture
        disableRemotePlayback
        style={{
          pointerEvents: 'none',
          objectFit: 'cover',
          outline: 'none',
          border: 'none'
        }}
      />

      <div className="absolute inset-0 z-[5] bg-black/50" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 pt-40 lg:px-8">
        <div>
          <h1 
            className={`mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl font-heading ${
              isVisible ? 'animate-slide-in-left' : ''
            }`}
            style={{
              ...(isVisible ? { animationDelay: '0.1s' } : { opacity: 0 }),
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
            }}
          >
            {(hero.title ?? "Доставка з Китаю в Україну та по всьому світу").split(" та по ").map((part: string, index: number) => (
              index === 0 ? (
                <span key={index}>{part} та </span>
              ) : (
                <span key={index}>
                  <br />
                  по {part}
                </span>
              )
            ))}
          </h1>

          <p 
            className={`mb-6 max-w-3xl text-base leading-relaxed text-white/95 md:text-lg lg:text-xl ${
              isVisible ? 'animate-slide-in-right' : ''
            }`}
            style={{
              ...(isVisible ? { animationDelay: '0.3s' } : { opacity: 0 }),
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
              fontWeight: 400,
            }}
          >
            {hero.description ??
              "Твоя логістика — без зайвих турбот: беремо на себе весь шлях від постачальника до дверей клієнта."}
          </p>

          <div 
            className={`flex flex-row items-center gap-3 ${
              isVisible ? 'animate-slide-in-bottom' : ''
            }`}
            style={isVisible ? { animationDelay: '0.5s' } : { opacity: 0 }}
          >
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 px-6 text-sm font-semibold text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:from-teal-600 hover:via-teal-700 hover:to-teal-800 sm:h-14 sm:w-[230px] sm:text-base"
            >
              <span className="relative z-10">
                {hero.getInTouch ?? "Звʼязатися з менеджером"}
              </span>
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('cost-calculation');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/20 sm:h-14 sm:w-[230px] sm:text-base"
              style={{
                background: "rgba(255, 255, 255, 0.14)",
                backdropFilter: "blur(30px) saturate(200%)",
                WebkitBackdropFilter: "blur(30px) saturate(200%)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              <span className="relative z-10">
                {hero.calculateCost ?? "Розрахувати вартість"}
              </span>
            </button>
          </div>

          {/* Додатковий текст під кнопками тимчасово прихований за побажанням */}
        </div>
      </div>

      <ContactQuickModal
        locale={locale}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      
      <style jsx>{`
        section#home p {
          font-weight: 400 !important;
        }
      `}</style>
    </section>
  );
}