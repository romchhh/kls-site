import {
  Clock,
  Warehouse,
  Truck,
  CheckCircle,
  Archive,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { ShipmentRow } from "../types/userDetail.types";

export const CARGO_TYPES = [
  "Електроніка",
  "Одяг",
  "Взуття",
  "Іграшки",
  "Меблі",
  "Косметика",
  "Аксесуари",
  "Інше",
];

export interface StatusInfo {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  location: string;
}

/**
 * Мапінг типу доставки на літеру в трек номері
 * Авіа -> A, Море -> S, Потяг -> R, Мультимодал -> M
 */
export const getDeliveryTypeCode = (deliveryType: string): string => {
  switch (deliveryType) {
    case "AIR":
      return "A"; // Авіа
    case "SEA":
      return "S"; // Море
    case "RAIL":
      return "R"; // Потяг
    case "MULTIMODAL":
      return "M"; // Мультимодал
    default:
      return "A"; // Default to AIR (Авіа)
  }
};

/**
 * Отримує інформацію про статус (іконка, лейбл, кольори)
 */
export const getStatusInfo = (status: string): StatusInfo => {
  switch (status) {
    case "CREATED":
      return {
        icon: Clock,
        label: "Очікується на складі",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        location: "Китай — склад",
      };
    case "RECEIVED_CN":
      return {
        icon: Warehouse,
        label: "Отримано на складі (Китай)",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        location: "Китай — склад",
      };
    case "CONSOLIDATION":
      return {
        icon: Truck,
        label: "Готується до відправлення",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        location: "Дорога",
      };
    case "IN_TRANSIT":
      return {
        icon: Truck,
        label: "В дорозі",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        location: "Дорога",
      };
    case "ARRIVED_UA":
      return {
        icon: Warehouse,
        label: "Доставлено на склад (Україна)",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        location: "Україна — склад",
      };
    case "ON_UA_WAREHOUSE":
      return {
        icon: Warehouse,
        label: "Готово до видачі",
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        location: "Україна — склад",
      };
    case "DELIVERED":
      return {
        icon: CheckCircle,
        label: "Завершено",
        color: "text-green-600",
        bgColor: "bg-green-50",
        location: "",
      };
    case "ARCHIVED":
      return {
        icon: Archive,
        label: "Архів",
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        location: "",
      };
    default:
      return {
        icon: Package,
        label: status,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        location: "",
      };
  }
};

/**
 * Генерує внутрішній трек номер для вантажу
 * Формат: batchId-clientCode-deliveryType-number
 * Приклад: 00010-2661A0001
 */
export const generateInternalTrack = (
  batchId: string,
  clientCode: string,
  deliveryType: string,
  existingShipmentsInBatch: number
): string => {
  if (!batchId || batchId.trim() === "" || !clientCode) {
    return "";
  }
  
  const deliveryTypeCode = getDeliveryTypeCode(deliveryType);
  const shipmentNumber = String(existingShipmentsInBatch + 1).padStart(4, "0");
  return `${batchId}-${clientCode}${deliveryTypeCode}${shipmentNumber}`;
};

/**
 * Генерує трек номер для місця вантажу
 * Формат: internalTrack-placeNumber
 * Приклад: 00010-2661A0001-1
 */
export const generateItemTrackNumber = (
  batchId: string,
  clientCode: string,
  deliveryType: string,
  placeNumber: number,
  existingShipmentsInBatch: number
): string => {
  if (!batchId || batchId.trim() === "" || !clientCode) {
    return "";
  }
  const internalTrack = generateInternalTrack(
    batchId,
    clientCode,
    deliveryType,
    existingShipmentsInBatch
  );
  if (!internalTrack) return "";
  return `${internalTrack}-${placeNumber}`;
};

/**
 * Генерує номер рахунку з внутрішнього трек номера
 * Формат: 000001-3284Е0001 → INV-3284Е0001
 */
export const generateInvoiceNumber = (internalTrack: string): string => {
  if (!internalTrack || !internalTrack.includes("-")) {
    return "";
  }
  const parts = internalTrack.split("-");
  if (parts.length < 2) {
    return "";
  }
  const afterDash = parts.slice(1).join("-");
  return `INV-${afterDash}`;
};

/**
 * Форматує дату для input[type="date"]
 */
export const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Обчислює running balance для транзакцій
 */
export const getTransactionsWithBalance = <T extends { type: string; amount: string }>(
  source: T[]
): (T & { runningBalance: number })[] => {
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
};

