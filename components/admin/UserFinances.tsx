"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useCallback } from "react";
import { DollarSign, Loader2, Plus, X, Trash2, FileText, Download } from "lucide-react";
import { useBalance } from "./hooks/useBalance";
import { useInvoices } from "./hooks/useInvoices";
import { generateInvoiceNumber } from "./utils/shipmentUtils";
import type { ShipmentRow } from "./types/userDetail.types";

interface UserFinancesProps {
  userId: string;
  shipments: ShipmentRow[];
  error?: string;
  success?: string;
  onError: (error: string) => void;
  onSuccess: (success: string) => void;
  onCreateInvoiceFromShipment?: (createInvoiceFromShipment: (shipment: ShipmentRow) => void) => void;
}

export function UserFinances({
  userId,
  shipments,
  error,
  success,
  onError,
  onSuccess,
  onCreateInvoiceFromShipment,
}: UserFinancesProps) {
  const {
    balance,
    balanceLoading,
    transactionsWithBalance,
    loadingTransactions,
    balanceForm,
    setBalanceForm,
    updateBalance,
    fetchTransactions,
  } = useBalance(userId);

  const {
    invoices: rawInvoices,
    loadingInvoices,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    fetchInvoices,
  } = useInvoices(userId);

  // Sort invoices: newest first
  const invoices = useMemo(() => {
    return [...rawInvoices].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (dateB === dateA) {
        return b.id.localeCompare(a.id);
      }
      return dateB - dateA; // Newest first
    });
  }, [rawInvoices]);

  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    amount: "",
    shipmentId: "",
    status: "UNPAID",
    dueDate: "",
  });
  const [displayedTransactionsCount, setDisplayedTransactionsCount] = useState(5);
  const [displayedInvoicesCount, setDisplayedInvoicesCount] = useState(5);
  const [invoiceWarningModal, setInvoiceWarningModal] = useState<{
    show: boolean;
    shipmentTrack: string;
    existingInvoices: any[];
    onConfirm: () => void;
  }>({
    show: false,
    shipmentTrack: "",
    existingInvoices: [],
    onConfirm: () => {},
  });

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    onSuccess("");

    const result = await updateBalance(
      balanceForm.type,
      balanceForm.amount,
      balanceForm.description
    );

    if (result.success) {
      onSuccess("Баланс оновлено");
    } else {
      onError(result.error || "Не вдалося оновити баланс");
    }
  };

  const proceedWithInvoiceCreation = async () => {
    onError("");
    onSuccess("");

    const result = await createInvoice({
      invoiceNumber: invoiceForm.invoiceNumber,
      amount: invoiceForm.amount,
      shipmentId: invoiceForm.shipmentId,
      status: invoiceForm.status,
      dueDate: invoiceForm.dueDate,
    });

    if (result.success) {
      setShowAddInvoice(false);
      setInvoiceForm({
        invoiceNumber: "",
        amount: "",
        shipmentId: "",
        status: "UNPAID",
        dueDate: "",
      });
      // Show message if invoice number was modified
      const successMessage = (result as any).message 
        ? `Рахунок створено. ${(result as any).message}` 
        : "Рахунок створено";
      onSuccess(successMessage);
    } else {
      onError(result.error || "Не вдалося створити рахунок");
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    onSuccess("");

    // Перевірка, чи вже існує рахунок для цього вантажу
    if (invoiceForm.shipmentId && invoiceForm.shipmentId.trim() !== "") {
      const existingInvoices = invoices.filter(
        (inv) => inv.shipmentId === invoiceForm.shipmentId && inv.status !== "ARCHIVED"
      );

      if (existingInvoices.length > 0) {
        const shipment = shipments.find((s) => s.id === invoiceForm.shipmentId);
        const shipmentTrack = shipment?.internalTrack || "невідомий";
        
        setInvoiceWarningModal({
          show: true,
          shipmentTrack,
          existingInvoices,
          onConfirm: () => {
            setInvoiceWarningModal({ show: false, shipmentTrack: "", existingInvoices: [], onConfirm: () => {} });
            proceedWithInvoiceCreation();
          },
        });
        return;
      }
    }

    await proceedWithInvoiceCreation();
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    onError("");
    onSuccess("");

    const result = await updateInvoiceStatus(invoiceId, newStatus);
    if (result.success) {
      onSuccess("Статус рахунка оновлено");
    } else {
      onError(result.error || "Не вдалося оновити рахунок");
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Видалити цей рахунок?")) return;
    onError("");
    onSuccess("");

    const result = await deleteInvoice(invoiceId);
    if (result.success) {
      onSuccess("Рахунок видалено");
    } else {
      onError(result.error || "Не вдалося видалити рахунок");
    }
  };

  const createInvoiceFromShipment = useCallback((shipment: ShipmentRow) => {
    if (!shipment) {
      onError("Неможливо створити рахунок: вантаж не знайдено");
      return;
    }
    
    if (!shipment.internalTrack || shipment.internalTrack.trim() === "") {
      onError("Неможливо створити рахунок: вантаж не знайдено");
      return;
    }

    const existingInvoices = invoices.filter(
      (inv) => inv.shipmentId === shipment.id && inv.status !== "ARCHIVED"
    );

    if (existingInvoices.length > 0) {
      setInvoiceWarningModal({
        show: true,
        shipmentTrack: shipment.internalTrack,
        existingInvoices,
        onConfirm: () => {
          setInvoiceWarningModal({ show: false, shipmentTrack: "", existingInvoices: [], onConfirm: () => {} });
          setInvoiceForm({
            invoiceNumber: generateInvoiceNumber(shipment.internalTrack),
            amount: shipment.totalCost || "0",
            shipmentId: shipment.id,
            status: "UNPAID",
            dueDate: "",
          });
          setShowAddInvoice(true);
        },
      });
      return;
    }
    setInvoiceForm({
      invoiceNumber: generateInvoiceNumber(shipment.internalTrack),
      amount: shipment.totalCost || "0",
      shipmentId: shipment.id,
      status: "UNPAID",
      dueDate: "",
    });
    setShowAddInvoice(true);
  }, [invoices, onError]);

  // Expose createInvoiceFromShipment to parent component immediately
  useLayoutEffect(() => {
    if (onCreateInvoiceFromShipment) {
      onCreateInvoiceFromShipment(createInvoiceFromShipment);
    }
  }, [onCreateInvoiceFromShipment, createInvoiceFromShipment]);
  
  // Also update on regular effect to ensure it's set
  useEffect(() => {
    if (onCreateInvoiceFromShipment) {
      onCreateInvoiceFromShipment(createInvoiceFromShipment);
    }
  }, [onCreateInvoiceFromShipment, createInvoiceFromShipment]);

  return (
    <>
      {/* Balance management */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Баланс користувача</h2>
            <p className="text-sm text-slate-600">
              Поточний баланс:{" "}
              <span className="font-bold text-teal-700">
                {balanceLoading && !balance
                  ? "Завантаження..."
                  : `${(balance?.balance ?? 0).toFixed(2)} ${balance?.currency ?? "USD"}`}
              </span>
            </p>
            {balance && (
              <p className="mt-1 text-xs text-slate-500">
                Поповнення: {balance.incomeTotal.toFixed(2)} {balance.currency} · Списання:{" "}
                {balance.expenseTotal.toFixed(2)} {balance.currency}
              </p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleBalanceSubmit}
          className="mb-6 grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Тип операції
            </label>
            <select
              value={balanceForm.type}
              onChange={(e) => {
                const newType = e.target.value === "expense" ? "expense" : "income";
                setBalanceForm({
                  ...balanceForm,
                  type: newType,
                  selectedInvoiceId: newType === "income" ? "" : balanceForm.selectedInvoiceId,
                  amount: newType === "income" ? "" : balanceForm.amount,
                  description: newType === "income" ? "" : balanceForm.description,
                });
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="income">Поповнення</option>
              <option value="expense">Списання</option>
            </select>
          </div>
          {balanceForm.type === "expense" && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Оберіть рахунок (опціонально)
              </label>
              <select
                value={balanceForm.selectedInvoiceId}
                onChange={(e) => {
                  const selectedInvoiceId = e.target.value;
                  if (selectedInvoiceId) {
                    const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);
                    if (selectedInvoice) {
                      setBalanceForm({
                        ...balanceForm,
                        selectedInvoiceId: selectedInvoiceId,
                        amount: selectedInvoice.amount,
                        description: selectedInvoice.invoiceNumber,
                      });
                    }
                  } else {
                    setBalanceForm({
                      ...balanceForm,
                      selectedInvoiceId: "",
                      amount: "",
                      description: "",
                    });
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="">Не вибрано</option>
                {invoices
                  .filter((inv) => inv.status === "UNPAID")
                  .map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.amount} USD
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Сума, USD
            </label>
            <input
              type="number"
              min={0.01}
              step="0.01"
              value={balanceForm.amount}
              onChange={(e) =>
                setBalanceForm({
                  ...balanceForm,
                  amount: e.target.value,
                })
              }
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Коментар (опціонально)
            </label>
            <input
              type="text"
              value={balanceForm.description}
              onChange={(e) =>
                setBalanceForm({
                  ...balanceForm,
                  description: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Оновити баланс
            </button>
          </div>
        </form>

        <div className="mt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Історія транзакцій</h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Дата</th>
                  <th className="px-3 py-2 text-left">Тип</th>
                  <th className="px-3 py-2 text-left">Опис</th>
                  <th className="px-3 py-2 text-right">Сума, USD</th>
                  <th className="px-3 py-2 text-right">Баланс, USD</th>
                </tr>
              </thead>
              <tbody>
                {loadingTransactions ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                      <Loader2 className="mr-2 inline h-3 w-3 animate-spin" />
                      Завантаження транзакцій...
                    </td>
                  </tr>
                ) : transactionsWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                      Немає транзакцій
                    </td>
                  </tr>
                ) : (
                  transactionsWithBalance.slice(0, displayedTransactionsCount).map((tx) => (
                    <tr key={tx.id} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        {new Date(tx.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                      <td className="px-3 py-2">
                        {tx.type === "income" ? "Поповнення" : "Списання"}
                      </td>
                      <td className="px-3 py-2">{tx.description || "—"}</td>
                      <td
                        className={`px-3 py-2 text-right font-semibold ${
                          tx.type === "income" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {Number(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-800">
                        {tx.runningBalance.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {transactionsWithBalance.length > displayedTransactionsCount && (
            <div className="mt-4 flex justify-center border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setDisplayedTransactionsCount(prev => prev + 5)}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                Показати ще транзакцій ({transactionsWithBalance.length - displayedTransactionsCount} залишилось)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Рахунки
            </h2>
            {invoices.length > 0 && (
              <p className="mt-1 text-sm text-slate-600">
                Загалом до сплати:{" "}
                <span className="font-bold text-red-600">
                  {invoices
                    .filter((inv) => inv.status === "UNPAID")
                    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
                    .toFixed(2)}{" "}
                  USD
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAddInvoice((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {showAddInvoice ? (
              <>
                <X className="h-4 w-4" /> Закрити форму
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Додати рахунок
              </>
            )}
          </button>
        </div>

        {showAddInvoice && (
          <form
            onSubmit={handleCreateInvoice}
            className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3"
          >
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Номер рахунка
              </label>
              <input
                type="text"
                value={invoiceForm.invoiceNumber}
                onChange={(e) =>
                  setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })
                }
                required
                placeholder="INV-3284Е0001"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Автоматично генерується при виборі вантажу (формат: INV-{`{частина після дефісу}`})
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Сума, USD
              </label>
              <input
                type="number"
                min={0.01}
                step="0.01"
                value={invoiceForm.amount}
                onChange={(e) =>
                  setInvoiceForm({ ...invoiceForm, amount: e.target.value })
                }
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Прив'язати до вантажу
              </label>
              <select
                value={invoiceForm.shipmentId}
                onChange={(e) => {
                  const shipmentId = e.target.value;
                  if (shipmentId) {
                    const selectedShipment = shipments.find((s) => s.id === shipmentId);
                    if (selectedShipment) {
                      setInvoiceForm({
                        ...invoiceForm,
                        shipmentId: shipmentId,
                        invoiceNumber: generateInvoiceNumber(selectedShipment.internalTrack),
                        amount: selectedShipment.totalCost || invoiceForm.amount,
                      });
                    }
                  } else {
                    setInvoiceForm({
                      ...invoiceForm,
                      shipmentId: "",
                      invoiceNumber: invoiceForm.invoiceNumber || "",
                    });
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="">Без прив'язки</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.internalTrack} {s.totalCost ? `(${s.totalCost} $)` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Статус
              </label>
              <select
                value={invoiceForm.status}
                onChange={(e) =>
                  setInvoiceForm({ ...invoiceForm, status: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="UNPAID">Неоплачено</option>
                <option value="PAID">Оплачено</option>
                <option value="ARCHIVED">Архів</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Термін оплати (опціонально)
              </label>
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) =>
                  setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Створити рахунок
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Дата</th>
                <th className="px-3 py-2 text-left">Трек номер</th>
                <th className="px-3 py-2 text-left">Номер рахунку</th>
                <th className="px-3 py-2 text-right">Сума до сплати</th>
                <th className="px-3 py-2 text-left">Статус</th>
                <th className="px-3 py-2 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {loadingInvoices ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                    <Loader2 className="mr-2 inline h-3 w-3 animate-spin" />
                    Завантаження рахунків...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                    Немає рахунків
                  </td>
                </tr>
              ) : (
                invoices.slice(0, displayedInvoicesCount).map((inv) => (
                  <tr key={inv.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      {new Date(inv.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="px-3 py-2">
                      {inv.shipment ? (
                        <button
                          onClick={() => {
                            const shipmentElement = document.getElementById(`shipment-${inv.shipmentId}`);
                            if (shipmentElement) {
                              shipmentElement.scrollIntoView({ behavior: "smooth", block: "center" });
                              shipmentElement.classList.add("ring-2", "ring-teal-500");
                              setTimeout(() => {
                                shipmentElement.classList.remove("ring-2", "ring-teal-500");
                              }, 2000);
                            }
                          }}
                          className="text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                        >
                          {inv.shipment.internalTrack}
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-sm text-slate-700">
                      {inv.invoiceNumber || "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {parseFloat(inv.amount).toFixed(2)} USD
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={inv.status}
                        onChange={(e) => handleUpdateInvoiceStatus(inv.id, e.target.value)}
                        className={`rounded-md border-0 px-2 py-1 text-xs font-semibold ${
                          inv.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "ARCHIVED"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <option value="UNPAID">Неоплачено</option>
                        <option value="PAID">Оплачено</option>
                        <option value="ARCHIVED">Архів</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/invoices/${inv.id}/generate`);
                              if (!response.ok) {
                                throw new Error("Failed to generate invoice");
                              }
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `invoice_${inv.invoiceNumber}_${new Date().toISOString().split("T")[0]}.xlsx`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                            } catch (error) {
                              console.error("Error downloading invoice:", error);
                              onError("Помилка при завантаженні інвойсу. Спробуйте пізніше.");
                            }
                          }}
                          className="flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-teal-700 transition-colors"
                          title="Завантажити Excel"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="hidden sm:inline">Excel</span>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/invoices/${inv.id}/generate-pdf`);
                              if (!response.ok) {
                                throw new Error("Failed to generate PDF invoice");
                              }
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, "_blank");
                              setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                            } catch (error) {
                              console.error("Error downloading PDF invoice:", error);
                              onError("Помилка при завантаженні PDF інвойсу. Спробуйте пізніше.");
                            }
                          }}
                          className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-red-700 transition-colors"
                          title="Завантажити PDF"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Видалити"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {invoices.length > displayedInvoicesCount && (
          <div className="mt-4 flex justify-center border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setDisplayedInvoicesCount(prev => prev + 5)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              Показати ще рахунків ({invoices.length - displayedInvoicesCount} залишилось)
            </button>
          </div>
        )}
      </div>

      {/* Invoice Warning Modal */}
      {invoiceWarningModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Попередження: Існуючі рахунки
            </h3>
            <p className="mb-2 text-sm text-slate-600">
              Для вантажу <span className="font-semibold">{invoiceWarningModal.shipmentTrack}</span> вже існує{" "}
              <span className="font-bold text-red-600">{invoiceWarningModal.existingInvoices.length}</span> рахунок(ів):
            </p>
            <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-2">
                {invoiceWarningModal.existingInvoices.map((inv) => {
                  const status = inv.status === "PAID" 
                    ? { label: "Оплачено", color: "text-green-700 bg-green-50" }
                    : inv.status === "ARCHIVED"
                    ? { label: "Архів", color: "text-slate-700 bg-slate-100" }
                    : { label: "Неоплачено", color: "text-red-700 bg-red-50" };
                  return (
                    <div key={inv.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{inv.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-500">
                          {parseFloat(inv.amount).toFixed(2)} USD
                        </p>
                      </div>
                      <span className={`rounded px-2 py-1 text-[10px] font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={invoiceWarningModal.onConfirm}
                className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Створити все одно
              </button>
              <button
                onClick={() =>
                  setInvoiceWarningModal({
                    show: false,
                    shipmentTrack: "",
                    existingInvoices: [],
                    onConfirm: () => {},
                  })
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

