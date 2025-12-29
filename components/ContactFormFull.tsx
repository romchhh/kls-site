"use client";

import { useState, FormEvent } from "react";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { Locale, getTranslations } from "../lib/translations";

type ContactFormFullProps = {
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

const formTranslations = {
  ua: {
    title: "Надішліть нам повідомлення",
    subtitle: "Заповніть форму і ми зв'яжемося з вами найближчим часом",
    name: "Ім'я",
    email: "Email",
    phone: "Телефон",
    message: "Повідомлення",
    submit: "Відправити повідомлення",
    submitting: "Відправка...",
    success: "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
    nameRequired: "Заповніть це поле.",
    emailRequired: "Заповніть це поле.",
    emailInvalid: "Введіть коректний email.",
    phoneRequired: "Заповніть це поле.",
    messageRequired: "Заповніть це поле.",
  },
  ru: {
    title: "Отправьте нам сообщение",
    subtitle: "Заполните форму и мы свяжемся с вами в ближайшее время",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    message: "Сообщение",
    submit: "Отправить сообщение",
    submitting: "Отправка...",
    success: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    nameRequired: "Заполните это поле.",
    emailRequired: "Заполните это поле.",
    emailInvalid: "Введите корректный email.",
    phoneRequired: "Заполните это поле.",
    messageRequired: "Заполните это поле.",
  },
  en: {
    title: "Send us a message",
    subtitle: "Fill out the form and we'll get back to you soon",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Send message",
    submitting: "Sending...",
    success: "Thank you! We'll get back to you soon.",
    nameRequired: "Please fill this field.",
    emailRequired: "Please fill this field.",
    emailInvalid: "Please enter a valid email.",
    phoneRequired: "Please fill this field.",
    messageRequired: "Please fill this field.",
  },
};

export function ContactFormFull({ locale }: ContactFormFullProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCode: "+380",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const formT = formTranslations[locale] || formTranslations.en;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Валідація
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = formT.nameRequired;
    }
    if (!formData.email.trim()) {
      newErrors.email = formT.emailRequired;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = formT.emailInvalid;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = formT.phoneRequired;
    }
    if (!formData.message.trim()) {
      newErrors.message = formT.messageRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Відправка в Telegram
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";

      await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact-full",
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            phoneCode: formData.phoneCode,
            message: formData.message,
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

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        phoneCode: "+380",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 sm:p-8 lg:p-10 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900">
          {formT.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">{formT.subtitle}</p>
      </div>

      {showSuccess && (
        <div className="mb-6 rounded-xl bg-teal-50 border border-teal-200 p-4">
          <p className="text-sm font-medium text-teal-800">{formT.success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
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
            {formT.email}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-teal-500 focus:ring-teal-500/20"
              }`}
              placeholder="example@email.com"
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {formT.phone}
          </label>
          <div className="flex gap-2">
            <select
              value={formData.phoneCode}
              onChange={(e) =>
                setFormData({ ...formData, phoneCode: e.target.value })
              }
              className="w-32 rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {formT.message}
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message)
                  setErrors({ ...errors, message: undefined });
              }}
              rows={5}
              className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 resize-none ${
                errors.message
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:border-teal-500 focus:ring-teal-500/20"
              }`}
              placeholder={formT.message}
              disabled={isSubmitting}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-teal-600 hover:via-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? formT.submitting : formT.submit}
        </button>
      </form>
    </div>
  );
}

