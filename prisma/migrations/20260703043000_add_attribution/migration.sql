-- Atribución de marketing.
-- Aditiva y forward-only: columnas nullable en users + tabla nueva de clicks.

-- AlterTable: atribución de la cuenta (de dónde llegó el usuario)
ALTER TABLE "users" ADD COLUMN "source" TEXT;
ALTER TABLE "users" ADD COLUMN "utm_medium" TEXT;
ALTER TABLE "users" ADD COLUMN "utm_campaign" TEXT;
ALTER TABLE "users" ADD COLUMN "utm_content" TEXT;
ALTER TABLE "users" ADD COLUMN "landing_intent" TEXT;

-- CreateIndex
CREATE INDEX "users_source_idx" ON "users"("source");

-- CreateTable: log de clicks entrantes con UTMs
CREATE TABLE "attribution_events" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "intent" TEXT,
    "path" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribution_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attribution_events_source_idx" ON "attribution_events"("source");

-- CreateIndex
CREATE INDEX "attribution_events_created_at_idx" ON "attribution_events"("created_at");
