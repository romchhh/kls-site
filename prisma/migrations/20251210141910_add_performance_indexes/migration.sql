/*
  Warnings:

  - You are about to drop the column `clientTariff` on the `shipment_items` table. All the data in the column will be lost.
  - You are about to drop the column `itemCode` on the `shipment_items` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `shipment_items` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryCost` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryCostPerPlace` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `density` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `insurancePerPlacePercent` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `insurancePercentTotal` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceTotal` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `tariffType` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `tariffValue` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `volumeM3` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `weightKg` on the `shipments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "batches" ALTER COLUMN "deliveryType" DROP DEFAULT;

-- AlterTable
ALTER TABLE "shipment_items" DROP COLUMN "clientTariff",
DROP COLUMN "itemCode",
DROP COLUMN "totalCost";

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "deliveryCost",
DROP COLUMN "deliveryCostPerPlace",
DROP COLUMN "density",
DROP COLUMN "insurancePerPlacePercent",
DROP COLUMN "insurancePercentTotal",
DROP COLUMN "insuranceTotal",
DROP COLUMN "tariffType",
DROP COLUMN "tariffValue",
DROP COLUMN "volumeM3",
DROP COLUMN "weightKg";

-- CreateIndex
CREATE INDEX "admin_actions_adminId_idx" ON "admin_actions"("adminId");

-- CreateIndex
CREATE INDEX "admin_actions_createdAt_idx" ON "admin_actions"("createdAt");

-- CreateIndex
CREATE INDEX "invoices_userId_idx" ON "invoices"("userId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_shipmentId_idx" ON "invoices"("shipmentId");

-- CreateIndex
CREATE INDEX "invoices_createdAt_idx" ON "invoices"("createdAt");

-- CreateIndex
CREATE INDEX "shipment_items_shipmentId_idx" ON "shipment_items"("shipmentId");

-- CreateIndex
CREATE INDEX "shipment_items_trackNumber_idx" ON "shipment_items"("trackNumber");

-- CreateIndex
CREATE INDEX "shipment_status_history_shipmentId_idx" ON "shipment_status_history"("shipmentId");

-- CreateIndex
CREATE INDEX "shipment_status_history_createdAt_idx" ON "shipment_status_history"("createdAt");

-- CreateIndex
CREATE INDEX "shipments_userId_idx" ON "shipments"("userId");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "shipments_batchId_idx" ON "shipments"("batchId");

-- CreateIndex
CREATE INDEX "shipments_clientCode_idx" ON "shipments"("clientCode");

-- CreateIndex
CREATE INDEX "shipments_createdAt_idx" ON "shipments"("createdAt");

-- CreateIndex
CREATE INDEX "shipments_internalTrack_idx" ON "shipments"("internalTrack");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");
