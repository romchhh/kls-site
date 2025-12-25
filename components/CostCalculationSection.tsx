"use client";

import { useState, useEffect, useRef } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { 
  MapPin,
  Weight,
  Box,
  Package,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Info
} from "lucide-react";
import Image from "next/image";

type CostCalculationSectionProps = {
  locale: Locale;
};

type Step = 1 | 2 | 3;

export function CostCalculationSection({ locale }: CostCalculationSectionProps) {
  const t = getTranslations(locale);
  const costCalc = t?.costCalculation;
  
  if (!costCalc) {
    return null;
  }

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [volume, setVolume] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("+380");
  const [contactFormat, setContactFormat] = useState<string>("");
  const [recaptchaChecked, setRecaptchaChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Список країн для відправлення
  const originCountries = [
    { value: "china", label: costCalc.countries.china },
    { value: "hongkong", label: costCalc.countries.hongkong },
  ];

  // Список країн для призначення (Україна перша)
  const destinationCountries = [
    { value: "ukraine", label: costCalc.countries.ukraine },
    { value: "eu", label: costCalc.countries.eu },
    { value: "usa", label: costCalc.countries.usa },
    { value: "canada", label: costCalc.countries.canada },
    { value: "britain", label: costCalc.countries.britain },
    { value: "switzerland", label: costCalc.countries.switzerland },
    { value: "cyprus", label: costCalc.countries.cyprus },
    { value: "turkey", label: costCalc.countries.turkey },
    { value: "uae", label: costCalc.countries.uae },
    { value: "qatar", label: costCalc.countries.qatar },
    { value: "brazil", label: costCalc.countries.brazil },
    { value: "colombia", label: costCalc.countries.colombia },
    { value: "japan", label: costCalc.countries.japan },
    { value: "thailand", label: costCalc.countries.thailand },
    { value: "hongkong", label: costCalc.countries.hongkong },
    { value: "taiwan", label: costCalc.countries.taiwan },
    { value: "ireland", label: costCalc.countries.ireland },
    { value: "israel", label: costCalc.countries.israel },
  ];

  // Коди країн для телефону (всі світові крім RU та PY)
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

  const deliveryTypes = [
    { 
      value: "air", 
      label: costCalc.deliveryTypes.air, 
      icon: "/air-delivery.svg",
    },
    { 
      value: "sea", 
      label: costCalc.deliveryTypes.sea, 
      icon: "/sea-delivery.svg",
    },
    { 
      value: "rail", 
      label: costCalc.deliveryTypes.rail, 
      icon: "/rail-delivery.svg",
    },
    { 
      value: "multimodal", 
      label: costCalc.deliveryTypes.multimodal, 
      icon: "/multimodal-delivery.svg",
    },
  ];


  const canProceedStep1 = deliveryType !== "";
  const canProceedStep2 = origin !== "" && destination !== "" && weight !== "";
  const canProceedStep3 = name !== "" && phone !== "" && recaptchaChecked;

  const handleNext = () => {
    if (currentStep === 1 && canProceedStep1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && canProceedStep2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      }
    };

  const handleSubmit = async () => {
    if (!canProceedStep3) return;
    
    setIsSubmitting(true);
    
    try {
      // Розрахунок орієнтовної вартості та терміну
      let estimatedCost = 0;
      let estimatedDays = 0;
      
      if (deliveryType === "air") {
        estimatedCost = weight ? parseFloat(weight) * 8 : (volume ? parseFloat(volume) * 1200 : 0);
        estimatedDays = 20;
      } else if (deliveryType === "sea") {
        estimatedCost = weight ? parseFloat(weight) * 2 : (volume ? parseFloat(volume) * 300 : 0);
        estimatedDays = 75;
      } else if (deliveryType === "rail") {
        estimatedCost = weight ? parseFloat(weight) * 3 : (volume ? parseFloat(volume) * 400 : 0);
        estimatedDays = 45;
      } else if (deliveryType === "multimodal") {
        estimatedCost = weight ? parseFloat(weight) * 4 : (volume ? parseFloat(volume) * 500 : 0);
        estimatedDays = 35;
      }
      
      // Відправка в Telegram
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      
      await fetch("/api/telegram/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "cost_calculation",
          data: {
            name,
            phone,
            phoneCode,
            deliveryType,
            origin,
            destination,
            weight,
            volume,
            productName,
            estimatedCost: estimatedCost.toFixed(2),
            estimatedDays,
            contactFormat,
          },
          locale,
          pageUrl,
        }),
      });
    } catch (error) {
      console.error("Error sending to Telegram:", error);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Скидання форми через 3 секунди
    setTimeout(() => {
      setIsSubmitted(false);
      setCurrentStep(1);
      setDeliveryType("");
      setOrigin("");
      setDestination("");
      setWeight("");
      setVolume("");
      setProductName("");
      setName("");
      setPhone("");
      setPhoneCode("+380");
      setContactFormat("");
      setRecaptchaChecked(false);
    }, 3000);
  };

  return (
    <section id="cost-calculation" className="relative bg-gray-100 pt-4 pb-12 sm:pt-6 sm:pb-20">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-8">

        {/* Прогрес-бар */}
        <div className="mb-6 flex items-center justify-center sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Крок 1 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 1 
                    ? "border-teal-500 bg-teal-500 text-white" 
                    : "border-gray-300 bg-transparent text-gray-400"
                }`}>
                  {currentStep > 1 ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold">1</span>
                  )}
                </div>
              </div>
              <span className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium ${
                currentStep === 1 ? "text-gray-900" : "text-gray-500"
              }`}>
                {costCalc.step1}
              </span>
              {currentStep === 1 && (
                <div className="mt-1 h-0.5 w-full bg-teal-500" />
              )}
            </div>

            {/* Лінія */}
            <div className={`h-0.5 w-8 sm:w-16 ${
              currentStep >= 2 ? "bg-teal-500" : "bg-gray-300"
            }`} />

            {/* Крок 2 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 2 
                    ? "border-teal-500 bg-teal-500 text-white" 
                    : "border-gray-300 bg-transparent text-gray-400"
                }`}>
                  {currentStep > 2 ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold">2</span>
                  )}
                </div>
              </div>
              <span className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium ${
                currentStep === 2 ? "text-gray-900" : "text-gray-500"
              }`}>
                {costCalc.step2}
              </span>
              {currentStep === 2 && (
                <div className="mt-1 h-0.5 w-full bg-teal-500" />
              )}
            </div>
            
            {/* Лінія */}
            <div className={`h-0.5 w-8 sm:w-16 ${
              currentStep >= 3 ? "bg-teal-500" : "bg-gray-300"
            }`} />

            {/* Крок 3 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 3 
                    ? "border-teal-500 bg-teal-500 text-white" 
                    : "border-gray-300 bg-transparent text-gray-400"
                }`}>
                  <span className="text-xs sm:text-sm font-bold">3</span>
                </div>
              </div>
              <span className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium ${
                currentStep === 3 ? "text-gray-900" : "text-gray-500"
              }`}>
                {costCalc.step3}
              </span>
              {currentStep === 3 && (
                <div className="mt-1 h-0.5 w-full bg-teal-500" />
              )}
              </div>
            </div>
          </div>

        {/* Контент кроків */}
        <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-lg">
          {/* Крок 1: Вибір типу доставки */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                {deliveryTypes.map((type) => {
                  const isSelected = deliveryType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setDeliveryType(type.value)}
                      className={`group relative flex flex-col items-center justify-center gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
                        isSelected
                          ? "border-teal-500 bg-[#E8FDF8] shadow-lg sm:scale-105"
                          : "border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-[#E8FDF8] hover:shadow-md"
                      }`}
                    >
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center transition-all duration-300 group-hover:scale-105">
                        <Image
                          src={type.icon}
                          alt={type.label}
                          width={80}
                          height={80}
                          className={`object-contain transition-all duration-300 w-12 h-12 sm:w-16 sm:h-16 ${
                            isSelected ? "opacity-100" : "opacity-90 group-hover:opacity-100"
                          }`}
                        />
                      </div>
                      <span className={`text-center text-sm sm:text-base font-semibold transition-colors ${
                        isSelected ? "text-teal-700" : "text-gray-700 group-hover:text-teal-600"
                      }`}>
                        {type.label}
                    </span>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 text-teal-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Крок 2: Деталі доставки */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Звідки */}
                <div>
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.origin}*
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">{costCalc.selectCountry}</option>
                    {originCountries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                    </option>
                    ))}
                  </select>
                </div>

                {/* Куди */}
                <div>
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.destination}*
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">{costCalc.selectCountry}</option>
                    {destinationCountries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                    </option>
                    ))}
                  </select>
                </div>

                {/* Вага */}
                <div>
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <Weight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.weight}*
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Об'єм */}
                <div>
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <Box className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.volume}
                  </label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Найменування товару */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.productName}
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={costCalc.productName}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                {costCalc.requiredFields}
              </div>
            </div>
          )}

          {/* Крок 3: Контактні данні */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Ім'я */}
                <div>
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={costCalc.name}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Телефон */}
                <div>
                  <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
                    {costCalc.phone}*
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="w-24 sm:w-32 rounded-lg border border-gray-300 bg-white px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="000000000"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* Формат зв'язку */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
                    {costCalc.contactFormat}
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                    {Object.entries(costCalc.contactFormats)
                      .filter(([key]) => key !== "py") // Виключаємо PY
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setContactFormat(contactFormat === key ? "" : key)}
                          className={`rounded-lg border-2 px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                            contactFormat === key
                              ? "border-teal-500 bg-teal-50 text-teal-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-teal-300 hover:bg-teal-50/50"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <input
                  type="checkbox"
                  id="recaptcha"
                  checked={recaptchaChecked}
                  onChange={(e) => setRecaptchaChecked(e.target.checked)}
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 bg-white text-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
                <label htmlFor="recaptcha" className="flex-1 cursor-pointer text-xs sm:text-sm text-gray-700">
                  {costCalc.recaptcha}
                </label>
                <div className="text-xs text-gray-500 hidden sm:block">
                  reCAPTCHA
                </div>
              </div>

              {/* Примітка про конфіденційність */}
              <p className="text-xs text-gray-500">
                {costCalc.privacyNote}
              </p>
            </div>
          )}

          {/* Кнопки навігації */}
          <div className="mt-4 sm:mt-8 flex items-center justify-between gap-2 sm:gap-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-gray-700 transition-all hover:bg-gray-50"
              >
                {costCalc.back}
              </button>
            )}
            <div className={currentStep === 1 ? "w-full flex justify-center" : "ml-auto"}>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-6 py-2.5 sm:px-12 sm:py-4 text-sm sm:text-lg font-semibold transition-all ${
                    (currentStep === 1 && canProceedStep1) ||
                    (currentStep === 2 && canProceedStep2)
                      ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {costCalc.next}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep3 || isSubmitting || isSubmitted}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                    canProceedStep3 && !isSubmitting && !isSubmitted
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Відправлено!
                    </>
                  ) : isSubmitting ? (
                    "Відправка..."
                  ) : (
                    costCalc.send
                  )}
              </button>
              )}
                    </div>
            </div>
          </div>
        </div>
      </section>
  );
}
