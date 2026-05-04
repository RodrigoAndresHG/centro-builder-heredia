-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'PRESALE', 'OPEN');

-- AlterTable
ALTER TABLE "programs"
ADD COLUMN "status" "ProgramStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN "opens_at" TIMESTAMP(3),
ADD COLUMN "presale_message" TEXT;

-- Preserve the previous published/unpublished behavior as an initial status.
UPDATE "programs"
SET "status" = CASE
  WHEN "is_published" = true THEN 'OPEN'::"ProgramStatus"
  ELSE 'DRAFT'::"ProgramStatus"
END;

-- New programs should start as draft unless the admin chooses otherwise.
ALTER TABLE "programs" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
