"use client";

import { useState, useEffect, useRef } from "react";
import { Locale, getTranslations } from "../lib/translations";
import { 
  Plane, 
  Ship, 
  Train, 
  Globe, 
  MapPin,
  Weight,
  Box,
  Package,
  MessageSquare,
  User,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Info
} from "lucide-react";

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
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [cargoCategory, setCargoCategory] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("+380");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
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

  // Коди країн для телефону
  const countryCodes = [
    { code: "+380", flag: "🇺🇦", country: "Україна" },
    { code: "+1", flag: "🇺🇸", country: "США/Канада" },
    { code: "+44", flag: "🇬🇧", country: "Велика Британія" },
    { code: "+86", flag: "🇨🇳", country: "Китай" },
    { code: "+48", flag: "🇵🇱", country: "Польща" },
    { code: "+49", flag: "🇩🇪", country: "Німеччина" },
    { code: "+7", flag: "🇷🇺", country: "Росія" },
  ];

  const deliveryTypes = [
    { 
      value: "air", 
      label: costCalc.deliveryTypes.air, 
      icon: Plane,
      color: "from-teal-500 to-teal-600"
    },
    { 
      value: "sea", 
      label: costCalc.deliveryTypes.sea, 
      icon: Ship,
      color: "from-teal-500 to-teal-600"
    },
    { 
      value: "rail", 
      label: costCalc.deliveryTypes.rail, 
      icon: Train,
      color: "from-teal-500 to-teal-600"
    },
    { 
      value: "multimodal", 
      label: costCalc.deliveryTypes.multimodal, 
      icon: Globe,
      color: "from-teal-500 to-teal-600"
    },
  ];

  // Функція розрахунку орієнтовної вартості
  const calculateEstimatedCost = (): number | null => {
    if (!deliveryType || !origin || !destination || !weight) {
      return null;
    }

    const weightNum = parseFloat(weight) || 0;
    const volumeNum = parseFloat(volume) || 0;

    if (weightNum <= 0) return null;

    // Базові тарифи за кг для різних типів доставки
    const baseRates: Record<string, number> = {
      air: 10,
      sea: 1.5,
      rail: 4,
      multimodal: 6,
    };

    // Коефіцієнти для різних маршрутів
    const routeMultipliers: Record<string, Record<string, number>> = {
      china: {
        ukraine: 1.0,
        eu: 1.2,
        usa: 1.5,
        canada: 1.5,
        britain: 1.3,
        switzerland: 1.3,
        cyprus: 1.2,
        turkey: 1.1,
        uae: 1.4,
        qatar: 1.4,
        brazil: 1.6,
        colombia: 1.6,
        japan: 1.3,
        thailand: 1.2,
        hongkong: 0.9,
        taiwan: 1.2,
        ireland: 1.3,
        israel: 1.3,
      },
      hongkong: {
        ukraine: 1.0,
        eu: 1.2,
        usa: 1.5,
        canada: 1.5,
        britain: 1.3,
        switzerland: 1.3,
        cyprus: 1.2,
        turkey: 1.1,
        uae: 1.4,
        qatar: 1.4,
        brazil: 1.6,
        colombia: 1.6,
        japan: 1.3,
        thailand: 1.2,
        taiwan: 1.2,
        ireland: 1.3,
        israel: 1.3,
      },
    };

    const baseRate = baseRates[deliveryType] || 5;
    const multiplier = routeMultipliers[origin]?.[destination] || 1.0;

    // Розрахунок на основі ваги
    let cost = weightNum * baseRate * multiplier;

    // Якщо є об'єм, враховуємо об'ємну вагу (1 м³ = 167 кг)
    if (volumeNum > 0) {
      const volumetricWeight = volumeNum * 167;
      const chargeableWeight = Math.max(weightNum, volumetricWeight);
      cost = chargeableWeight * baseRate * multiplier;
    }

    // Мінімальна вартість
    const minCost = deliveryType === "air" ? 50 : deliveryType === "sea" ? 100 : 80;
    cost = Math.max(minCost, cost);

    // Округлення до 10
    return Math.ceil(cost / 10) * 10;
  };

  const estimatedCost = calculateEstimatedCost();

  const canProceedStep1 = deliveryType !== "";
  const canProceedStep2 = origin !== "" && destination !== "" && weight !== "" && productName !== "" && cargoCategory !== "";
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
    
    // Симуляція відправки
    setTimeout(() => {
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
        setWidth("");
        setHeight("");
        setLength("");
        setCargoCategory("");
        setAdditionalInfo("");
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setContactFormat("");
        setRecaptchaChecked(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section id="cost-calculation" className="relative min-h-screen bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">
          {costCalc.title}
        </h1>

        {/* Прогрес-бар */}
        <div className="mb-12 flex items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Крок 1 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 1 
                    ? "border-teal-500 bg-teal-500 text-white" 
                    : "border-gray-300 bg-transparent text-gray-400"
                }`}>
                  {currentStep > 1 ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-bold">1</span>
                  )}
                </div>
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep === 1 ? "text-gray-900" : "text-gray-500"
              }`}>
                {costCalc.step1}
              </span>
              {currentStep === 1 && (
                <div className="mt-1 h-0.5 w-full bg-teal-500" />
              )}
            </div>

            {/* Лінія */}
            <div className={`h-0.5 w-16 ${
              currentStep >= 2 ? "bg-teal-500" : "bg-gray-300"
            }`} />

            {/* Крок 2 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 2 
                    ? "border-teal-500 bg-teal-500 text-white" 
                    : "border-gray-300 bg-transparent text-gray-400"
                }`}>
                  {currentStep > 2 ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-bold">2</span>
                  )}
                </div>
              </div>
              <span className={`mt-2 text-sm font-medium ${
                currentStep === 2 ? "text-gray-900" : "text-gray-500"
              }`}>
                {costCalc.step2}
              </span>
              {currentStep === 2 && (
                <div className="mt-1 h-0.5 w-full bg-teal-500" />
              )}
            </div>

            {/* Лінія */}
            <div className={`h-0.5 w-16 ${
              currentStep >= 3 ? "bg-teal-500" : "bg-gray-300"
            }`} />

            {/* Крок 3 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= 3 
                    ? "border-teal-500 bg-teal-500 text-white" 
                    : "border-gray-300 bg-transparent text-gray-400"
                }`}>
                  <span className="text-sm font-bold">3</span>
                </div>
              </div>
              <span className={`mt-2 text-sm font-medium ${
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
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          {/* Крок 1: Вибір типу доставки */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {deliveryTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = deliveryType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setDeliveryType(type.value)}
                      className={`group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 p-8 transition-all duration-300 ${
                        isSelected
                          ? "border-teal-500 bg-teal-50 shadow-lg scale-105"
                          : "border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-md"
                      }`}
                    >
                      <div className={`rounded-full bg-gradient-to-br ${type.color} p-4 shadow-md transition-transform ${
                        isSelected ? "opacity-100 scale-110" : "opacity-80 group-hover:scale-105"
                      }`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <span className={`text-center text-base font-semibold transition-colors ${
                        isSelected ? "text-teal-700" : "text-gray-700 group-hover:text-teal-600"
                      }`}>
                        {type.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="h-6 w-6 text-teal-600" />
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
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Звідки */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    {costCalc.origin}*
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    {costCalc.destination}*
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Weight className="h-4 w-4 text-teal-600" />
                    {costCalc.weight}*
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Об'єм */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Box className="h-4 w-4 text-teal-600" />
                    {costCalc.volume}
                  </label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Найменування товару */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Package className="h-4 w-4 text-teal-600" />
                    {costCalc.productName}*
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={costCalc.productName}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Габарити */}
                <div className="md:col-span-2">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    {costCalc.dimensions}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder={costCalc.width}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={costCalc.height}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder={costCalc.length}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                </div>
              </div>

                {/* Категорія вантажу */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Package className="h-4 w-4 text-teal-600" />
                    {costCalc.cargoCategory}*
                </label>
                <select
                    value={cargoCategory}
                    onChange={(e) => setCargoCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">{costCalc.selectCategory}</option>
                    {Object.entries(costCalc.cargoCategories).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                  </option>
                    ))}
                </select>
                </div>

                {/* Додаткова інформація */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MessageSquare className="h-4 w-4 text-teal-600" />
                    {costCalc.additionalInfo}
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={3}
                    placeholder={costCalc.additionalInfo}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info className="h-4 w-4 text-teal-600" />
                {costCalc.requiredFields}
                  </div>
                  
              {/* Орієнтовна вартість */}
              {estimatedCost !== null && (
                <div className="mt-6 rounded-xl border-2 border-teal-200 bg-teal-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {locale === "ua" ? "Орієнтовна вартість доставки" : locale === "ru" ? "Примерная стоимость доставки" : "Estimated delivery cost"}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-teal-600">
                        ${estimatedCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {locale === "ua" ? "*Орієнтовна вартість" : locale === "ru" ? "*Примерная стоимость" : "*Estimated cost"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Крок 3: Контактні данні */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Ім'я */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 text-teal-600" />
                    {costCalc.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={costCalc.name}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Телефон */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 text-teal-600" />
                    {costCalc.phone}*
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 text-teal-600" />
                    {costCalc.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={costCalc.email}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                {/* Формат зв'язку */}
                <div className="md:col-span-2">
                  <label className="mb-2 text-sm font-medium text-gray-700">
                    {costCalc.contactFormat}
                  </label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {Object.entries(costCalc.contactFormats).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setContactFormat(contactFormat === key ? "" : key)}
                        className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
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

                {/* Повідомлення */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MessageSquare className="h-4 w-4 text-teal-600" />
                    {costCalc.message}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={costCalc.message}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  id="recaptcha"
                  checked={recaptchaChecked}
                  onChange={(e) => setRecaptchaChecked(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 bg-white text-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
                <label htmlFor="recaptcha" className="flex-1 cursor-pointer text-sm text-gray-700">
                  {costCalc.recaptcha}
                </label>
                <div className="text-xs text-gray-500">
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
          <div className="mt-8 flex items-center justify-between">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:bg-gray-50"
              >
                {costCalc.back}
              </button>
            )}
            <div className="ml-auto">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className={`flex items-center gap-2 rounded-lg px-8 py-3 font-medium transition-all ${
                    (currentStep === 1 && canProceedStep1) ||
                    (currentStep === 2 && canProceedStep2)
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {costCalc.next}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep3 || isSubmitting || isSubmitted}
                  className={`flex items-center gap-2 rounded-lg px-8 py-3 font-medium transition-all ${
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
