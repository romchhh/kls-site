/*
  Warnings:

  - The `status` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PAID', 'ARCHIVED');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "shipmentId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID';

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
