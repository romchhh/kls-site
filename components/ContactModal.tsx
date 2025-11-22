"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";
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
  const t = getTranslations(locale);
  const modalT = t.contactModal;

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    alert(modalT.success);
    setFormData({ name: "", email: "", phone: "", message: "" });
    onClose();
  };

  return (
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
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {modalT.name} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder={modalT.name}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {modalT.email} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {modalT.phone} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="+380 XX XXX XX XX"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {modalT.message}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder={modalT.message}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? modalT.submitting : modalT.submit}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border-2 border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                {modalT.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

