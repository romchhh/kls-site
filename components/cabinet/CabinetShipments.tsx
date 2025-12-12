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
  readyForPickup: number;
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
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [shipmentsRes, balanceRes, invoicesRes] = await Promise.allSettled([
          fetch("/api/user/shipments"),
          fetch("/api/user/balance"),
          fetch("/api/user/invoices"),
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

        if (invoicesRes.status === "fulfilled" && invoicesRes.value.ok) {
          const invData = await invoicesRes.value.json();
          setInvoices(invData.invoices || []);
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
  
  // Format track number - remove batch number part (before dash)
  const formatTrackNumber = (track: string | null | undefined): string => {
    if (!track) return "-";
    const parts = track.split("-");
    // Return part after first dash, or original if no dash
    return parts.length > 1 ? parts.slice(1).join("-") : track;
  };

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
                  {t.cabinet?.topUpsLabel || "Поповнень:"} {balance.incomeTotal.toFixed(2)} USD
                </span>
                <span className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 font-semibold border border-white/20">
                  {t.cabinet?.withdrawalsLabel || "Списань:"} {balance.expenseTotal.toFixed(2)} USD
                </span>
              </div>
            )}
            {invoices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-300 mb-2">
                  {t.cabinet?.invoicesTitle || "Виставлені рахунки"}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                  <span className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 font-semibold border border-white/20">
                    {t.cabinet?.totalLabel || "Всього:"} {invoices.length} {invoices.length === 1 
                      ? (t.cabinet?.invoice || "рахунок")
                      : invoices.length < 5 
                        ? ((t.cabinet as any)?.invoicesFew || "рахунки")
                        : (t.cabinet?.invoicesPlural || "рахунків")}
                  </span>
                  <span className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 font-semibold border border-white/20">
                    {t.cabinet?.amountLabel || "Сума:"} {invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0).toFixed(2)} USD
                  </span>
                  {invoices.filter((inv) => inv.status === "UNPAID").length > 0 && (
                    <span className="rounded-lg bg-orange-500/20 backdrop-blur-sm px-3 py-1.5 font-semibold border border-orange-400/30 text-orange-200">
                      {t.cabinet?.toPayLabel || "До оплати:"} {invoices.filter((inv) => inv.status === "UNPAID").reduce((sum, inv) => sum + parseFloat(inv.amount || "0"), 0).toFixed(2)} USD
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-lg lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            {t.cabinet?.shipmentsSummary || "Статистика вантажів"}
          </h3>
            {summary && summary.total > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm border border-slate-200/50">
                <Package className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-xs font-bold text-slate-700">
                  {summary.total} {summary.total === 1 ? ((t.cabinet as any)?.shipmentSingular || "вантаж") : summary.total < 5 ? ((t.cabinet as any)?.shipmentPlural2 || "вантажі") : ((t.cabinet as any)?.shipmentPlural5 || "вантажів")}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <SummaryItem
              label={t.cabinet?.received || "Отримано"}
              value={summary?.received ?? 0}
              total={summary?.total ?? 0}
              color="blue"
              icon={Package}
            />
            <SummaryItem
              label={(t.cabinet as any)?.inTransit || "В дорозі"}
              value={summary?.inTransit ?? 0}
              total={summary?.total ?? 0}
              color="orange"
              icon={Package2}
            />
            <SummaryItem
              label={(t.cabinet as any)?.readyForPickup || "Готово до видачі"}
              value={summary?.readyForPickup ?? 0}
              total={summary?.total ?? 0}
              color="green"
              icon={CheckCircle}
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
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.trackNumber || "Трек номер"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.direction || "Напрям"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.type || "Тип"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.status || "Статус"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.location || "Місцезнаходження"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.places || "Місць"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.volumeM3 || "M³"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.density || "Щільність"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.cost || "Вартість"}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 lg:px-4">
                      {t.cabinet?.estimatedArrivalDate || "Орієнтована дата прибуття"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => {
                    const latestStatus = s.statusHistory[0];
                    const statusColor = getStatusColorClass(s.status);
                    
                    // Calculate values from items
                    const pieces = s.items?.length || 0;
                    const totalWeight = s.items?.reduce((sum, item) => {
                      const weight = typeof item.weightKg === 'string' ? parseFloat(item.weightKg) : (item.weightKg ? Number(item.weightKg) : 0);
                      return sum + (isNaN(weight) ? 0 : weight);
                    }, 0) || 0;
                    const totalVolume = s.items?.reduce((sum, item) => {
                      const volume = typeof item.volumeM3 === 'string' ? parseFloat(item.volumeM3) : (item.volumeM3 ? Number(item.volumeM3) : 0);
                      return sum + (isNaN(volume) ? 0 : volume);
                    }, 0) || 0;
                    const totalCost = s.totalCost ? (typeof s.totalCost === 'string' ? parseFloat(s.totalCost) : Number(s.totalCost)) : null;
                    const density = totalWeight > 0 && totalVolume > 0 ? (totalWeight / totalVolume).toFixed(2) : "-";
                    
                    // Format route
                    const route = s.routeFrom && s.routeTo ? `${s.routeFrom} → ${s.routeTo}` : 
                                 s.routeFrom || s.routeTo || "-";
                    
                    // Format delivery type
                    const deliveryTypeLabel = s.deliveryType === "AIR" ? "Авіа" :
                                             s.deliveryType === "SEA" ? "Море" :
                                             s.deliveryType === "RAIL" ? "Залізниця" :
                                             s.deliveryType === "MULTIMODAL" ? "Мультимодал" :
                                             s.deliveryType || "-";
                    
                    return (
                      <tr
                        key={s.id}
                        id={`shipment-${s.id}`}
                        onClick={() => setSelectedShipment(s)}
                        className="cursor-pointer bg-white transition-all duration-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:shadow-md"
                      >
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-sm font-black text-slate-900 lg:text-base">
                            {formatTrackNumber(s.internalTrack)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-xs font-medium text-slate-700 lg:text-sm">
                            {route}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-xs font-semibold text-slate-700 lg:text-sm">
                            {deliveryTypeLabel}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${statusColor} px-2 py-1 text-[10px] font-bold text-white shadow-md lg:px-3 lg:py-1.5 lg:text-xs`}>
                            {getShipmentStatusTranslation(s.status, locale)}
                          </span>
                        </td>
                        <td className="px-3 py-4 lg:px-4">
                          {(() => {
                            const location = s.location || latestStatus?.location;
                            if (!location) return <span className="text-xs text-slate-400 lg:text-sm">-</span>;
                            
                            // Визначаємо іконку на основі місцезнаходження та статусу
                            let LocationIcon = MapPin;
                            if (location.includes("Китай") || location.includes("China")) {
                              LocationIcon = Warehouse;
                            } else if (location.includes("Україна") || location.includes("Ukraine") || location.includes("Украина")) {
                              LocationIcon = Warehouse;
                            } else if (location.includes("Дорога") || location.includes("дорозі") || location.includes("Дорога")) {
                              LocationIcon = Plane; // Або Truck
                            } else if (s.status === "DELIVERED") {
                              LocationIcon = CheckCircle;
                            }
                            
                            return (
                              <div className="flex items-center gap-1.5">
                                <LocationIcon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-900 lg:text-sm">
                                  {location}
                          </span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-xs font-semibold text-slate-700 lg:text-sm">{pieces}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-xs text-slate-700 lg:text-sm">
                            {totalVolume > 0 ? totalVolume.toFixed(4) : "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-xs text-slate-700 lg:text-sm">
                            {density}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-sm font-black text-slate-900 lg:text-base">
                            {totalCost ? `${totalCost.toFixed(2)} $` : "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                          <span className="text-xs font-medium text-slate-700 lg:text-sm">
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
          <div className="relative max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {(t.cabinet as any)?.shipmentModal?.title || "Вантаж"} {formatTrackNumber(selectedShipment.internalTrack)}
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
                  { status: "RECEIVED_CN", label: (t.cabinet as any)?.timelineStatuses?.RECEIVED_CN || "Отримано на складі (Китай)" },
                  { status: "CONSOLIDATION", label: (t.cabinet as any)?.timelineStatuses?.CONSOLIDATION || "Готується до відправлення" },
                  { status: "IN_TRANSIT", label: (t.cabinet as any)?.timelineStatuses?.IN_TRANSIT || "В дорозі" },
                  { status: "ARRIVED_UA", label: (t.cabinet as any)?.timelineStatuses?.ARRIVED_UA || "Доставлено на склад (Україна)" },
                  { status: "ON_UA_WAREHOUSE", label: (t.cabinet as any)?.timelineStatuses?.ON_UA_WAREHOUSE || "Готово до видачі" },
                  { status: "DELIVERED", label: (t.cabinet as any)?.timelineStatuses?.DELIVERED || "Завершено" },
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
                        <div className="text-center px-1">
                          <span className={`block text-xs sm:text-sm font-bold leading-tight ${
                          isCompleted || isActive ? "text-slate-900" : "text-slate-500"
                        }`}>
                          {item.label}
                        </span>
                        {(() => {
                          const statusHistoryItem = selectedShipment.statusHistory.find(
                            (h) => h.status === item.status
                          );
                          if (statusHistoryItem) {
                            return (
                                <>
                                  {statusHistoryItem.location && (() => {
                                    const location = statusHistoryItem.location;
                                    // Визначаємо іконку на основі місцезнаходження та статусу
                                    let LocationIcon = MapPin;
                                    if (location.includes("Китай") || location.includes("China")) {
                                      LocationIcon = Warehouse;
                                    } else if (location.includes("Україна") || location.includes("Ukraine") || location.includes("Украина")) {
                                      LocationIcon = Warehouse;
                                    } else if (location.includes("Дорога") || location.includes("дорозі") || location.includes("Дорога")) {
                                      LocationIcon = Plane;
                                    } else if (item.status === "DELIVERED") {
                                      LocationIcon = CheckCircle;
                                    }
                                    
                                    return (
                                      <div className="mt-1 flex items-center justify-center gap-1">
                                        <LocationIcon className="h-3 w-3 text-slate-400" />
                                        <span className="text-[10px] font-medium text-slate-600">
                                          {location}
                                        </span>
                                      </div>
                                    );
                                  })()}
                                  <span className="block text-[10px] text-slate-500 mt-1">
                                {formatDate(statusHistoryItem.createdAt)}
                              </span>
                                </>
                            );
                          }
                          // For DELIVERED status, only show date if status is actually DELIVERED and we have a real date
                          if (item.status === "DELIVERED") {
                            // Only show date if current status is DELIVERED (not just showing the timeline item)
                            if (selectedShipment.status === "DELIVERED" && selectedShipment.deliveredAt) {
                            return (
                                  <span className="block text-[10px] text-slate-500 mt-1">
                                  {formatDate(selectedShipment.deliveredAt)}
                              </span>
                            );
                          }
                            // Don't show anything if status is not actually DELIVERED
                          return null;
                          }
                            // For CREATED status, show receivedAtWarehouse if available
                            if (item.status === "CREATED" && selectedShipment.receivedAtWarehouse) {
                              return (
                                <>
                                  {selectedShipment.location && (() => {
                                    const location = selectedShipment.location;
                                    // Визначаємо іконку на основі місцезнаходження та статусу
                                    let LocationIcon = MapPin;
                                    if (location.includes("Китай") || location.includes("China")) {
                                      LocationIcon = Warehouse;
                                    } else if (location.includes("Україна") || location.includes("Ukraine") || location.includes("Украина")) {
                                      LocationIcon = Warehouse;
                                    } else if (location.includes("Дорога") || location.includes("дорозі") || location.includes("Дорога")) {
                                      LocationIcon = Plane;
                                    } else if (selectedShipment.status === "DELIVERED") {
                                      LocationIcon = CheckCircle;
                                    }
                                    
                                    return (
                                      <div className="mt-1 flex items-center justify-center gap-1">
                                        <LocationIcon className="h-3 w-3 text-slate-400" />
                                        <span className="text-[10px] font-medium text-slate-600">
                                          {location}
                                        </span>
                                      </div>
                                    );
                        })()}
                                  <span className="block text-[10px] text-slate-500 mt-1">
                                    {formatDate(selectedShipment.receivedAtWarehouse)}
                                  </span>
                                </>
                              );
                            }
                            // For ON_UA_WAREHOUSE, show location if available
                            if (item.status === "ON_UA_WAREHOUSE" && selectedShipment.location) {
                              return (
                                <div className="mt-1 flex items-center justify-center gap-1">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  <span className="text-[10px] font-medium text-slate-600">
                                    {selectedShipment.location}
                                  </span>
                                </div>
                            );
                          }
                          return null;
                        })()}
                        </div>
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
              {/* Cost Block - Prominent */}
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {/* Delivery Cost & Additional Services */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                    {t.cabinet?.costTitle || "Вартість"}
                  </h4>
                  <div className="space-y-2">
                    {/* Delivery Cost */}
                    {(() => {
                      let deliveryTotal = 0;
                      selectedShipment.items?.forEach((item) => {
                        if (item.deliveryCost) {
                          deliveryTotal += parseFloat(item.deliveryCost.toString()) || 0;
                        }
                      });
                      return deliveryTotal > 0 ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{(t.cabinet as any)?.deliveryCostLabel || "Вартість доставки:"}</span>
                          <span className="font-semibold text-slate-900">
                            {deliveryTotal.toFixed(2)} $
                          </span>
                </div>
                      ) : null;
                    })()}
                    
                    {/* Additional Services */}
                    {(() => {
                      // Calculate total insurance cost from all items
                      let totalInsuranceCost = 0;
                      selectedShipment.items?.forEach((item) => {
                        if (item.insuranceValue && item.insurancePercent) {
                          const insuranceValue = typeof item.insuranceValue === 'string' ? parseFloat(item.insuranceValue) : (item.insuranceValue ? Number(item.insuranceValue) : 0);
                          const insurancePercent = typeof item.insurancePercent === 'string' ? parseFloat(item.insurancePercent) : (item.insurancePercent ? Number(item.insurancePercent) : 0);
                          totalInsuranceCost += (insuranceValue * insurancePercent) / 100;
                        }
                      });
                      
                      const hasInsurance = totalInsuranceCost > 0;
                      const hasAdditionalServices = hasInsurance || selectedShipment.packingCost || selectedShipment.localDeliveryCost;
                      
                      return hasAdditionalServices ? (
                        <>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              {t.cabinet?.additionalServices || "Додаткові послуги:"}
                  </p>
                            {hasInsurance && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">{(t.cabinet as any)?.insurance || "Страхування:"}</span>
                                <span className="font-semibold text-slate-900">
                                  {totalInsuranceCost.toFixed(2)} $
                                </span>
                </div>
                            )}
                            {selectedShipment.packingCost && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">{t.cabinet?.packaging || "Пакування:"}</span>
                                <span className="font-semibold text-slate-900">
                                  {parseFloat(selectedShipment.packingCost.toString()).toFixed(2)} $
                                </span>
                </div>
                            )}
                            {selectedShipment.localDeliveryCost && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">{t.cabinet?.localDeliveryToWarehouse || "Локальна доставка до складу:"}</span>
                                <span className="font-semibold text-slate-900">
                                  {parseFloat(selectedShipment.localDeliveryCost.toString()).toFixed(2)} $
                                </span>
                </div>
                            )}
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Total Cost */}
                <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-bold uppercase tracking-wide text-slate-700">{(t.cabinet as any)?.shipmentModal?.totalCost || "Загальна вартість"}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-teal-600">
                      {selectedShipment.totalCost ? `${parseFloat(selectedShipment.totalCost.toString()).toFixed(2)} $` : "-"}
                    </span>
                  </div>
                </div>
                </div>

              {/* Status & Route + Dates - Two columns */}
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {/* СТАТУС ТА МАРШРУТ */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                    <Package className="h-4 w-4" />
                    {t.cabinet?.statusAndRoute || "Статус та маршрут"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{(t.cabinet as any)?.shipmentModal?.status || "Статус:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                        {getShipmentStatusTranslation(selectedShipment.status, locale)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{(t.cabinet as any)?.shipmentModal?.route || "Маршрут:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedShipment.routeFrom || "-"} → {selectedShipment.routeTo || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{t.cabinet?.deliveryTypeLabel || "Тип доставки:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedShipment.deliveryType === "AIR" ? (locale === "ru" ? "Авиа" : locale === "en" ? "Air" : "Авіа") :
                         selectedShipment.deliveryType === "SEA" ? (locale === "ru" ? "Море" : locale === "en" ? "Sea" : "Море") :
                         selectedShipment.deliveryType === "RAIL" ? (locale === "ru" ? "Железная дорога" : locale === "en" ? "Rail" : "Залізниця") :
                         selectedShipment.deliveryType === "MULTIMODAL" ? (locale === "ru" ? "Мультимодал" : locale === "en" ? "Multimodal" : "Мультимодал") :
                         selectedShipment.deliveryType || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{t.cabinet?.locationLabel || "Місцезнаходження:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedShipment.location || selectedShipment.statusHistory[0]?.location || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ДАТИ */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                    <Calendar className="h-4 w-4" />
                    {(t.cabinet as any)?.shipmentModal?.dates || "Дати"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{t.cabinet?.receivedAtWarehouseLabel || (t.cabinet as any)?.shipmentModal?.receivedAtWarehouse || "Отримано на складі:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatDate(selectedShipment.receivedAtWarehouse as Date | null)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{t.cabinet?.sentLabel || (t.cabinet as any)?.shipmentModal?.sent || "Відправлено:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                    {formatDate(selectedShipment.sentAt as Date | null)}
                      </span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{t.cabinet?.deliveredLabel || (t.cabinet as any)?.shipmentModal?.delivered || "Доставлено:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                    {formatDate(selectedShipment.deliveredAt as Date | null)}
                      </span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600">{t.cabinet?.expectedDateLabel || (t.cabinet as any)?.shipmentModal?.expectedDate || "Очікувана дата:"}</span>
                      <span className="text-sm font-bold text-slate-900">
                    {formatDate(selectedShipment.eta as Date | null)}
                      </span>
                </div>
                  </div>
                </div>
                </div>

              {/* Items Table - MOVED HERE */}
              {selectedShipment.items && selectedShipment.items.length > 0 && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                    <Package2 className="h-4 w-4" />
                    {(t.cabinet as any)?.shipmentModal?.itemsTitle || "Місця вантажу"}
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-700">№</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-700">Трек номери</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-700">Локальний трек</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-700">Опис</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700">Кількість</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700" colSpan={3}>Страхування</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700" colSpan={3}>Габарити (СМ)</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700">КГ</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700">м³</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700">Щільність</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700">Тариф</th>
                          <th className="px-3 py-2.5 text-center text-xs font-bold text-slate-700">Вартість</th>
                          <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-700">Тип вантажу</th>
                        </tr>
                        <tr className="bg-slate-50 text-[10px]">
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="px-2 py-1 text-center text-slate-600">Сумма</th>
                          <th className="px-2 py-1 text-center text-slate-600">%</th>
                          <th className="px-2 py-1 text-center text-slate-600">Вартість</th>
                          <th className="px-2 py-1 text-center text-slate-600">Довжина</th>
                          <th className="px-2 py-1 text-center text-slate-600">Ширина</th>
                          <th className="px-2 py-1 text-center text-slate-600">Висота</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedShipment.items.map((item, index) => {
                          const insuranceValue = typeof item.insuranceValue === 'string' ? parseFloat(item.insuranceValue) : (item.insuranceValue ? Number(item.insuranceValue) : 0);
                          const insurancePercent = typeof item.insurancePercent === 'string' ? parseFloat(item.insurancePercent) : (item.insurancePercent ? Number(item.insurancePercent) : 0);
                          const insuranceCost = insuranceValue && insurancePercent ? (insuranceValue * insurancePercent / 100).toFixed(2) : "";
                          
                          return (
                            <tr key={item.id || index} className="hover:bg-slate-50">
                              <td className="px-3 py-2.5 font-bold text-slate-900">{item.placeNumber || (index + 1)}</td>
                              <td className="px-3 py-2.5 text-xs font-mono text-slate-900">{formatTrackNumber(item.trackNumber) || "-"}</td>
                              <td className="px-3 py-2.5 text-xs text-slate-900">{item.localTracking || "-"}</td>
                              <td className="px-3 py-2.5 text-xs text-slate-900">{item.description || "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{item.quantity || 1}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{insuranceValue > 0 ? insuranceValue.toFixed(2) : "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{insurancePercent > 0 ? `${insurancePercent}%` : "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{insuranceCost || "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{item.lengthCm || "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{item.widthCm || "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{item.heightCm || "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">
                                {item.weightKg ? (typeof item.weightKg === 'string' ? item.weightKg : Number(item.weightKg).toFixed(2)) : "-"}
                              </td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">
                                {item.volumeM3 ? (typeof item.volumeM3 === 'string' ? item.volumeM3 : Number(item.volumeM3).toFixed(3)) : "-"}
                              </td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">
                                {item.density ? (typeof item.density === 'string' ? item.density : Number(item.density).toFixed(0)) : "-"}
                              </td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{item.tariffValue && item.tariffType ? `${item.tariffValue} (${item.tariffType})` : "-"}</td>
                              <td className="px-3 py-2.5 text-center text-xs font-bold text-slate-900">{item.deliveryCost || "-"}</td>
                              <td className="px-3 py-2.5 text-xs text-slate-900">{item.cargoType || item.cargoTypeCustom || "-"}</td>
                            </tr>
                          );
                        })}
                        {/* Totals Row */}
                        {(() => {
                          const totalPlaces = selectedShipment.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                          let totalInsuranceSum = 0;
                          let totalInsuranceCost = 0;
                          let totalWeight = 0;
                          let totalVolume = 0;
                          let totalDeliveryCost = 0;
                          let totalDensity = 0;
                          let densityCount = 0;

                          selectedShipment.items.forEach((item) => {
                            const insuranceValue = typeof item.insuranceValue === 'string' ? parseFloat(item.insuranceValue) : (item.insuranceValue ? Number(item.insuranceValue) : 0);
                            const insurancePercent = typeof item.insurancePercent === 'string' ? parseFloat(item.insurancePercent) : (item.insurancePercent ? Number(item.insurancePercent) : 0);
                            const insuranceCost = (insuranceValue * insurancePercent) / 100;
                            const weight = typeof item.weightKg === 'string' ? parseFloat(item.weightKg) : (item.weightKg ? Number(item.weightKg) : 0);
                            const volume = typeof item.volumeM3 === 'string' ? parseFloat(item.volumeM3) : (item.volumeM3 ? Number(item.volumeM3) : 0);
                            const deliveryCost = typeof item.deliveryCost === 'string' ? parseFloat(item.deliveryCost) : (item.deliveryCost ? Number(item.deliveryCost) : 0);
                            const density = typeof item.density === 'string' ? parseFloat(item.density) : (item.density ? Number(item.density) : 0);

                            totalInsuranceSum += insuranceValue;
                            totalInsuranceCost += insuranceCost;
                            totalWeight += weight;
                            totalVolume += volume;
                            totalDeliveryCost += deliveryCost;
                            if (density > 0) {
                              totalDensity += density;
                              densityCount++;
                            }
                          });

                          const avgDensity = densityCount > 0 ? totalDensity / densityCount : 0;

                          return (
                            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                              <td colSpan={4} className="px-3 py-2.5 text-left text-xs text-slate-900">Загалом</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{totalPlaces}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{totalInsuranceSum > 0 ? totalInsuranceSum.toFixed(2) : ""}</td>
                              <td className="px-3 py-2.5"></td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{totalInsuranceCost > 0 ? totalInsuranceCost.toFixed(2) : ""}</td>
                              <td colSpan={3} className="px-3 py-2.5"></td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{totalWeight > 0 ? totalWeight.toFixed(2) : ""}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{totalVolume > 0 ? totalVolume.toFixed(2) : ""}</td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{avgDensity > 0 ? avgDensity.toFixed(0) : ""}</td>
                              <td className="px-3 py-2.5"></td>
                              <td className="px-3 py-2.5 text-center text-xs text-slate-900">{totalDeliveryCost > 0 ? totalDeliveryCost.toFixed(2) : ""}</td>
                              <td></td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  </div>
                )}

              {/* Type & Description - Two columns */}
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                    Тип вантажу
                  </label>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedShipment.cargoType || selectedShipment.cargoTypeCustom || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                    Опис
                  </label>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedShipment.description || "-"}
                  </p>
                </div>
                </div>

              {/* Delivery Format & Reference - Two columns */}
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                    Формат видачі
                  </label>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedShipment.deliveryFormat?.replace(/_/g, " ") || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700">
                      Номер накладної / коментар
                  </label>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedShipment.deliveryReference || "-"}
                  </p>
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
                                        alt={`${(t.cabinet as any)?.shipmentModal?.photoOfShipment || "Фото"} ${item.description || item.trackNumber || idx + 1}`}
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
    readyForPickup: 0,
    total: shipments.length,
  };

  for (const s of shipments) {
    switch (s.status) {
      case "RECEIVED_CN":
      case "CONSOLIDATION":
        summary.received += 1;
        break;
      case "IN_TRANSIT":
      case "ARRIVED_UA":
        summary.inTransit += 1;
        break;
      case "ON_UA_WAREHOUSE":
      case "DELIVERED":
        summary.readyForPickup += 1;
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
  total: number;
  color?: "blue" | "orange" | "green";
  icon?: React.ComponentType<{ className?: string }>;
};

function SummaryItem({ label, value, total, color = "blue", icon: Icon }: SummaryItemProps) {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      border: "border-blue-200/60",
      text: "text-blue-700",
      number: "text-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      progress: "bg-blue-500",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
      border: "border-orange-200/60",
      text: "text-orange-700",
      number: "text-orange-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      progress: "bg-orange-500",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      border: "border-emerald-200/60",
      text: "text-emerald-700",
      number: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      progress: "bg-emerald-500",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`group relative overflow-hidden rounded-xl border-2 ${colors.border} ${colors.bg} px-4 py-5 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-opacity-100`}>
      <div className="relative z-10">
        {/* Icon */}
        {Icon && (
          <div className={`mb-3 flex justify-center`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <Icon className={`h-5 w-5 ${colors.iconColor}`} />
            </div>
          </div>
        )}
        
        {/* Label */}
        <div className={`mb-2 text-[10px] font-bold ${colors.text} uppercase tracking-wider`}>
          {label}
        </div>
        
        {/* Value */}
        <div className={`text-3xl font-black ${colors.number} leading-none`}>
          {value}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${colors.iconBg} opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-70`}></div>
    </div>
  );
}

