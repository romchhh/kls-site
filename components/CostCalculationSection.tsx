"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Locale, getTranslations } from "../lib/translations";
import { ContactModal } from "./ContactModal";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

type CostCalculationSectionProps = {
  locale: Locale;
};

// Логіка розрахунку вартості
const calculateCost = (
  origin: string,
  destination: string,
  deliveryType: string
): { cost: number; days: number } => {
  // Базові коефіцієнти для різних типів доставки
  const deliveryMultipliers: Record<string, number> = {
    air: 2.5,
    express: 3.0,
    multimodal: 1.5,
    ddp: 1.8,
    dpu: 1.7,
    sea: 1.0,
    rail: 0.8,
  };

  // Базові відстані між країнами (в км)
  const distances: Record<string, Record<string, number>> = {
    china: {
      ukraine: 7000,
      poland: 7200,
      germany: 8000,
      usa: 11000,
    },
    ukraine: {
      china: 7000,
      poland: 800,
      germany: 1200,
      usa: 8000,
    },
    poland: {
      china: 7200,
      ukraine: 800,
      germany: 600,
      usa: 7000,
    },
    germany: {
      china: 8000,
      ukraine: 1200,
      poland: 600,
      usa: 6500,
    },
    usa: {
      china: 11000,
      ukraine: 8000,
      poland: 7000,
      germany: 6500,
    },
  };

  // Базові терміни доставки (в днях) залежно від типу
  const baseDays: Record<string, number> = {
    air: 7,
    express: 3,
    multimodal: 25,
    ddp: 30,
    dpu: 28,
    sea: 35,
    rail: 20,
  };

  const distance = distances[origin]?.[destination] || 5000;
  const multiplier = deliveryMultipliers[deliveryType] || 1.5;
  
  // Базова вартість: $1 за км + коефіцієнт типу доставки
  const baseCost = (distance / 100) * multiplier;
  
  // Додаємо мінімальну вартість та округлюємо
  const cost = Math.max(500, Math.round(baseCost / 100) * 100);
  
  // Розрахунок терміну з урахуванням відстані
  const baseDeliveryDays = baseDays[deliveryType] || 15;
  const days = Math.round(baseDeliveryDays + (distance / 1000) * 0.5);

  return { cost, days };
};

export function CostCalculationSection({ locale }: CostCalculationSectionProps) {
  const t = getTranslations(locale);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<{
    cost: number;
    days: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, []);

  const handleCalculate = () => {
    if (!origin || !destination || !deliveryType) {
      alert(
        locale === "ua"
          ? "Будь ласка, заповніть всі поля"
          : locale === "ru"
          ? "Пожалуйста, заполните все поля"
          : "Please fill in all fields"
      );
      return;
    }

    setIsCalculating(true);
    setCalculationResult(null);

    // Симуляція розрахунку
    setTimeout(() => {
      const result = calculateCost(origin, destination, deliveryType);
      setCalculationResult(result);
      setIsCalculating(false);

      // Показуємо модальне вікно через 3 секунди
      modalTimeoutRef.current = setTimeout(() => {
        setShowModal(true);
      }, 3000);
    }, 2000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
  };

  const getDeliveryTypeLabel = (type: string): string => {
    const types = t.costCalculation?.deliveryTypes || {};
    return types[type as keyof typeof types] || type;
  };

  const getCountryLabel = (country: string): string => {
    const countries = t.costCalculation?.countries || {};
    return countries[country as keyof typeof countries] || country;
  };

  const isValid = origin && destination && deliveryType;

  return (
    <>
      <section id="cost-calculation" ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/20 to-white py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.08)_0%,_rgba(20,184,166,0)_70%)]" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div
            className={`mx-auto mb-16 max-w-4xl text-center ${
              isVisible ? "animate-slide-in-top" : ""
            }`}
            style={isVisible ? { animationDelay: "0.1s" } : { opacity: 0 }}
          >
            <h2 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              {t.costCalculation.title}
            </h2>
            <p className="mb-6 text-xl leading-relaxed text-slate-600/80 md:text-2xl">
              {t.costCalculation.subtitle}
            </p>
            
            {/* Arrow */}
            <div className="mt-6 flex justify-end pr-8">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={isVisible ? { animationDelay: "0.3s" } : {}}
              >
                <Image
                  src="/Arrow 06.png"
                  alt=""
                  width={100}
                  height={100}
                  className="opacity-40 rotate-180"
                />
              </div>
            </div>
          </div>

          {/* Calculator Form */}
          <div
            className={`mx-auto max-w-5xl ${
              isVisible ? "animate-slide-in-bottom" : ""
            }`}
            style={isVisible ? { animationDelay: "0.3s" } : { opacity: 0 }}
          >
            <div className="rounded-3xl border-2 border-white/60 bg-white/80 backdrop-blur-xl p-8 shadow-2xl lg:p-12">
              {/* Origin and Destination */}
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div
                  className={`transform transition-all duration-500 ${
                    isVisible ? "animate-slide-in-left" : ""
                  }`}
                  style={isVisible ? { animationDelay: "0.4s" } : { opacity: 0 }}
                >
                  <label className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                      1
                    </span>
                    {t.costCalculation.origin}
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setCalculationResult(null);
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-900 shadow-sm transition-all duration-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 hover:border-teal-300"
                  >
                    <option value="">
                      {t.costCalculation.selectCountry || "Оберіть країну"}
                    </option>
                    <option value="china">{t.costCalculation.countries.china}</option>
                    <option value="ukraine">{t.costCalculation.countries.ukraine}</option>
                    <option value="poland">{t.costCalculation.countries.poland}</option>
                    <option value="germany">{t.costCalculation.countries.germany}</option>
                    <option value="usa">{t.costCalculation.countries.usa}</option>
                  </select>
                </div>

                <div
                  className={`transform transition-all duration-500 ${
                    isVisible ? "animate-slide-in-right" : ""
                  }`}
                  style={isVisible ? { animationDelay: "0.5s" } : { opacity: 0 }}
                >
                  <label className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                      2
                    </span>
                    {t.costCalculation.destination}
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setCalculationResult(null);
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-900 shadow-sm transition-all duration-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 hover:border-teal-300"
                  >
                    <option value="">
                      {t.costCalculation.selectCountry || "Оберіть країну"}
                    </option>
                    <option value="china">{t.costCalculation.countries.china}</option>
                    <option value="ukraine">{t.costCalculation.countries.ukraine}</option>
                    <option value="poland">{t.costCalculation.countries.poland}</option>
                    <option value="germany">{t.costCalculation.countries.germany}</option>
                    <option value="usa">{t.costCalculation.countries.usa}</option>
                  </select>
                </div>
              </div>

              {/* Delivery Type */}
              <div
                className={`mb-8 transform transition-all duration-500 ${
                  isVisible ? "animate-slide-in-bottom" : ""
                }`}
                style={isVisible ? { animationDelay: "0.6s" } : { opacity: 0 }}
              >
                <label className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                    3
                  </span>
                  {t.costCalculation.deliveryType}
                </label>
                <select
                  value={deliveryType}
                  onChange={(e) => {
                    setDeliveryType(e.target.value);
                    setCalculationResult(null);
                  }}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-900 shadow-sm transition-all duration-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 hover:border-teal-300"
                >
                  <option value="">
                    {t.costCalculation.selectDeliveryType || "Оберіть тип доставки"}
                  </option>
                  <option value="air">{t.costCalculation.deliveryTypes.air}</option>
                  <option value="sea">{t.costCalculation.deliveryTypes.sea}</option>
                  <option value="rail">{t.costCalculation.deliveryTypes.rail}</option>
                  <option value="multimodal">
                    {t.costCalculation.deliveryTypes.multimodal}
                  </option>
                  <option value="express">
                    {t.costCalculation.deliveryTypes.express}
                  </option>
                  <option value="ddp">{t.costCalculation.deliveryTypes.ddp}</option>
                  <option value="dpu">{t.costCalculation.deliveryTypes.dpu}</option>
                </select>
                <p className="mt-2 text-sm text-slate-500">
                  {t.costCalculation.countriesNote || "Країни з яких і в які доставка"}
                </p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={!isValid || isCalculating}
                className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 px-8 py-6 text-lg font-bold text-white shadow-2xl transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isValid && !isCalculating
                    ? "hover:scale-[1.02] hover:shadow-3xl hover:from-teal-700 hover:via-teal-700 hover:to-teal-800"
                    : ""
                } ${isVisible ? "animate-slide-in-bottom" : ""}`}
                style={isVisible ? { animationDelay: "0.7s" } : { opacity: 0 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isCalculating ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      {locale === "ua"
                        ? "Розрахунок..."
                        : locale === "ru"
                        ? "Расчет..."
                        : "Calculating..."}
                    </>
                  ) : (
                    <>
                      {t.costCalculation.calculate}
                      <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>

              {/* Calculation Result */}
              {calculationResult && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-teal-50/50 p-8 shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-teal-600" />
                    <h3 className="text-2xl font-bold text-slate-900">
                      {locale === "ua"
                        ? "Розрахунок завершено"
                        : locale === "ru"
                        ? "Расчет завершен"
                        : "Calculation Complete"}
                    </h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-white/80 p-6 shadow-md">
                      <p className="text-sm font-medium text-slate-600">
                        {locale === "ua"
                          ? "Орієнтовна вартість"
                          : locale === "ru"
                          ? "Примерная стоимость"
                          : "Estimated Cost"}
                      </p>
                      <p className="mt-2 text-4xl font-bold text-teal-600">
                        ${calculationResult.cost.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="rounded-xl bg-white/80 p-6 shadow-md">
                      <p className="text-sm font-medium text-slate-600">
                        {locale === "ua"
                          ? "Термін доставки"
                          : locale === "ru"
                          ? "Срок доставки"
                          : "Delivery Time"}
                      </p>
                      <p className="mt-2 text-4xl font-bold text-slate-900">
                        {calculationResult.days}{" "}
                        <span className="text-xl text-slate-600">
                          {locale === "ua"
                            ? "днів"
                            : locale === "ru"
                            ? "дней"
                            : "days"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {calculationResult && (
        <ContactModal
          locale={locale}
          isOpen={showModal}
          onClose={handleCloseModal}
          calculationResult={{
            origin: getCountryLabel(origin),
            destination: getCountryLabel(destination),
            deliveryType: getDeliveryTypeLabel(deliveryType),
            estimatedCost: calculationResult.cost,
            estimatedDays: calculationResult.days,
          }}
        />
      )}
    </>
  );
}
