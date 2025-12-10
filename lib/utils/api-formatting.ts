/**
 * Utility functions for formatting API responses
 * Ensures consistent data format for Telegram bot and other API consumers
 */

/**
 * Format a number (Decimal, number, or string) to a string with 2 decimal places
 * Returns null if value is null, undefined, or 0
 * Handles Prisma Decimal types correctly
 */
export function formatDecimal(value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  // Handle Prisma Decimal type (has toString() method)
  let num: number;
  if (typeof value === "object" && value !== null && "toString" in value) {
    num = parseFloat(value.toString());
  } else if (typeof value === "string") {
    num = parseFloat(value);
  } else {
    num = Number(value);
  }
  
  if (isNaN(num) || num === 0) {
    return null;
  }
  
  return num.toFixed(2);
}

/**
 * Format a number (Decimal, number, or string) to a string with 2 decimal places
 * Returns "0.00" if value is null, undefined, or 0
 */
export function formatDecimalWithZero(value: any): string {
  if (value === null || value === undefined) {
    return "0.00";
  }
  
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  
  if (isNaN(num)) {
    return "0.00";
  }
  
  return num.toFixed(2);
}

/**
 * Ensure packingCost is null or "0.00" if packing is false
 * Returns formatted cost if packing is true and cost exists
 */
export function formatPackingCost(packing: boolean | null, packingCost: any): string | null {
  // If packing is false or null, packingCost must be null
  if (!packing) {
    return null;
  }
  
  // If packing is true, format the cost
  return formatDecimal(packingCost);
}

/**
 * Ensure localDeliveryCost is null or "0.00" if localDeliveryToDepot is false
 * Returns formatted cost if localDeliveryToDepot is true and cost exists
 */
export function formatLocalDeliveryCost(
  localDeliveryToDepot: boolean | null,
  localDeliveryCost: any
): string | null {
  // If localDeliveryToDepot is false or null, localDeliveryCost must be null
  if (!localDeliveryToDepot) {
    return null;
  }
  
  // If localDeliveryToDepot is true, format the cost
  return formatDecimal(localDeliveryCost);
}

/**
 * Format shipment item for API response
 * Ensures all numeric values are formatted as strings with 2 decimal places
 */
export function formatShipmentItem(item: any) {
  return {
    id: item.id,
    placeNumber: item.placeNumber,
    trackNumber: item.trackNumber,
    localTracking: item.localTracking,
    description: item.description,
    quantity: item.quantity,
    insuranceValue: formatDecimal(item.insuranceValue),
    insurancePercent: formatDecimal(item.insurancePercent),
    lengthCm: formatDecimal(item.lengthCm),
    widthCm: formatDecimal(item.widthCm),
    heightCm: formatDecimal(item.heightCm),
    weightKg: formatDecimal(item.weightKg),
    volumeM3: formatDecimal(item.volumeM3),
    density: formatDecimal(item.density),
    tariffType: item.tariffType,
    tariffValue: formatDecimal(item.tariffValue),
    deliveryCost: formatDecimal(item.deliveryCost),
    cargoType: item.cargoType,
    cargoTypeCustom: item.cargoTypeCustom,
    note: item.note,
    photoUrl: item.photoUrl,
  };
}

/**
 * Check if an item has all required fields as null
 * Used to filter out items with incomplete data
 */
export function isItemEmpty(item: any): boolean {
  const hasWeight = item.weightKg !== null && item.weightKg !== undefined && parseFloat(item.weightKg) > 0;
  const hasVolume = item.volumeM3 !== null && item.volumeM3 !== undefined && parseFloat(item.volumeM3) > 0;
  const hasCargoType = item.cargoType || item.cargoTypeCustom;
  const hasDeliveryCost = item.deliveryCost !== null && item.deliveryCost !== undefined && parseFloat(item.deliveryCost) > 0;
  
  // Item is considered empty if all critical fields are missing
  return !hasWeight && !hasVolume && !hasCargoType && !hasDeliveryCost;
}

