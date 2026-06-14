-- AlterTable
ALTER TABLE "users" ADD COLUMN "signup_source" TEXT;

-- CreateTable
CREATE TABLE "external_signup_throttle" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_signup_throttle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_signup_throttle_bucket_key" ON "external_signup_throttle"("bucket");

-- CreateIndex
CREATE INDEX "external_signup_throttle_created_at_idx" ON "external_signup_throttle"("created_at");
