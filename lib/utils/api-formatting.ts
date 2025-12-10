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
 * Format packingCost - returns the cost if it exists (not null and not 0)
 * Boolean field is ignored - we only check if cost value exists
 */
export function formatPackingCost(packing: boolean | null, packingCost: any): string | null {
  // Ignore boolean field, just format the cost if it exists
  return formatDecimal(packingCost);
}

/**
 * Format localDeliveryCost - returns the cost if it exists (not null and not 0)
 * Boolean field is ignored - we only check if cost value exists
 */
export function formatLocalDeliveryCost(
  localDeliveryToDepot: boolean | null,
  localDeliveryCost: any
): string | null {
  // Ignore boolean field, just format the cost if it exists
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

