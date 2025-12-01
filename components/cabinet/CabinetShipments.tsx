"use client";

import { useEffect, useState } from "react";
import { Locale, getTranslations, getShipmentStatusTranslation } from "@/lib/translations";
import {
  Package,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Package2,
  Clock,
  Image as ImageIcon,
  Warehouse,
  Plane,
  CheckCircle,
  Home,
  Archive,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ShipmentWithRelations } from "@/types/shipments";
import Image from "next/image";

type CabinetShipmentsProps = {
  locale: Locale;
};

type BalanceResponse = {
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
  currency: string;
};

type ShipmentsSummary = {
  received: number;
  inTransit: number;
  arrived: number;
  onWarehouse: number;
  total: number;
};

export function CabinetShipments({ locale }: CabinetShipmentsProps) {
  const t = getTranslations(locale);
  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithRelations | null>(null);
  const [photoModalImage, setPhotoModalImage] = useState<string | null>(null);
  const [photoModalIndex, setPhotoModalIndex] = useState<number>(0);
  const [allPhotos, setAllPhotos] = useState<string[]>([]);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [summary, setSummary] = useState<ShipmentsSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [shipmentsRes, balanceRes] = await Promise.allSettled([
          fetch("/api/user/shipments"),
          fetch("/api/user/balance"),
        ]);

        if (shipmentsRes.status === "fulfilled" && shipmentsRes.value.ok) {
          const data = await shipmentsRes.value.json();
          const loadedShipments: ShipmentWithRelations[] = data.shipments ?? [];
          setShipments(loadedShipments);
          setSummary(calculateSummary(loadedShipments));
        }

        if (balanceRes.status === "fulfilled" && balanceRes.value.ok) {
          const bal: BalanceResponse = await balanceRes.value.json();
          setBalance(bal);
        }
      } catch {
        // ignore error for now
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const haveShipments = shipments.length > 0;
  const formatDate = (d: string | Date | null) =>
    d ? new Date(d).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) : "-";

  const formatDateTime = (d: string | Date | null) =>
    d
      ? new Date(d).toLocaleString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  // Helper function to get status color
  const getStatusColorClass = (status: string) => {
    const statusColors: Record<string, string> = {
      CREATED: "from-blue-500 to-blue-600",
      RECEIVED_CN: "from-purple-500 to-purple-600",
      CONSOLIDATION: "from-indigo-500 to-indigo-600",
      IN_TRANSIT: "from-yellow-500 to-orange-500",
      ARRIVED_UA: "from-teal-500 to-teal-600",
      ON_UA_WAREHOUSE: "from-emerald-500 to-emerald-600",
      DELIVERED: "from-green-500 to-green-600",
      ARCHIVED: "from-slate-400 to-slate-500",
    };
    return statusColors[status] || "from-slate-400 to-slate-500";
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.shipments || "Вантаж"}
      </h2>

      {/* Top row: Balance + Statistics in one line */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10"></div>
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.cabinet?.totalAvailableTitle || "Загалом доступно:"}
            </p>
            <p className="mt-3 text-4xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              ~ {balance ? balance.balance.toFixed(2) : "0.00"} USD
            </p>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              {t.cabinet?.balanceHint ||
                "Баланс розраховується на основі поповнень та списань."}
            </p>
            {balance && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                <span className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 font-semibold border border-white/20">
                  Поповнень: {balance.incomeTotal.toFixed(2)} USD
                </span>
                <span className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 font-semibold border border-white/20">
                  Списань: {balance.expenseTotal.toFixed(2)} USD
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-5 shadow-md lg:col-span-3">
          <h3 className="mb-4 text-sm font-bold text-slate-900 uppercase tracking-wide">
            {t.cabinet?.shipmentsSummary || "Статистика вантажів"}
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <SummaryItem
              label={t.cabinet?.received || "Отримано"}
              value={summary?.received ?? 0}
            />
            <SummaryItem
              label={t.cabinet?.sent || "Відправлено"}
              value={summary?.inTransit ?? 0}
            />
            <SummaryItem
              label={t.cabinet?.arrived || "Прибуло"}
              value={summary?.arrived ?? 0}
            />
            <SummaryItem
              label={t.cabinet?.onWarehouse || "На складі"}
              value={summary?.onWarehouse ?? 0}
            />
          </div>
        </div>
      </div>

      {/* Shipments Cards */}
      <div className="space-y-4">
        {!haveShipments && !loading && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-400">
                <Package className="h-8 w-8" />
              </div>
            </div>
            <p className="mb-2 text-sm font-semibold text-slate-600">
              {t.cabinet?.noShipments || "Немає відправлень"}
            </p>
            <p className="text-xs text-slate-500">
              {t.cabinet?.shipmentsEmptyHint ||
                "Як тільки у вас з'являться відправлення, тут буде відображено їхній статус і рух."}
            </p>
          </div>
        )}

        {loading && (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">
              {t.cabinet?.loadingShipments || "Завантажуємо відправлення..."}
            </p>
          </div>
        )}

        {haveShipments && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Статус
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Місцезнаходження
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Місць
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Код
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Кг
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      m³
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      Вартість
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                      ETA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => {
                    const latestStatus = s.statusHistory[0];
                    const statusColor = getStatusColorClass(s.status);
                    return (
                      <tr
                        key={s.id}
                        id={`shipment-${s.id}`}
                        onClick={() => setSelectedShipment(s)}
                        className="cursor-pointer bg-white transition-all duration-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:shadow-md"
                      >
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-base font-black text-slate-900">
                            {s.internalTrack}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${statusColor} px-4 py-2 text-xs font-bold text-white shadow-md`}>
                            {getShipmentStatusTranslation(s.status, locale)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-medium text-slate-900">
                            {s.location || latestStatus?.location || "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-sm font-semibold text-slate-700">{s.pieces}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="font-mono text-xs text-slate-600">{s.cargoLabel || "-"}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-sm text-slate-700">
                            {s.weightKg?.toString() || "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-sm text-slate-700">
                            {s.volumeM3?.toString() || "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-base font-black text-slate-900">
                            {s.totalCost ? `${s.totalCost.toString()} $` : "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
                          <span className="text-sm font-medium text-slate-700">
                            {formatDate(s.eta as Date | null)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {(t.cabinet as any)?.shipmentModal?.title || "Вантаж"} {selectedShipment.internalTrack}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedShipment.cargoLabel || (t.cabinet as any)?.shipmentModal?.noLabel || "Без маркування"}
                </p>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Timeline Visualization */}
            <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 sm:px-8 py-14">
              <div className="flex items-start relative w-full">
                {[
                  { status: "CREATED", label: (t.cabinet as any)?.timelineStatuses?.CREATED || "Отримано" },
                  { status: "RECEIVED_CN", label: (t.cabinet as any)?.timelineStatuses?.RECEIVED_CN || "В Китаї" },
                  { status: "IN_TRANSIT", label: (t.cabinet as any)?.timelineStatuses?.IN_TRANSIT || "У дорозі" },
                  { status: "ARRIVED_UA", label: (t.cabinet as any)?.timelineStatuses?.ARRIVED_UA || "Прибуло" },
                  { status: "ON_UA_WAREHOUSE", label: (t.cabinet as any)?.timelineStatuses?.ON_UA_WAREHOUSE || "На складі" },
                  { status: "DELIVERED", label: (t.cabinet as any)?.timelineStatuses?.DELIVERED || "Доставлено" },
                ].map((item, idx, arr) => {
                  // Determine order of statuses
                  const statusOrder = [
                    "CREATED",
                    "RECEIVED_CN",
                    "CONSOLIDATION",
                    "IN_TRANSIT",
                    "ARRIVED_UA",
                    "ON_UA_WAREHOUSE",
                    "DELIVERED",
                    "ARCHIVED",
                  ];
                  
                  const currentStatusIndex = statusOrder.indexOf(selectedShipment.status);
                  const itemStatusIndex = statusOrder.indexOf(item.status);
                  
                  const isCompleted = itemStatusIndex < currentStatusIndex || 
                    (selectedShipment.status === "ARCHIVED") ||
                    (selectedShipment.status === "DELIVERED" && item.status === "DELIVERED");
                  const isActive = item.status === selectedShipment.status;
                  const showLine = idx < arr.length - 1;
                  const nextIsCompleted = showLine && statusOrder.indexOf(arr[idx + 1].status) < currentStatusIndex;

                  return (
                    <div key={item.status} className="flex flex-1 items-center relative">
                      <div className="flex flex-col items-center gap-2 sm:gap-3 w-full relative z-20">
                        <div
                          className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full transition-all duration-300 shadow-xl relative ${
                            isCompleted || isActive
                              ? `${getStatusColor(item.status)} text-white scale-100 shadow-2xl ring-2 ring-white`
                              : "bg-slate-200 text-slate-400 scale-95"
                          } ${isActive ? "ring-4 ring-offset-4 ring-offset-slate-50 ring-teal-400 animate-pulse" : ""}`}
                        >
                          {getStatusEmoji(item.status)}
                        </div>
                        <span className={`text-center text-xs sm:text-sm font-bold leading-tight px-1 ${
                          isCompleted || isActive ? "text-slate-900" : "text-slate-500"
                        }`}>
                          {item.label}
                        </span>
                        {/* Date under status */}
                        {(() => {
                          const statusHistoryItem = selectedShipment.statusHistory.find(
                            (h) => h.status === item.status
                          );
                          if (statusHistoryItem) {
                            return (
                              <span className="text-[10px] text-slate-500 mt-0.5">
                                {formatDate(statusHistoryItem.createdAt)}
                              </span>
                            );
                          }
                          // For DELIVERED status, show ETA if available
                          if (item.status === "DELIVERED" && selectedShipment.eta) {
                            return (
                              <span className="text-[10px] text-slate-500 mt-0.5">
                                {formatDate(selectedShipment.eta)}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      {showLine && (
                        <div 
                          className="absolute top-7 sm:top-8 h-0.5 z-10"
                          style={{ 
                            left: '50%',
                            right: '-50%',
                          }}
                        >
                          {/* Horizontal line connecting statuses - positioned at icon center level */}
                          {!isCompleted ? (
                            <div 
                              className="w-full h-full"
                              style={{
                                borderTop: '2px dashed #cbd5e1',
                              }}
                            />
                          ) : (
                            <div 
                              className="w-full h-1 bg-teal-500 rounded-full"
                              style={{
                                boxShadow: '0 1px 3px rgba(20, 184, 166, 0.4)',
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Status & Route */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      <Package2 className="h-4 w-4" />
                      {(t.cabinet as any)?.shipmentModal?.statusAndRoute || "Статус та маршрут"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.status || "Статус"}:</span>
                        <span className="font-semibold text-slate-900">
                          {getShipmentStatusTranslation(selectedShipment.status, locale)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.route || "Маршрут"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.routeFrom} → {selectedShipment.routeTo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.deliveryType || "Тип доставки"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.deliveryType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.location || "Місцезнаходження"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.location || selectedShipment.statusHistory[0]?.location || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      <Calendar className="h-4 w-4" />
                      {(t.cabinet as any)?.shipmentModal?.dates || "Дати"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.receivedAtWarehouse || "Отримано на складі"}:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(selectedShipment.receivedAtWarehouse as Date | null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.sent || "Відправлено"}:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(selectedShipment.sentAt as Date | null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.delivered || "Доставлено"}:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(selectedShipment.deliveredAt as Date | null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.expectedDate || "Очікувана дата"}:</span>
                        <span className="font-semibold text-teal-600">
                          {formatDate(selectedShipment.eta as Date | null)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weight & Volume */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      {(t.cabinet as any)?.shipmentModal?.weightAndVolume || "Вага та об'єм"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.weight || "Вага"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.weightKg || "-"} кг
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.volume || "Об'єм"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.volumeM3 || "-"} m³
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.density || "Плотність"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.density || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.pieces || "Місць"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.pieces}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insurance */}
                  {selectedShipment.insuranceTotal && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        {(t.cabinet as any)?.shipmentModal?.insurance || "Страхування"}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.insuranceAmount || "Сума страхування"}:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedShipment.insuranceTotal} $
                          </span>
                        </div>
                        {selectedShipment.insurancePercentTotal && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.insurancePercentTotal || "% загальний"}:</span>
                            <span className="font-semibold text-slate-900">
                              {selectedShipment.insurancePercentTotal}%
                            </span>
                          </div>
                        )}
                        {selectedShipment.insurancePerPlacePercent && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.insurancePercentPerPlace || "% за місце"}:</span>
                            <span className="font-semibold text-slate-900">
                              {selectedShipment.insurancePerPlacePercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Cost */}
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-teal-50 to-blue-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      <DollarSign className="h-4 w-4" />
                      {(t.cabinet as any)?.shipmentModal?.cost || "Вартість"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedShipment.deliveryCost && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.deliveryCost || "Доставка"}:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedShipment.deliveryCost} $
                          </span>
                        </div>
                      )}
                      {selectedShipment.deliveryCostPerPlace && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.costPerPlace || "За місце"}:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedShipment.deliveryCostPerPlace} $
                          </span>
                        </div>
                      )}
                      {selectedShipment.totalCost && (
                        <div className="mt-3 flex justify-between border-t border-slate-200 pt-2">
                          <span className="text-base font-semibold text-slate-900">
                            {(t.cabinet as any)?.shipmentModal?.totalCost || "Загальна вартість"}:
                          </span>
                          <span className="text-lg font-bold text-teal-600">
                            {selectedShipment.totalCost} $
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Format */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      {(t.cabinet as any)?.shipmentModal?.deliveryFormat || "Формат видачі"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.format || "Формат"}:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.deliveryFormat?.replace(/_/g, " ") || "-"}
                        </span>
                      </div>
                      {selectedShipment.deliveryReference && (
                        <div className="mt-2 rounded-lg bg-white p-2 text-xs text-slate-600">
                          {selectedShipment.deliveryReference}
                        </div>
                      )}
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span>{(t.cabinet as any)?.shipmentModal?.packing || "Пакування"}:</span>
                          <span className="font-medium">
                            {selectedShipment.packing ? ((t.cabinet as any)?.shipmentModal?.yes || "Так") : ((t.cabinet as any)?.shipmentModal?.no || "Ні")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{(t.cabinet as any)?.shipmentModal?.localDeliveryToDepot || "Локальна доставка до складу"}:</span>
                          <span className="font-medium">
                            {selectedShipment.localDeliveryToDepot ? ((t.cabinet as any)?.shipmentModal?.yes || "Так") : ((t.cabinet as any)?.shipmentModal?.no || "Ні")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photos and Documents */}
                  {(() => {
                    // Helper function to check if file is an image
                    const isImageFile = (url: string): boolean => {
                      const ext = url.split('.').pop()?.toLowerCase();
                      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '');
                    };

                    const allFiles = selectedShipment.additionalFilesUrls 
                      ? (() => {
                          try {
                            return JSON.parse(selectedShipment.additionalFilesUrls);
                          } catch {
                            return [];
                          }
                        })()
                      : [];
                    
                    // Separate files into images and documents
                    const imageFiles = allFiles.filter((url: string) => isImageFile(url));
                    const documentFiles = allFiles.filter((url: string) => !isImageFile(url));
                    
                    const hasPhotos = imageFiles.length > 0 || 
                      selectedShipment.mainPhotoUrl || 
                      selectedShipment.items.some(item => item.photoUrl);
                    const hasDocuments = documentFiles.length > 0;
                    
                    if (!hasPhotos && !hasDocuments) return null;
                    
                    return (
                      <>
                        {/* Photos Section */}
                        {hasPhotos && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                              <ImageIcon className="h-4 w-4" />
                              {(t.cabinet as any)?.shipmentModal?.photos || "Фото"} ({imageFiles.length + (selectedShipment.mainPhotoUrl ? 1 : 0) + selectedShipment.items.filter(item => item.photoUrl).length})
                            </h4>
                            
                            {/* Horizontal scrollable gallery */}
                            <div className="overflow-x-auto pb-2 -mx-4 px-4">
                              <div className="flex gap-3 min-w-max">
                                {/* Main photo first (if exists and not in imageFiles) */}
                                {selectedShipment.mainPhotoUrl && !imageFiles.includes(selectedShipment.mainPhotoUrl) && (
                                  <button
                                    onClick={() => {
                                      const photos = getAllPhotos(selectedShipment);
                                      setAllPhotos(photos);
                                      const index = photos.indexOf(selectedShipment.mainPhotoUrl!);
                                      setPhotoModalIndex(index >= 0 ? index : 0);
                                      setPhotoModalImage(selectedShipment.mainPhotoUrl!);
                                    }}
                                    className="relative h-40 sm:h-48 w-64 sm:w-80 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg"
                                  >
                                    <Image
                                      src={selectedShipment.mainPhotoUrl}
                                      alt={(t.cabinet as any)?.shipmentModal?.mainPhoto || "Головне фото вантажу"}
                                      fill
                                      className="object-cover"
                                    />
                                  </button>
                                )}
                                
                                {/* Additional photos from additionalFilesUrls */}
                                {imageFiles.map((url: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      const photos = getAllPhotos(selectedShipment);
                                      setAllPhotos(photos);
                                      const index = photos.indexOf(url);
                                      setPhotoModalIndex(index >= 0 ? index : 0);
                                      setPhotoModalImage(url);
                                    }}
                                    className="relative h-40 sm:h-48 w-64 sm:w-80 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg"
                                  >
                                    <Image
                                      src={url}
                                      alt={`${(t.cabinet as any)?.shipmentModal?.photoOfShipment || "Фото вантажу"} ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </button>
                                ))}
                                
                                {/* Item photos */}
                                {selectedShipment.items
                                  .filter(item => item.photoUrl)
                                  .map((item, idx) => (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        const photos = getAllPhotos(selectedShipment);
                                        setAllPhotos(photos);
                                        const index = photos.indexOf(item.photoUrl!);
                                        setPhotoModalIndex(index >= 0 ? index : 0);
                                        setPhotoModalImage(item.photoUrl!);
                                      }}
                                      className="relative h-40 sm:h-48 w-64 sm:w-80 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg"
                                    >
                                      <Image
                                        src={item.photoUrl!}
                                        alt={`${(t.cabinet as any)?.shipmentModal?.photoOfShipment || "Фото"} ${item.description || item.itemCode || idx + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </button>
                                  ))}
                              </div>
                            </div>
                            
                            {/* Scroll hint */}
                            <p className="mt-2 text-xs text-slate-500 text-center">
                              {(t.cabinet as any)?.shipmentModal?.scrollHint || "Прокрутіть вліво/вправо для перегляду всіх фото"}
                            </p>
                          </div>
                        )}

                        {/* Documents Section */}
                        {hasDocuments && (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                              <FileText className="h-4 w-4" />
                              {(t.cabinet as any)?.shipmentModal?.documents || "Документи"} ({documentFiles.length})
                            </h4>
                            <div className="space-y-2">
                              {documentFiles.map((url: string, idx: number) => {
                                const fileName = url.split('/').pop() || `${(t.cabinet as any)?.shipmentModal?.document || "Документ"} ${idx + 1}`;
                                const fileExt = fileName.split('.').pop()?.toUpperCase() || '';
                                // Convert /uploads/... to /api/files/uploads/... to bypass middleware
                                const fileUrl = url.startsWith('/uploads/') 
                                  ? `/api/files${url}` 
                                  : url;
                                return (
                                  <a
                                    key={idx}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-all hover:border-teal-300 hover:bg-teal-50 hover:shadow-md"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-slate-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                          {fileName}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          {fileExt} {(t.cabinet as any)?.shipmentModal?.file || "файл"}
                                        </p>
                                      </div>
                                    </div>
                                    <Download className="h-5 w-5 text-teal-600 flex-shrink-0" />
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}

                  {/* Tracking */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      <MapPin className="h-4 w-4" />
                      {(t.cabinet as any)?.shipmentModal?.tracking || "Трекінг"}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedShipment.localTrackingOrigin && (
                        <div>
                          <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.trackingOrigin || "Трек (країна відправлення)"}:</span>
                          <p className="mt-1 font-mono text-xs font-semibold text-slate-900">
                            {selectedShipment.localTrackingOrigin}
                          </p>
                        </div>
                      )}
                      {selectedShipment.localTrackingDestination && (
                        <div>
                          <span className="text-slate-600">{(t.cabinet as any)?.shipmentModal?.trackingDestination || "Трек (країна отримання)"}:</span>
                          <p className="mt-1 font-mono text-xs font-semibold text-slate-900">
                            {selectedShipment.localTrackingDestination}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              {selectedShipment.items.length > 0 && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
                    {(t.cabinet as any)?.shipmentModal?.itemsInBatch || "Позиції у партії"} ({selectedShipment.items.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedShipment.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <p className="text-xs text-slate-500">{(t.cabinet as any)?.shipmentModal?.descriptionOrCode || "Опис / Код"}</p>
                            <p className="font-semibold text-slate-900">
                              {item.description || item.itemCode || "-"}
                            </p>
                            {item.localTracking && (
                              <p className="mt-1 font-mono text-xs text-slate-500">
                                {item.localTracking}
                              </p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-slate-500">{(t.cabinet as any)?.shipmentModal?.quantity || "Кількість"}:</p>
                              <p className="font-semibold">{item.quantity ?? "-"}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">{(t.cabinet as any)?.shipmentModal?.weight || "Вага"}:</p>
                              <p className="font-semibold">{item.weightKg?.toString() || "-"} кг</p>
                            </div>
                            <div>
                              <p className="text-slate-500">{(t.cabinet as any)?.shipmentModal?.volume || "Об'єм"}:</p>
                              <p className="font-semibold">{item.volumeM3?.toString() || "-"} m³</p>
                            </div>
                            <div>
                              <p className="text-slate-500">{(t.cabinet as any)?.shipmentModal?.itemCost || "Вартість"}:</p>
                              <p className="font-semibold">
                                {item.totalCost ? `${item.totalCost.toString()} $` : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {item.photoUrl && (
                          <div className="mt-3">
                            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                              <Image
                                src={item.photoUrl}
                                alt={`${(t.cabinet as any)?.shipmentModal?.photoOfShipment || "Фото"} ${item.description || item.itemCode}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {selectedShipment.statusHistory.length > 0 && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                    <Clock className="h-4 w-4" />
                    {(t.cabinet as any)?.shipmentModal?.timeline || "Таймлайн статусів"}
                  </h4>
                  <div className="relative space-y-4 pl-6">
                    {selectedShipment.statusHistory.map((h, idx) => (
                      <div key={h.id} className="relative">
                        {idx < selectedShipment.statusHistory.length - 1 && (
                          <div className="absolute left-2 top-6 h-full w-0.5 bg-slate-300" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-semibold text-slate-900">
                              {getShipmentStatusTranslation(h.status, locale)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDateTime(h.createdAt)}
                            </p>
                            {h.location && (
                              <p className="mt-1 text-xs text-slate-500">
                                <MapPin className="mr-1 inline h-3 w-3" />
                                {h.location}
                              </p>
                            )}
                            {h.description && (
                              <p className="mt-1 text-sm text-slate-600">{h.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedShipment.description && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                    {(t.cabinet as any)?.shipmentModal?.description || "Опис"}
                  </h4>
                  <p className="text-sm text-slate-600">{selectedShipment.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {photoModalImage && allPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            setPhotoModalImage(null);
            setAllPhotos([]);
            setPhotoModalIndex(0);
          }}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setPhotoModalImage(null);
                setAllPhotos([]);
                setPhotoModalIndex(0);
              }}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Navigation arrows */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevIndex = photoModalIndex > 0 ? photoModalIndex - 1 : allPhotos.length - 1;
                    setPhotoModalIndex(prevIndex);
                    setPhotoModalImage(allPhotos[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextIndex = photoModalIndex < allPhotos.length - 1 ? photoModalIndex + 1 : 0;
                    setPhotoModalIndex(nextIndex);
                    setPhotoModalImage(allPhotos[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            <Image
              src={photoModalImage}
              alt={(t.cabinet as any)?.shipmentModal?.photoFullSize || "Фото в повному розмірі"}
              width={1200}
              height={800}
              className="h-auto max-h-[90vh] w-auto object-contain"
              priority
            />
            
            {/* Photo counter */}
            {allPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
                {photoModalIndex + 1} / {allPhotos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getAllPhotos(shipment: ShipmentWithRelations): string[] {
  const photos: string[] = [];
  
  // Helper function to check if file is an image
  const isImageFile = (url: string): boolean => {
    const ext = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '');
  };
  
  // Main photo
  if (shipment.mainPhotoUrl) {
    photos.push(shipment.mainPhotoUrl);
  }
  
  // Additional photos
  if (shipment.additionalFilesUrls) {
    try {
      const files = JSON.parse(shipment.additionalFilesUrls);
      const imageFiles = files.filter((url: string) => isImageFile(url));
      photos.push(...imageFiles);
    } catch {
      // ignore
    }
  }
  
  // Item photos
  shipment.items.forEach((item) => {
    if (item.photoUrl) {
      photos.push(item.photoUrl);
    }
  });
  
  return photos;
}

function calculateSummary(shipments: ShipmentWithRelations[]): ShipmentsSummary {
  const summary: ShipmentsSummary = {
    received: 0,
    inTransit: 0,
    arrived: 0,
    onWarehouse: 0,
    total: shipments.length,
  };

  for (const s of shipments) {
    switch (s.status) {
      case "RECEIVED_CN":
      case "CONSOLIDATION":
        summary.received += 1;
        break;
      case "IN_TRANSIT":
        summary.inTransit += 1;
        break;
      case "ARRIVED_UA":
      case "DELIVERED":
        summary.arrived += 1;
        break;
      case "ON_UA_WAREHOUSE":
        summary.onWarehouse += 1;
        break;
      default:
        break;
    }
  }

  return summary;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "CREATED":
      return "bg-slate-400";
    case "RECEIVED_CN":
    case "CONSOLIDATION":
      return "bg-sky-500";
    case "IN_TRANSIT":
      return "bg-amber-500";
    case "ARRIVED_UA":
      return "bg-orange-500";
    case "ON_UA_WAREHOUSE":
      return "bg-violet-500";
    case "DELIVERED":
      return "bg-emerald-500";
    case "ARCHIVED":
      return "bg-slate-500";
    default:
      return "bg-slate-400";
  }
}

function getStatusEmoji(status: string): React.ReactNode {
  const iconProps = { className: "h-5 w-5" };
  switch (status) {
    case "CREATED":
      return <Package {...iconProps} />;
    case "RECEIVED_CN":
    case "CONSOLIDATION":
      return <Warehouse {...iconProps} />;
    case "IN_TRANSIT":
      return <Plane {...iconProps} />;
    case "ARRIVED_UA":
      return <Plane {...iconProps} />;
    case "ON_UA_WAREHOUSE":
      return <Warehouse {...iconProps} />;
    case "DELIVERED":
      return <CheckCircle {...iconProps} />;
    case "ARCHIVED":
      return <Archive {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
}

type SummaryItemProps = {
  label: string;
  value: number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm hover:shadow-md transition-all hover:border-teal-300">
      <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-black text-teal-700">{value}</div>
    </div>
  );
}

