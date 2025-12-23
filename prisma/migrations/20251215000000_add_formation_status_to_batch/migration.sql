-- AlterTable: Change status type from BatchStatus to ShipmentStatusEnum
-- First, we need to add the new formationStatus column
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "formationStatus" "BatchStatus" NOT NULL DEFAULT 'FORMING';

-- Update existing batches to have FORMING status
UPDATE "batches" SET "formationStatus" = 'FORMING' WHERE "formationStatus" IS NULL;

-- Note: The status field type change from BatchStatus to ShipmentStatusEnum 
-- should be handled separately if needed, as it requires dropping and recreating the column
-- For now, we assume status is already ShipmentStatusEnum type

