"use client";

import { useEffect, useState } from "react";
import { Locale, getTranslations } from "@/lib/translations";
import { FileText, Loader2, Package, Download } from "lucide-react";

type CabinetInvoicesProps = {
  locale: Locale;
};

type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  amount: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  shipmentId: string | null;
  shipment?: {
    id: string;
    internalTrack: string;
    totalCost: string | null;
    createdAt: string;
  } | null;
};

export function CabinetInvoices({ locale }: CabinetInvoicesProps) {
  const t = getTranslations(locale);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/invoices");
        if (res.ok) {
          const data = await res.json();
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

  const unpaidTotal = invoices
    .filter((inv) => inv.status === "UNPAID")
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      UNPAID: t.cabinet?.invoiceUnpaid || "Неоплачено",
      PAID: t.cabinet?.invoicePaid || "Оплачено",
      ARCHIVED: t.cabinet?.invoiceArchived || "Архів",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "ARCHIVED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  // Format track number - remove batch number part (before dash)
  const formatTrackNumber = (track: string | null | undefined): string => {
    if (!track) return "-";
    const parts = track.split("-");
    // Return part after first dash, or original if no dash
    return parts.length > 1 ? parts.slice(1).join("-") : track;
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.invoices || "Рахунки"}
      </h2>

      {invoices.length > 0 && unpaidTotal > 0 && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {t.cabinet?.totalToPay || "Загалом до сплати:"}
              </p>
              <p className="mt-2 text-3xl font-black text-red-600">
                {unpaidTotal.toFixed(2)} USD
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t.cabinet?.totalToPayHint ||
                  "(урахування всіх несплачених рахунків)"}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="ml-2 text-sm text-slate-600">
              {t.cabinet?.loadingInvoices || "Завантаження рахунків..."}
            </span>
          </div>
        ) : invoices.length === 0 ? (
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
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="space-y-3 sm:hidden">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 mb-1">
                        {inv.invoiceNumber || "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDate(inv.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 mb-1">
                        {parseFloat(inv.amount).toFixed(2)} USD
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-bold ${getStatusColor(
                          inv.status,
                        )}`}
                      >
                        {getStatusLabel(inv.status)}
                      </span>
                    </div>
                  </div>
                  
                  {inv.shipment && (
                    <div className="mb-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("tab", "shipments");
                          window.location.href = url.toString();
                          setTimeout(() => {
                            const shipmentElement = document.getElementById(
                              `shipment-${inv.shipmentId}`,
                            );
                            if (shipmentElement) {
                              shipmentElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              shipmentElement.classList.add(
                                "ring-2",
                                "ring-teal-500",
                              );
                              setTimeout(() => {
                                shipmentElement.classList.remove(
                                  "ring-2",
                                  "ring-teal-500",
                                );
                              }, 2000);
                            }
                          }, 300);
                        }}
                        className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-semibold text-xs"
                      >
                        <Package className="h-3.5 w-3.5" />
                        {formatTrackNumber(inv.shipment.internalTrack)}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
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
                          alert("Помилка при завантаженні інвойсу. Спробуйте пізніше.");
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          // Check if mobile device
                          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                          
                          if (isMobile) {
                            // For mobile: save file and redirect to URL
                            const response = await fetch(`/api/invoices/${inv.id}/generate-pdf?save=true`);
                            if (!response.ok) {
                              throw new Error("Failed to generate PDF invoice");
                            }
                            const data = await response.json();
                            // Redirect to file URL for download
                            window.location.href = data.url;
                          } else {
                            // For desktop: download directly
                            const response = await fetch(`/api/invoices/${inv.id}/generate-pdf`);
                            if (!response.ok) {
                              throw new Error("Failed to generate PDF invoice");
                            }
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `invoice_${inv.invoiceNumber}_${new Date().toISOString().split("T")[0]}.pdf`;
                            a.style.display = "none";
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                            }, 100);
                          }
                        } catch (error) {
                          console.error("Error downloading PDF invoice:", error);
                          alert("Помилка при завантаженні PDF інвойсу. Спробуйте пізніше.");
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto rounded-xl sm:block">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-4 py-3.5 text-left font-bold rounded-tl-xl">
                    {t.cabinet?.invoiceDate || "Дата"}
                  </th>
                  <th className="px-4 py-3.5 text-left font-bold">
                    {(t.cabinet as any)?.invoiceNumber || "Номер рахунку"}
                  </th>
                  <th className="px-4 py-3.5 text-left font-bold">
                    {t.cabinet?.invoiceTrackNumber || "Трек номер"}
                  </th>
                  <th className="px-4 py-3.5 text-right font-bold">
                    {t.cabinet?.invoiceAmount || "Сума до сплати"}
                  </th>
                  <th className="px-4 py-3.5 text-left font-bold">
                    {t.cabinet?.invoiceStatus || "Статус"}
                  </th>
                  <th className="px-4 py-3.5 text-center font-bold rounded-tr-xl">
                    {locale === "ua" ? "Дії" : locale === "ru" ? "Действия" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="rounded-xl bg-white align-middle text-slate-800 shadow-md border border-slate-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg hover:border-blue-200 hover:scale-[1.01]"
                  >
                    <td className="px-4 py-4">
                      {formatDate(inv.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-900">
                        {inv.invoiceNumber || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {inv.shipment ? (
                        <button
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set("tab", "shipments");
                            window.location.href = url.toString();
                            setTimeout(() => {
                              const shipmentElement = document.getElementById(
                                `shipment-${inv.shipmentId}`,
                              );
                              if (shipmentElement) {
                                shipmentElement.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                                shipmentElement.classList.add(
                                  "ring-2",
                                  "ring-teal-500",
                                );
                                setTimeout(() => {
                                  shipmentElement.classList.remove(
                                    "ring-2",
                                    "ring-teal-500",
                                  );
                                }, 2000);
                              }
                            }, 300);
                          }}
                          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                        >
                          <Package className="h-3.5 w-3.5" />
                          {formatTrackNumber(inv.shipment.internalTrack)}
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900">
                      {parseFloat(inv.amount).toFixed(2)} USD
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusColor(
                          inv.status,
                        )}`}
                      >
                        {getStatusLabel(inv.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
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
                              alert("Помилка при завантаженні інвойсу. Спробуйте пізніше.");
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                          title="Завантажити Excel"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Excel</span>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              // Check if mobile device
                              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                              
                              if (isMobile) {
                                // For mobile: save file and redirect to URL
                                const response = await fetch(`/api/invoices/${inv.id}/generate-pdf?save=true`);
                                if (!response.ok) {
                                  throw new Error("Failed to generate PDF invoice");
                                }
                                const data = await response.json();
                                // Redirect to file URL for download
                                window.location.href = data.url;
                              } else {
                                // For desktop: download directly
                                const response = await fetch(`/api/invoices/${inv.id}/generate-pdf`);
                                if (!response.ok) {
                                  throw new Error("Failed to generate PDF invoice");
                                }
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `invoice_${inv.invoiceNumber}_${new Date().toISOString().split("T")[0]}.pdf`;
                                a.style.display = "none";
                                document.body.appendChild(a);
                                a.click();
                                // Clean up after a delay to ensure download starts
                                setTimeout(() => {
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);
                                }, 100);
                              }
                            } catch (error) {
                              console.error("Error downloading PDF invoice:", error);
                              alert("Помилка при завантаженні PDF інвойсу. Спробуйте пізніше.");
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                          title="Завантажити PDF"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

