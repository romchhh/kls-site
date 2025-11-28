"use client";

import { Locale, getTranslations } from "@/lib/translations";
import { FileText } from "lucide-react";

type CabinetInvoicesProps = {
  locale: Locale;
};

export function CabinetInvoices({ locale }: CabinetInvoicesProps) {
  const t = getTranslations(locale);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.invoices || "Рахунки"}
      </h2>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t.cabinet?.invoices || "Рахунки"}
            </p>
            <p className="text-sm text-slate-600">
              {t.cabinet?.noInvoices || "Немає рахунків"}
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm text-slate-500">
          {t.cabinet?.invoicesEmptyHint ||
            "Коли з'являться рахунки, тут ви побачите їхній статус, суми та дати оплати."}
        </div>
      </div>
    </div>
  );
}

