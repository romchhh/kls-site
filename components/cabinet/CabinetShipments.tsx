"use client";

import { useEffect, useState } from "react";
import { Locale, getTranslations } from "@/lib/translations";
import { Package, X, MapPin, Calendar, DollarSign, Package2, Clock, Image as ImageIcon } from "lucide-react";
import type { ShipmentWithRelations } from "@/types/shipments";
import Image from "next/image";

type CabinetShipmentsProps = {
  locale: Locale;
};

export function CabinetShipments({ locale }: CabinetShipmentsProps) {
  const t = getTranslations(locale);
  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentWithRelations | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/shipments");
        if (!res.ok) return;
        const data = await res.json();
        setShipments(data.shipments ?? []);
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
    d ? new Date(d).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) : "-";

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
        {t.cabinet?.shipments || "Вантаж"}
      </h2>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {!haveShipments && !loading && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-md">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.cabinet?.shipments || "Вантаж"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t.cabinet?.noShipments || "Немає відправлень"}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-sm text-slate-500">
                {t.cabinet?.shipmentsEmptyHint ||
                  "Як тільки у вас з'являться відправлення, тут буде відображено їхній статус і рух."}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                {t.cabinet?.quickContact || "Швидкий зв'язок"}
              </p>
              <p>
                {t.cabinet?.shipmentsSideInfo ||
                  "Напишіть менеджеру, щоб створити перше відправлення або дізнатися про умови доставки."}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-sm text-slate-500">
            {t.cabinet?.loadingShipments || "Завантажуємо відправлення..."}
          </p>
        )}

        {haveShipments && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">
                    {(t.cabinet as any)?.status || "Статус"}
                  </th>
                  <th className="px-3 py-2 text-left">
                    {(t.cabinet as any)?.location || "Місцезнаходження"}
                  </th>
                  <th className="px-3 py-2 text-left">
                    {(t.cabinet as any)?.pieces || "Місць"}
                  </th>
                  <th className="px-3 py-2 text-left">Код</th>
                  <th className="px-3 py-2 text-left">
                    {(t.cabinet as any)?.weight || "Кг"}
                  </th>
                  <th className="px-3 py-2 text-left">m³</th>
                  <th className="px-3 py-2 text-left">
                    {(t.cabinet as any)?.totalCost || "Вартість"}
                  </th>
                  <th className="px-3 py-2 text-left">
                    {(t.cabinet as any)?.eta || "ETA"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => {
                  const latestStatus = s.statusHistory[0];
                  return (
                    <tr
                      key={s.id}
                      className="cursor-pointer rounded-xl bg-slate-50 align-middle text-slate-800 shadow-sm transition-all hover:bg-slate-100 hover:shadow-md"
                      onClick={() => setSelectedShipment(s)}
                    >
                      <td className="px-3 py-3 font-semibold">
                        {s.internalTrack}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
                          {s.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {s.location || latestStatus?.location || "-"}
                      </td>
                      <td className="px-3 py-3">{s.pieces}</td>
                      <td className="px-3 py-3">{s.cargoLabel || "-"}</td>
                      <td className="px-3 py-3">
                        {s.weightKg?.toString() || "-"}
                      </td>
                      <td className="px-3 py-3">
                        {s.volumeM3?.toString() || "-"}
                      </td>
                      <td className="px-3 py-3">
                        {s.totalCost ? `${s.totalCost.toString()} $` : "-"}
                      </td>
                      <td className="px-3 py-3">
                        {formatDate(s.eta as Date | null)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                  Вантаж {selectedShipment.internalTrack}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedShipment.cargoLabel || "Без маркування"}
                </p>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
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
                      Статус та маршрут
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Статус:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Маршрут:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.routeFrom} → {selectedShipment.routeTo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Тип доставки:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.deliveryType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Місцезнаходження:</span>
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
                      Дати
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Отримано на складі:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(selectedShipment.receivedAtWarehouse as Date | null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Відправлено:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(selectedShipment.sentAt as Date | null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Доставлено:</span>
                        <span className="font-semibold text-slate-900">
                          {formatDate(selectedShipment.deliveredAt as Date | null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Очікувана дата:</span>
                        <span className="font-semibold text-teal-600">
                          {formatDate(selectedShipment.eta as Date | null)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weight & Volume */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Вага та об'єм
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Вага:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.weightKg || "-"} кг
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Об'єм:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.volumeM3 || "-"} m³
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Плотність:</span>
                        <span className="font-semibold text-slate-900">
                          {selectedShipment.density || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Місць:</span>
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
                        Страхування
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Сума страхування:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedShipment.insuranceTotal} $
                          </span>
                        </div>
                        {selectedShipment.insurancePercentTotal && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">% загальний:</span>
                            <span className="font-semibold text-slate-900">
                              {selectedShipment.insurancePercentTotal}%
                            </span>
                          </div>
                        )}
                        {selectedShipment.insurancePerPlacePercent && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">% за місце:</span>
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
                      Вартість
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedShipment.deliveryCost && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Доставка:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedShipment.deliveryCost} $
                          </span>
                        </div>
                      )}
                      {selectedShipment.deliveryCostPerPlace && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">За місце:</span>
                          <span className="font-semibold text-slate-900">
                            {selectedShipment.deliveryCostPerPlace} $
                          </span>
                        </div>
                      )}
                      {selectedShipment.totalCost && (
                        <div className="mt-3 flex justify-between border-t border-slate-200 pt-2">
                          <span className="text-base font-semibold text-slate-900">
                            Загальна вартість:
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
                      Формат видачі
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Формат:</span>
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
                          <span>Пакування:</span>
                          <span className="font-medium">
                            {selectedShipment.packing ? "Так" : "Ні"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Локальна доставка до складу:</span>
                          <span className="font-medium">
                            {selectedShipment.localDeliveryToDepot ? "Так" : "Ні"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photos */}
                  {(selectedShipment.mainPhotoUrl || selectedShipment.items.some(item => item.photoUrl)) && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        <ImageIcon className="h-4 w-4" />
                        Фото
                      </h4>
                      <div className="space-y-3">
                        {selectedShipment.mainPhotoUrl && (
                          <div>
                            <p className="mb-2 text-xs text-slate-600">Головне фото:</p>
                            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100">
                              <Image
                                src={selectedShipment.mainPhotoUrl}
                                alt="Головне фото вантажу"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                        {selectedShipment.items
                          .filter(item => item.photoUrl)
                          .map((item, idx) => (
                            <div key={item.id}>
                              <p className="mb-2 text-xs text-slate-600">
                                Фото позиції: {item.description || item.itemCode || `#${idx + 1}`}
                              </p>
                              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100">
                                <Image
                                  src={item.photoUrl!}
                                  alt={`Фото ${item.description || item.itemCode || idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Tracking */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                      <MapPin className="h-4 w-4" />
                      Трекінг
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedShipment.localTrackingOrigin && (
                        <div>
                          <span className="text-slate-600">Трек (країна відправлення):</span>
                          <p className="mt-1 font-mono text-xs font-semibold text-slate-900">
                            {selectedShipment.localTrackingOrigin}
                          </p>
                        </div>
                      )}
                      {selectedShipment.localTrackingDestination && (
                        <div>
                          <span className="text-slate-600">Трек (країна отримання):</span>
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
                    Позиції у партії ({selectedShipment.items.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedShipment.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <p className="text-xs text-slate-500">Опис / Код</p>
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
                              <p className="text-slate-500">Кількість:</p>
                              <p className="font-semibold">{item.quantity ?? "-"}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Вага:</p>
                              <p className="font-semibold">{item.weightKg?.toString() || "-"} кг</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Об'єм:</p>
                              <p className="font-semibold">{item.volumeM3?.toString() || "-"} m³</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Вартість:</p>
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
                                alt={`Фото ${item.description || item.itemCode}`}
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
                    Таймлайн статусів
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
                              {h.status.replace(/_/g, " ")}
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
                    Опис
                  </h4>
                  <p className="text-sm text-slate-600">{selectedShipment.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
