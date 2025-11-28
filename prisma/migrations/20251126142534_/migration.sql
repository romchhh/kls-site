/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `shipments` table. All the data in the column will be lost.
  - The `status` column on the `shipments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[internalTrack]` on the table `shipments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientCode` to the `shipments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryType` to the `shipments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalTrack` to the `shipments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeFrom` to the `shipments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeTo` to the `shipments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShipmentStatusEnum" AS ENUM ('CREATED', 'RECEIVED_CN', 'CONSOLIDATION', 'IN_TRANSIT', 'ARRIVED_UA', 'ON_UA_WAREHOUSE', 'DELIVERED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('AIR', 'SEA', 'RAIL', 'MULTIMODAL');

-- CreateEnum
CREATE TYPE "DeliveryFormat" AS ENUM ('NOVA_POSHTA', 'SELF_PICKUP', 'CARGO');

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "trackingNumber",
ADD COLUMN     "cargoLabel" TEXT,
ADD COLUMN     "clientCode" TEXT NOT NULL,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryCost" DECIMAL(14,2),
ADD COLUMN     "deliveryCostPerPlace" DECIMAL(14,2),
ADD COLUMN     "deliveryFormat" "DeliveryFormat",
ADD COLUMN     "deliveryReference" TEXT,
ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL,
ADD COLUMN     "density" DECIMAL(10,3),
ADD COLUMN     "eta" TIMESTAMP(3),
ADD COLUMN     "insurancePerPlacePercent" INTEGER,
ADD COLUMN     "insurancePercentTotal" INTEGER,
ADD COLUMN     "insuranceTotal" DECIMAL(14,2),
ADD COLUMN     "internalTrack" TEXT NOT NULL,
ADD COLUMN     "localDeliveryToDepot" BOOLEAN,
ADD COLUMN     "localTrackingDestination" TEXT,
ADD COLUMN     "localTrackingOrigin" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "packing" BOOLEAN,
ADD COLUMN     "pieces" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "receivedAtWarehouse" TIMESTAMP(3),
ADD COLUMN     "routeFrom" TEXT NOT NULL,
ADD COLUMN     "routeTo" TEXT NOT NULL,
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "tariffType" TEXT,
ADD COLUMN     "tariffValue" DECIMAL(10,2),
ADD COLUMN     "totalCost" DECIMAL(14,2),
ADD COLUMN     "volumeM3" DECIMAL(10,4),
ADD COLUMN     "weightKg" DECIMAL(10,3),
DROP COLUMN "status",
ADD COLUMN     "status" "ShipmentStatusEnum" NOT NULL DEFAULT 'CREATED';

-- CreateTable
CREATE TABLE "shipment_items" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "itemCode" TEXT,
    "description" TEXT,
    "quantity" INTEGER,
    "clientTariff" DECIMAL(10,2),
    "insuranceValue" DECIMAL(14,2),
    "weightKg" DECIMAL(10,3),
    "volumeM3" DECIMAL(10,4),
    "density" DECIMAL(10,3),
    "localTracking" TEXT,
    "photoUrl" TEXT,
    "deliveryCost" DECIMAL(14,2),
    "totalCost" DECIMAL(14,2),

    CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_status_history" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShipmentStatusEnum" NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_internalTrack_key" ON "shipments"("internalTrack");

-- AddForeignKey
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_status_history" ADD CONSTRAINT "shipment_status_history_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
