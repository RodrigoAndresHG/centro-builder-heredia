-- AlterTable
ALTER TABLE "users" ADD COLUMN "utm_source" TEXT;
ALTER TABLE "users" ADD COLUMN "utm_medium" TEXT;
ALTER TABLE "users" ADD COLUMN "utm_campaign" TEXT;
ALTER TABLE "users" ADD COLUMN "signup_intent" TEXT;

-- CreateTable
CREATE TABLE "link_click_events" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "src" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_click_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "link_click_events_target_src_idx" ON "link_click_events"("target", "src");
