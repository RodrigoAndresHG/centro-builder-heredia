-- CreateEnum
CREATE TYPE "AccessSource" AS ENUM ('STRIPE', 'MANUAL', 'TEST');

-- AlterTable
ALTER TABLE "accesses"
ADD COLUMN "source" "AccessSource" NOT NULL DEFAULT 'STRIPE';

-- Existing rows predate explicit access origin and are treated as confirmed
-- commercial access unless corrected manually from admin.
ALTER TABLE "accesses" ALTER COLUMN "source" SET DEFAULT 'MANUAL';
