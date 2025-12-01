-- Add new columns to shipments table
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "batchId" TEXT;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "cargoType" TEXT;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "cargoTypeCustom" TEXT;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "packingCost" DECIMAL(14,2);
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "localDeliveryCost" DECIMAL(14,2);

-- Add new columns to shipment_items table
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "trackNumber" TEXT;
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "placeNumber" INTEGER;
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "insurancePercent" INTEGER;
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "insuranceCost" DECIMAL(14,2);
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "lengthCm" DECIMAL(10,2);
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "widthCm" DECIMAL(10,2);
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "heightCm" DECIMAL(10,2);
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "tariffType" TEXT;
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "tariffValue" DECIMAL(10,2);
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "cargoType" TEXT;
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "cargoTypeCustom" TEXT;
ALTER TABLE "shipment_items" ADD COLUMN IF NOT EXISTS "note" TEXT;

-- Note: Old columns (deliveryCost, deliveryCostPerPlace, density, tariffType, tariffValue, volumeM3, weightKg on shipments)
-- are kept for backward compatibility and can be removed in a future migration after data migration

