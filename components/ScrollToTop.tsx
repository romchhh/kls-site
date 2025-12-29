"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{
        background: "rgba(20, 184, 166, 0.7)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: 
          "0 8px 32px 0 rgba(0, 0, 0, 0.2), " +
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.5), " +
          "0 0 20px rgba(20, 184, 166, 0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(20, 184, 166, 0.85)";
        e.currentTarget.style.boxShadow = 
          "0 12px 40px 0 rgba(0, 0, 0, 0.3), " +
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.6), " +
          "0 0 30px rgba(20, 184, 166, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(20, 184, 166, 0.7)";
        e.currentTarget.style.boxShadow = 
          "0 8px 32px 0 rgba(0, 0, 0, 0.2), " +
          "inset 0 1px 0 0 rgba(255, 255, 255, 0.5), " +
          "0 0 20px rgba(20, 184, 166, 0.3)";
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} className="drop-shadow-lg text-white" />
    </button>
  );
}

