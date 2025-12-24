"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Package,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface StatisticsData {
  users: {
    total: number;
    active: number;
  };
  admins: {
    total: number;
  } | null;
  shipments: {
    total: number;
    byStatus: Record<string, number>;
  };
  invoices: {
    total: number;
    byStatus: Record<string, { count: number; amount: number }>;
    totalAmount: number;
    unpaidAmount: number;
  };
  transactions: {
    total: number;
    totalIncome: number;
    totalExpense: number;
  };
  balance: {
    total: number;
  };
  recent: {
    shipments: Array<{
      id: string;
      internalTrack: string;
      status: string;
      createdAt: string;
      user: {
        name: string;
        clientCode: string;
      };
    }>;
    invoices: Array<{
      id: string;
      invoiceNumber: string;
      amount: string;
      status: string;
      createdAt: string;
      user: {
        name: string;
        clientCode: string;
      };
    }>;
  };
}

export function Statistics() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/statistics");
      if (res.ok) {
        const data = await res.json();
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      UNPAID: "bg-red-100 text-red-700 border-red-200",
      PAID: "bg-green-100 text-green-700 border-green-200",
      ARCHIVED: "bg-slate-100 text-slate-700 border-slate-200",
      CREATED: "bg-blue-100 text-blue-700 border-blue-200",
      RECEIVED_CN: "bg-purple-100 text-purple-700 border-purple-200",
      IN_TRANSIT: "bg-yellow-100 text-yellow-700 border-yellow-200",
      ARRIVED_UA: "bg-teal-100 text-teal-700 border-teal-200",
      ON_UA_WAREHOUSE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      DELIVERED: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      UNPAID: "Неоплачено",
      PAID: "Оплачено",
      ARCHIVED: "Архів",
      CREATED: "Створено",
      RECEIVED_CN: "Отримано в Китаї",
      IN_TRANSIT: "У дорозі",
      ARRIVED_UA: "Прибув в Україну",
      ON_UA_WAREHOUSE: "На складі",
      DELIVERED: "Доставлено",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-3 text-slate-600">Завантаження статистики...</span>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Помилка завантаження статистики
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-black text-slate-900">Статистика системи</h1>

      {/* Main Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Всього користувачів</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.users.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Активних: {statistics.users.active}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total Admins (only for SuperAdmin) */}
        {isSuperAdmin && statistics.admins && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Всього адмінів</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {statistics.admins.total}
                </p>
              </div>
              <div className="rounded-full bg-teal-100 p-3">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
        )}

        {/* Total Shipments */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Всього вантажів</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.shipments.total}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Всього рахунків</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.invoices.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Неоплачено: {formatCurrency(statistics.invoices.unpaidAmount)}
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Загальний баланс</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {formatCurrency(statistics.balance.total)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Загальний дохід</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {formatCurrency(statistics.transactions.totalIncome)}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-red-50 to-pink-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Загальні витрати</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {formatCurrency(statistics.transactions.totalExpense)}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <TrendingUp className="h-6 w-6 text-red-600 rotate-180" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shipments by Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Вантажі за статусами</h2>
          <div className="space-y-3">
            {Object.entries(statistics.shipments.byStatus).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <span className="text-sm font-medium text-slate-700">
                  {getStatusLabel(status)}
                </span>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-bold text-teal-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices by Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Рахунки за статусами</h2>
          <div className="space-y-3">
            {Object.entries(statistics.invoices.byStatus).map(([status, data]) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    {getStatusLabel(status)}
                  </span>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(data.amount)}
                  </p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                  {data.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Shipments */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
            <Clock className="h-5 w-5" />
            Останні вантажі
          </h2>
          <div className="space-y-3">
            {statistics.recent.shipments.length === 0 ? (
              <p className="text-sm text-slate-500">Немає вантажів</p>
            ) : (
              statistics.recent.shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {shipment.internalTrack}
                      </p>
                      <p className="text-xs text-slate-600">
                        {shipment.user.name} ({shipment.user.clientCode})
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-bold ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {getStatusLabel(shipment.status)}
                      </span>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(shipment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
            <FileText className="h-5 w-5" />
            Останні рахунки
          </h2>
          <div className="space-y-3">
            {statistics.recent.invoices.length === 0 ? (
              <p className="text-sm text-slate-500">Немає рахунків</p>
            ) : (
              statistics.recent.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-slate-600">
                        {invoice.user.name} ({invoice.user.clientCode})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {formatCurrency(Number(invoice.amount))}
                        </p>
                        <span
                          className={`mt-1 inline-flex items-center rounded-full border px-2 py-1 text-xs font-bold ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusLabel(invoice.status)}
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/invoices/${invoice.id}/generate`);
                              if (!response.ok) {
                                throw new Error("Failed to generate invoice");
                              }
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `invoice_${invoice.invoiceNumber}_${new Date().toISOString().split("T")[0]}.xlsx`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                            } catch (error) {
                              console.error("Error downloading invoice:", error);
                            }
                          }}
                          className="rounded-md bg-teal-600 p-1.5 text-white hover:bg-teal-700 transition-colors"
                          title="Завантажити Excel"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/invoices/${invoice.id}/generate-pdf`);
                              if (!response.ok) {
                                throw new Error("Failed to generate PDF invoice");
                              }
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, "_blank");
                              setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                            } catch (error) {
                              console.error("Error downloading PDF invoice:", error);
                            }
                          }}
                          className="rounded-md bg-red-600 p-1.5 text-white hover:bg-red-700 transition-colors"
                          title="Завантажити PDF"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

