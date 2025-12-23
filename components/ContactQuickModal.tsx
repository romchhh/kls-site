"use client";

import { useState, FormEvent, useEffect } from "react";
import { X, MessageCircle, Phone, CheckCircle2 } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type ContactQuickModalProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
};

export function ContactQuickModal({ locale, isOpen, onClose }: ContactQuickModalProps) {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Безпечне отримання перекладів з fallback
  const safeLocale: Locale = locale && ["ua", "ru", "en"].includes(locale) ? locale : "ua";
  const t = getTranslations(safeLocale);
  const modalT = t?.contactQuick || {
    title: "Зв'язатися з нами",
    subtitle: "Оберіть зручний спосіб зв'язку",
    chooseMessenger: "Оберіть месенджер:",
    or: "або",
    phoneLabel: "Ваш телефон",
    phonePlaceholder: "+380 XX XXX XX XX",
    submit: "Залишити заявку",
    submitting: "Відправка...",
    success: "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setPhone("");
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose]);

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Відправка в Telegram
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      
      await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact_quick",
          data: {
            phone,
          },
          locale: safeLocale,
          pageUrl,
        }),
      });
    } catch (error) {
      console.error("Error sending to Telegram:", error);
    }
    
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleMessengerClick = (type: "telegram" | "whatsapp" | "viber" | "wechat") => {
    const links: Record<string, string> = {
      telegram: "https://t.me/klslogistics",
      whatsapp: "https://wa.me/380322294567",
      viber: "viber://chat?number=380322294567",
      wechat: "weixin://",
    };
    
    window.open(links[type], "_blank");
  };

  return (
    <>
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[60] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-2xl ring-1 ring-teal-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <CheckCircle2 size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{modalT.success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{modalT.title}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{modalT.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Messengers */}
            <div className="mb-5">
              <p className="mb-3 text-xs font-medium text-slate-500">{modalT.chooseMessenger}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMessengerClick("telegram")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  <MessageCircle size={16} className="text-blue-500" />
                  Telegram
                </button>
                <button
                  onClick={() => handleMessengerClick("whatsapp")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                >
                  <MessageCircle size={16} className="text-green-500" />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleMessengerClick("viber")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                >
                  <MessageCircle size={16} className="text-purple-500" />
                  Viber
                </button>
                <button
                  onClick={() => handleMessengerClick("wechat")}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                >
                  <MessageCircle size={16} className="text-green-600" />
                  WeChat
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-slate-400">{modalT.or}</span>
              </div>
            </div>

            {/* Phone Form */}
            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-slate-600">
                  {modalT.phoneLabel}
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={modalT.phonePlaceholder}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !phone.trim() || showSuccess}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    {modalT.submitting}
                  </span>
                ) : (
                  modalT.submit
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

