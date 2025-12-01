"use client";

import { Clock } from "lucide-react";
import { ShipmentStatusHistory } from "@/types/shipments";

interface ShipmentTimelineProps {
  statusHistory: ShipmentStatusHistory[];
  locale?: "ua" | "ru" | "en";
}

const statusLabels: Record<string, Record<"ua" | "ru" | "en", string>> = {
  CREATED: { ua: "Створено", ru: "Создано", en: "Created" },
  RECEIVED_CN: { ua: "Отримано в Китаї", ru: "Получено в Китае", en: "Received in China" },
  IN_TRANSIT: { ua: "У дорозі", ru: "В пути", en: "In Transit" },
  ARRIVED_UA: { ua: "Прибуло в Україну", ru: "Прибыло в Украину", en: "Arrived in Ukraine" },
  ON_UA_WAREHOUSE: { ua: "На складі", ru: "На складе", en: "At Warehouse" },
  DELIVERED: { ua: "Доставлено", ru: "Доставлено", en: "Delivered" },
};

const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function ShipmentTimeline({ statusHistory, locale = "ua" }: ShipmentTimelineProps) {
  if (!statusHistory || statusHistory.length === 0) {
    return null;
  }

  // Sort by date (newest first)
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
        <Clock className="h-4 w-4" />
        Таймлайн статусів
      </h4>
      <div className="relative space-y-4 pl-6">
        {sortedHistory.map((h, idx) => {
          const statusLabel = statusLabels[h.status]?.[locale] || h.status;
          return (
            <div key={h.id} className="relative">
              {idx < sortedHistory.length - 1 && (
                <div className="absolute left-2 top-6 h-full w-0.5 bg-slate-300" />
              )}
              <div className="flex items-start gap-3">
                <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-600 ring-4 ring-slate-50">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{statusLabel}</p>
                    <span className="text-xs text-slate-500">
                      {formatDate(h.createdAt)}
                    </span>
                  </div>
                  {h.location && (
                    <p className="mt-1 text-xs text-slate-600">📍 {h.location}</p>
                  )}
                  {h.description && (
                    <p className="mt-1 text-xs text-slate-500">{h.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

