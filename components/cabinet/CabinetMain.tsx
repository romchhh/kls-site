"use client";

import { useEffect, useState } from "react";
import { Locale, getTranslations } from "@/lib/translations";
import {
  Package,
  FileText,
  DollarSign,
  RefreshCcw,
  TrendingUp,
  Globe2,
} from "lucide-react";

type CabinetMainProps = {
  locale: Locale;
};

type RatePair = {
  buy: number;
  sell: number;
};

type RatesResponse = {
  usdUah: RatePair;
  eurUah: RatePair;
};

export function CabinetMain({ locale }: CabinetMainProps) {
  const t = getTranslations(locale);
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  useEffect(() => {
    const loadRates = async () => {
      try {
        setLoadingRates(true);
        const res = await fetch("/api/rates");
        if (!res.ok) return;
        const json = (await res.json()) as RatesResponse;
        setRates(json);
      } catch {
        // ігноруємо помилку, залишаємо плейсхолдери
      } finally {
        setLoadingRates(false);
      }
    };

    loadRates();
  }, []);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.main || "Головна"}
      </h2>
      <div className="space-y-6">
        {/* Top overview row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Total available */}
          <div className="relative col-span-1 lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {t.cabinet?.totalAvailableTitle || "Загалом доступно:"}
                </p>
                <p className="mt-3 text-3xl font-black md:text-4xl">~ 0 USD</p>
                <p className="mt-1 text-sm text-slate-300">~ 0 UAH</p>
                <p className="mt-3 text-xs text-slate-400">
                  {t.cabinet?.totalReservedLabel || "Загалом заброньовано:"} 0 UAH
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="rounded-full bg-white/10 px-3 py-1">
                UAH · USD · EUR · PLN
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1">
                {t.cabinet?.comingSoon || "Скоро тут з'явиться динаміка балансу"}
              </span>
            </div>
          </div>

          {/* Side widget placeholder */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {t.cabinet?.ratesWidgetTitle || "Курси валют"}
              </h3>
              <div className="flex h-8 items-center gap-2 rounded-full bg-slate-100 px-3 text-xs text-slate-600">
                <Globe2 className="h-3.5 w-3.5" />
                <span>Київ</span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                <span>USD/UAH</span>
                <span className="font-semibold text-slate-900">
                  {rates
                    ? `${rates.usdUah.buy.toFixed(2)} / ${rates.usdUah.sell.toFixed(2)}`
                    : "-- / --"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                <span>EUR/UAH</span>
                <span className="font-semibold text-slate-900">
                  {rates
                    ? `${rates.eurUah.buy.toFixed(2)} / ${rates.eurUah.sell.toFixed(2)}`
                    : "-- / --"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {loadingRates
                    ? t.cabinet?.ratesWidgetLoading || "Оновлюємо курси…"
                    : t.cabinet?.ratesWidgetHint || "Живі курси підв'яжемо пізніше"}
                </span>
                <RefreshCcw className={`h-3.5 w-3.5 ${loadingRates ? "animate-spin" : ""}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Main tiles row */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Shipments */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-teal-100/70 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-md">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t.cabinet?.shipments || "Вантаж"}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              {t.cabinet?.noShipments || "Немає відправлень"}
            </p>
          </div>

          {/* Invoices */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-blue-100/70 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t.cabinet?.invoices || "Рахунки"}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              {t.cabinet?.noInvoices || "Немає рахунків"}
            </p>
          </div>

          {/* Finances */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t.cabinet?.finances || "Фінанси"}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              {t.cabinet?.noTransactions || "Немає транзакцій"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

