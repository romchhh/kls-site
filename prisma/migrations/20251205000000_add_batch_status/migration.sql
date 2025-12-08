-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('FORMING', 'FORMED');

-- AlterTable
ALTER TABLE "batches" ADD COLUMN "status" "BatchStatus" NOT NULL DEFAULT 'FORMING';

