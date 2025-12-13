"use client";

import { useState, FormEvent } from "react";
import { User, Phone } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type ContactFormProps = {
  locale: Locale;
};

const countryCodes = [
  { code: "+380", flag: "🇺🇦", country: "Україна" },
  { code: "+1", flag: "🇺🇸", country: "США/Канада" },
  { code: "+44", flag: "🇬🇧", country: "Велика Британія" },
  { code: "+86", flag: "🇨🇳", country: "Китай" },
  { code: "+48", flag: "🇵🇱", country: "Польща" },
  { code: "+49", flag: "🇩🇪", country: "Німеччина" },
  { code: "+33", flag: "🇫🇷", country: "Франція" },
  { code: "+39", flag: "🇮🇹", country: "Італія" },
  { code: "+34", flag: "🇪🇸", country: "Іспанія" },
  { code: "+31", flag: "🇳🇱", country: "Нідерланди" },
  { code: "+32", flag: "🇧🇪", country: "Бельгія" },
  { code: "+41", flag: "🇨🇭", country: "Швейцарія" },
  { code: "+43", flag: "🇦🇹", country: "Австрія" },
  { code: "+46", flag: "🇸🇪", country: "Швеція" },
  { code: "+47", flag: "🇳🇴", country: "Норвегія" },
  { code: "+45", flag: "🇩🇰", country: "Данія" },
  { code: "+358", flag: "🇫🇮", country: "Фінляндія" },
  { code: "+353", flag: "🇮🇪", country: "Ірландія" },
  { code: "+351", flag: "🇵🇹", country: "Португалія" },
  { code: "+30", flag: "🇬🇷", country: "Греція" },
  { code: "+90", flag: "🇹🇷", country: "Туреччина" },
  { code: "+971", flag: "🇦🇪", country: "ОАЕ" },
  { code: "+974", flag: "🇶🇦", country: "Катар" },
  { code: "+81", flag: "🇯🇵", country: "Японія" },
  { code: "+82", flag: "🇰🇷", country: "Південна Корея" },
  { code: "+65", flag: "🇸🇬", country: "Сінгапур" },
  { code: "+60", flag: "🇲🇾", country: "Малайзія" },
  { code: "+66", flag: "🇹🇭", country: "Таїланд" },
  { code: "+61", flag: "🇦🇺", country: "Австралія" },
  { code: "+64", flag: "🇳🇿", country: "Нова Зеландія" },
  { code: "+55", flag: "🇧🇷", country: "Бразилія" },
  { code: "+52", flag: "🇲🇽", country: "Мексика" },
  { code: "+54", flag: "🇦🇷", country: "Аргентина" },
  { code: "+57", flag: "🇨🇴", country: "Колумбія" },
  { code: "+27", flag: "🇿🇦", country: "Південна Африка" },
  { code: "+20", flag: "🇪🇬", country: "Єгипет" },
  { code: "+972", flag: "🇮🇱", country: "Ізраїль" },
  { code: "+886", flag: "🇹🇼", country: "Тайвань" },
  { code: "+852", flag: "🇭🇰", country: "Гонконг" },
];

export function ContactForm({ locale }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phoneCode: "+380",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const t = getTranslations(locale);
  const formT = t.contactForm || {
    title: "Оформити доставку",
    subtitle: "Заповніть контактні дані і ми зв'яжемося з вами найближчим часом!",
    name: "Ім'я",
    phone: "Телефон",
    submit: "Оформити доставку",
    submitting: "Відправка...",
    success: "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
    nameRequired: "Заповніть це поле.",
    phoneRequired: "Заповніть це поле.",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Валідація
    const newErrors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = formT.nameRequired;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = formT.phoneRequired;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({ name: "", phone: "", phoneCode: "+380" });
    }, 2500);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg lg:p-8">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">{formT.title}</h2>
      <p className="mb-6 text-sm text-gray-600">{formT.subtitle}</p>

      {showSuccess && (
        <div className="mb-6 rounded-lg bg-teal-50 border border-teal-200 p-4">
          <p className="text-sm font-medium text-teal-800">{formT.success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {formT.name}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`w-full rounded-lg border bg-white pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-teal-500 focus:ring-teal-500/20"
              }`}
              placeholder={formT.name}
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {formT.phone}
          </label>
          <div className="flex gap-2">
            <select
              value={formData.phoneCode}
              onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
              className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              disabled={isSubmitting}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full rounded-lg border bg-white pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
                placeholder="050 123 4567"
                disabled={isSubmitting}
              />
            </div>
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? formT.submitting : formT.submit}
        </button>
      </form>
    </div>
  );
}

