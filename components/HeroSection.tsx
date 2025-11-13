"use client";

import { useEffect, useRef } from "react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("playsinline", "true");
      video.muted = true; // Ensure muted for autoplay
      video.defaultMuted = true;
      
      // Try to play with a slight delay for better mobile support
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
          // If autoplay fails, ensure controls are visible
          video.setAttribute("controls", "true");
        });
      }
    }
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/clideo_editor_1cb1efe9996b44ff9b86c9e1efe15542.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-[5] bg-black/30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 pt-40 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            GROW. PRESERVE. REPEAT.
          </h1>

          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-white/95 md:text-xl lg:text-2xl">
            Vault Partners, as a multidisciplinary services firm empowers growth-oriented companies,
            investment firms and entrepreneurs as well as established HNWIs.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="group relative overflow-hidden rounded-xl px-8 py-4 text-base font-semibold shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/15 to-white/10 transition-all duration-500 group-hover:from-white/30 group-hover:via-white/20 group-hover:to-white/15"></div>
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-xl"></div>
              </div>
              <span className="relative z-10 text-white drop-shadow-lg">Discover More</span>
            </button>

            <button className="group relative overflow-hidden rounded-xl border border-white/20 px-8 py-4 text-base font-semibold shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent transition-all duration-500 group-hover:from-white/15 group-hover:via-white/8 group-hover:to-white/3"></div>
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-xl"></div>
              </div>
              <span className="relative z-10 text-white drop-shadow-lg">Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

