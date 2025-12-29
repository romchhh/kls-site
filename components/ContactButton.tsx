"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ContactQuickModal } from "./ContactQuickModal";
import { Locale } from "../lib/translations";

type ContactButtonProps = {
  locale: Locale;
};

export function ContactButton({ locale }: ContactButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      {/* Contact Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-24 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl ${
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
        aria-label="Contact us"
      >
        <Image src="/chat-icon.svg" alt="Contact us" width={24} height={24} className="drop-shadow-lg object-contain" />
      </button>

      {/* Contact Quick Modal */}
      <ContactQuickModal 
        locale={locale} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

