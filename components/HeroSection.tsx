"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Locale, getTranslations } from "../lib/translations/index";
import { LiquidGlassButton } from "./LiquidGlassButton";

type HeroSectionProps = {
  locale: Locale;
};

export function HeroSection({ locale }: HeroSectionProps) {
  const t = getTranslations(locale);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
            {t.hero.title}
          </h1>

          <p 
            className={`mb-12 max-w-3xl text-lg leading-relaxed text-white/95 md:text-xl lg:text-2xl ${
              isVisible ? 'animate-slide-in-right' : ''
            }`}
            style={isVisible ? { animationDelay: '0.3s' } : { opacity: 0 }}
          >
            {t.hero.description}
          </p>

          <div 
            className={`flex flex-row items-center gap-3 ${
              isVisible ? 'animate-slide-in-bottom' : ''
            }`}
            style={isVisible ? { animationDelay: '0.5s' } : { opacity: 0 }}
          >
            <Link
              href={`/${locale}/contacts`}
              className="group relative overflow-hidden rounded-xl bg-teal-600 px-4 py-4 text-sm font-semibold text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-teal-700 btn-primary sm:px-8 sm:text-base flex-1 sm:flex-none text-center flex items-center justify-center"
            >
              <span className="relative z-10">{t.hero.calculateCost}</span>
            </Link>

            <div className="flex-1 sm:flex-none flex items-center">
              <LiquidGlassButton 
                href={`/${locale}/contacts`}
                variant="transparent"
              >
                {t.hero.getInTouch}
              </LiquidGlassButton>
            </div>
          </div>

          <p 
            className={`mt-8 text-sm text-white/80 ${
              isVisible ? 'animate-slide-in-top' : ''
            }`}
            style={isVisible ? { animationDelay: '0.7s' } : { opacity: 0 }}
          >
            {t.hero.trusted}
          </p>
        </div>
      </div>
    </section>
  );
}