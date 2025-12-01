-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batches_batchId_key" ON "batches"("batchId");

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

