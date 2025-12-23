"use client";

import { useState, FormEvent, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type ContactModalProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  calculationResult?: {
    origin: string;
    destination: string;
    deliveryType: string;
    estimatedCost: number;
    estimatedDays: number;
  };
};

export function ContactModal({ locale, isOpen, onClose, calculationResult }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const t = getTranslations(locale);
  const modalT = t.contactModal;

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Відправка в Telegram
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      
      await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact_modal",
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            calculationResult,
          },
          locale,
          pageUrl,
        }),
      });
    } catch (error) {
      console.error("Error sending to Telegram:", error);
    }
    
    setIsSubmitting(false);
    setShowSuccess(true);
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
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-2xl h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
          {/* Header */}
          <div className="relative rounded-t-3xl bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30"
          >
            <X size={20} />
          </button>
          <h2 className="text-3xl font-bold text-white">{modalT.title}</h2>
          <p className="mt-2 text-teal-50">{modalT.subtitle}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 overflow-y-auto">
          {/* Calculation Result */}
          {calculationResult && (
            <div className="mb-6 rounded-2xl border-2 border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {modalT.route}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {calculationResult.origin} → {calculationResult.destination}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {modalT.deliveryType}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {calculationResult.deliveryType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {modalT.estimatedCost}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-teal-600">
                    ${calculationResult.estimatedCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {modalT.deliveryTime}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {calculationResult.estimatedDays} {modalT.days}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {modalT.name} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder={modalT.name}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {modalT.email} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="email@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {modalT.phone} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="+380 XX XXX XX XX"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {modalT.message}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder={modalT.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="flex-1 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    {modalT.submitting}
                  </span>
                ) : (
                  modalT.submit
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                {modalT.cancel}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </>
  );
}

