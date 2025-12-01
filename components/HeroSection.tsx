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
        <div className="max-w-4xl">
          <h1 
            className={`mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl ${
              isVisible ? 'animate-slide-in-left' : ''
            }`}
            style={isVisible ? { animationDelay: '0.1s' } : { opacity: 0 }}
          >
            {hero.title ?? "Міжнародна логістика для вашого бізнесу"}
          </h1>

          <p 
            className={`mb-12 max-w-3xl text-lg leading-relaxed text-white/95 md:text-xl lg:text-2xl ${
              isVisible ? 'animate-slide-in-right' : ''
            }`}
            style={isVisible ? { animationDelay: '0.3s' } : { opacity: 0 }}
          >
            {hero.description ??
              "Організуємо доставку вантажів з Китаю та інших країн з повним супроводом і прозорими умовами."}
          </p>

          <div 
            className={`flex flex-row items-center gap-3 ${
              isVisible ? 'animate-slide-in-bottom' : ''
            }`}
            style={isVisible ? { animationDelay: '0.5s' } : { opacity: 0 }}
          >
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="group relative overflow-hidden rounded-xl bg-teal-600 px-4 py-4 text-sm font-semibold text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-teal-700 btn-primary sm:px-8 sm:text-base flex-1 sm:flex-none text-center flex items-center justify-center"
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
              className="group relative overflow-hidden rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 sm:px-8 sm:text-base flex-1 sm:flex-none text-center flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              <span className="relative z-10">
                {hero.calculateCost ?? "Розрахувати вартість"}
              </span>
            </button>
          </div>

          <p 
            className={`mt-8 text-sm text-white/80 ${
              isVisible ? 'animate-slide-in-top' : ''
            }`}
            style={isVisible ? { animationDelay: '0.7s' } : { opacity: 0 }}
          >
            {hero.trusted ?? "Нам довіряють компанії з України, ЄС та США."}
          </p>
        </div>
      </div>

      <ContactQuickModal
        locale={locale}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
}