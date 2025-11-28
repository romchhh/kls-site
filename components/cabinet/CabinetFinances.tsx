"use client";

import { Locale, getTranslations } from "@/lib/translations";
import { DollarSign } from "lucide-react";

type CabinetFinancesProps = {
  locale: Locale;
};

export function CabinetFinances({ locale }: CabinetFinancesProps) {
  const t = getTranslations(locale);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.finances || "Фінанси"}
      </h2>
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/80 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {t.cabinet?.finances || "Фінанси"}
            </p>
            <p className="text-sm text-slate-700">
          {t.cabinet?.noTransactions || "Немає транзакцій"}
        </p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-white/80 px-4 py-8 text-center text-sm text-slate-600">
          {t.cabinet?.financesEmptyHint ||
            "Тут буде історія оплат, залежностей та фінансових операцій по вашому кабінету."}
        </div>
      </div>
    </div>
  );
}

