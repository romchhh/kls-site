"use client";

import { useEffect, useState } from "react";
import { Locale, getTranslations } from "@/lib/translations";
import { DollarSign, Loader2, FileText } from "lucide-react";

type CabinetFinancesProps = {
  locale: Locale;
};

type TransactionRow = {
  id: string;
  type: string;
  amount: string;
  description: string | null;
  createdAt: string;
};

type BalanceResponse = {
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
  currency: string;
};

type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  amount: string;
  status: string;
  shipmentId: string | null;
  shipment: {
    id: string;
    internalTrack: string;
  } | null;
};

export function CabinetFinances({ locale }: CabinetFinancesProps) {
  const t = getTranslations(locale);
  const labels = (t.cabinet as any) || {};
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [txRes, balRes, invRes] = await Promise.allSettled([
          fetch("/api/user/transactions"),
          fetch("/api/user/balance"),
          fetch("/api/user/invoices"),
        ]);

        if (txRes.status === "fulfilled" && txRes.value.ok) {
          const data = await txRes.value.json();
          setTransactions(data.transactions || []);
        }

        if (balRes.status === "fulfilled" && balRes.value.ok) {
          const data = (await balRes.value.json()) as BalanceResponse;
          setBalance(data);
        }

        if (invRes.status === "fulfilled" && invRes.value.ok) {
          const data = await invRes.value.json();
          setInvoices(data.invoices || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const rows = getUserTransactionsWithBalance(transactions).slice().reverse();

  // Calculate unpaid invoices
  const unpaidInvoices = invoices.filter((inv) => inv.status === "UNPAID");
  const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0);
  const unpaidShipmentsCount = new Set(unpaidInvoices.filter((inv) => inv.shipmentId).map((inv) => inv.shipmentId)).size;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {labels.finances || "Фінанси"}
      </h2>

      {/* Invoices Block */}
      {unpaidInvoices.length > 0 && (
        <div className="mb-6 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {labels.unpaidInvoicesTitle || "Рахунки до оплати"}
              </p>
              <p className="mt-2 text-3xl font-black text-orange-600">
                {unpaidAmount.toFixed(2)} {balance?.currency ?? "USD"}
              </p>
              <div className="mt-1 text-xs text-slate-500">
                {labels.unpaidInvoicesSubtitle || "За"} {unpaidShipmentsCount} {labels.shipmentsCount || "вантажів"}
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </div>
      )}

      {balance && balance.balance > 0 && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {labels.balanceTitle || "Поточний баланс"}
              </p>
              <p className="mt-2 text-3xl font-black text-red-600">
                {(balance?.balance ?? 0).toFixed(2)} {balance?.currency ?? "USD"}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>
                  {(labels.incomeTotalLabel || "Поповнення") +
                    ": " +
                    balance.incomeTotal.toFixed(2) +
                    " " +
                    balance.currency}
                </span>
                <span>·</span>
                <span>
                  {(labels.expenseTotalLabel || "Списання") +
                    ": " +
                    balance.expenseTotal.toFixed(2) +
                    " " +
                    balance.currency}
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg">
              <DollarSign className="h-7 w-7" />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="ml-2 text-sm text-slate-600">
              {labels.loadingTransactions || "Завантаження транзакцій..."}
            </span>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-md">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {labels.finances || "Фінанси"}
                </p>
                <p className="text-sm text-slate-600">
                  {labels.noTransactions || "Немає транзакцій"}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm text-slate-500">
              {labels.transactionsTitle || "Історія транзакцій"}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-4 py-3.5 text-left font-bold rounded-tl-xl">
                    {labels.txDate || "Дата"}
                  </th>
                  <th className="px-4 py-3.5 text-left font-bold">
                    {labels.txType || "Тип"}
                  </th>
                  <th className="px-4 py-3.5 text-left font-bold">
                    {labels.txDescription || "Опис"}
                  </th>
                  <th className="px-4 py-3.5 text-right font-bold">
                    {labels.txAmount || "Сума, USD"}
                  </th>
                  <th className="px-4 py-3.5 text-right font-bold rounded-tr-xl">
                    {labels.txBalance || "Баланс, USD"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((tx) => (
                  <tr
                    key={tx.id}
                    className="rounded-xl bg-white align-middle text-slate-800 shadow-md border border-slate-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg hover:border-blue-200 hover:scale-[1.01]"
                  >
                    <td className="px-4 py-4">
                      {new Date(tx.createdAt).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      {tx.type === "income"
                        ? labels.txIncome || "Поповнення"
                        : labels.txExpense || "Списання"}
                    </td>
                    <td className="px-4 py-4">{tx.description || "—"}</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900">
                      <span className={tx.type === "income" ? "text-emerald-600" : "text-red-600"}>
                        {tx.type === "income" ? "+" : "-"}
                        {Number(tx.amount).toFixed(2)} USD
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-800">
                      {tx.runningBalance.toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getUserTransactionsWithBalance(
  source: TransactionRow[],
): (TransactionRow & { runningBalance: number })[] {
  let balanceValue = 0;
  return source.map((tx) => {
    const amountNum = Number(tx.amount);
    if (tx.type === "income") {
      balanceValue += amountNum;
    } else {
      balanceValue -= amountNum;
    }
    return { ...tx, runningBalance: balanceValue };
  });
}


