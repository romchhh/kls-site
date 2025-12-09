/**
 * Утиліти для автоматизації статусів, місцезнаходження та дат вантажів
 */

export type DeliveryType = "AIR" | "SEA" | "RAIL" | "MULTIMODAL";
export type ShipmentStatus = 
  | "CREATED" 
  | "RECEIVED_CN" 
  | "CONSOLIDATION" 
  | "IN_TRANSIT" 
  | "ARRIVED_UA" 
  | "ON_UA_WAREHOUSE" 
  | "DELIVERED" 
  | "ARCHIVED";

/**
 * Отримує кількість днів для розрахунку ETA на основі типу доставки
 */
export function getDeliveryDays(deliveryType: DeliveryType): number {
  switch (deliveryType) {
    case "AIR":
      return 20; // Авіа: +20 днів
    case "SEA":
      return 75; // Море: +75 днів
    case "RAIL":
      return 45; // Залізниця: +45 днів
    case "MULTIMODAL":
      return 35; // Мультимодальна: +35 днів
    default:
      return 20;
  }
}

/**
 * Розраховує ETA (орієнтовну дату прибуття) на основі дати відправлення та типу доставки
 */
export function calculateETA(sentAt: Date, deliveryType: DeliveryType): Date {
  const days = getDeliveryDays(deliveryType);
  const eta = new Date(sentAt);
  eta.setDate(eta.getDate() + days);
  return eta;
}

/**
 * Отримує місцезнаходження на основі статусу та маршруту
 */
export function getLocationForStatus(
  status: ShipmentStatus,
  routeFrom?: string | null,
  routeTo?: string | null
): string {
  switch (status) {
    case "CREATED":
      return "";
    case "RECEIVED_CN":
      // Визначаємо склад на основі маршруту "З"
      if (routeFrom) {
        if (routeFrom.includes("CN") || routeFrom.includes("Китай") || routeFrom.includes("China")) {
          return "Склад Китай";
        }
        if (routeFrom.includes("HK") || routeFrom.includes("Гонконг") || routeFrom.includes("Hong Kong")) {
          return "Склад Гонконг";
        }
      }
      return "Склад Китай"; // За замовчуванням
    case "CONSOLIDATION":
      return routeFrom?.includes("CN") || routeFrom?.includes("Китай") || routeFrom?.includes("China")
        ? "Склад Китай"
        : "Склад Гонконг";
    case "IN_TRANSIT":
      return "В дорозі";
    case "ARRIVED_UA":
    case "ON_UA_WAREHOUSE":
      return "Склад Україна";
    case "DELIVERED":
      return "Доставлено";
    case "ARCHIVED":
      return "Архів";
    default:
      return "";
  }
}

/**
 * Автоматично встановлює статус, місцезнаходження та опис при "прибув на склад"
 */
export function getReceivedAtWarehouseData(
  routeFrom?: string | null
): {
  status: ShipmentStatus;
  location: string;
  description: string;
} {
  return {
    status: "RECEIVED_CN",
    location: getLocationForStatus("RECEIVED_CN", routeFrom),
    description: "Вантаж прибув на склад",
  };
}

/**
 * Автоматично встановлює статус, місцезнаходження, ETA та опис при "відправлено"
 */
export function getSentAtData(
  sentAt: Date,
  deliveryType: DeliveryType,
  routeTo?: string | null
): {
  status: ShipmentStatus;
  location: string;
  eta: Date;
  description: string;
} {
  return {
    status: "IN_TRANSIT",
    location: "В дорозі",
    eta: calculateETA(sentAt, deliveryType),
    description: "Вантаж відправлено",
  };
}

/**
 * Автоматично визначає статус на основі поточної дати та дат вантажу
 */
export function getAutoStatus(
  receivedAtWarehouse: Date | null | undefined,
  sentAt: Date | null | undefined,
  deliveredAt: Date | null | undefined,
  eta: Date | null | undefined,
  deliveryType: DeliveryType,
  currentStatus: ShipmentStatus
): {
  status: ShipmentStatus | null;
  location: string | null;
  description: string | null;
} {
  const now = new Date();

  // Якщо вже доставлено або в архіві - не змінюємо
  if (currentStatus === "DELIVERED" || currentStatus === "ARCHIVED") {
    return { status: null, location: null, description: null };
  }

  // Якщо є дата доставки і вона вже пройшла
  if (deliveredAt && now >= deliveredAt) {
    return {
      status: "DELIVERED",
      location: "Доставлено",
      description: "Вантаж доставлено",
    };
  }

  // Якщо є ETA і вона вже пройшла, але ще не доставлено
  if (eta && now >= eta && sentAt) {
    return {
      status: "ARRIVED_UA",
      location: "Склад Україна",
      description: "Вантаж прибув на склад України",
    };
  }

  // Якщо є дата відправлення - в дорозі
  if (sentAt && now >= sentAt) {
    return {
      status: "IN_TRANSIT",
      location: "В дорозі",
      description: "Вантаж в дорозі",
    };
  }

  // Якщо є дата отримання на складі - отримано
  if (receivedAtWarehouse && now >= receivedAtWarehouse) {
    return {
      status: "RECEIVED_CN",
      location: getLocationForStatus("RECEIVED_CN"),
      description: "Вантаж на складі",
    };
  }

  return { status: null, location: null, description: null };
}

