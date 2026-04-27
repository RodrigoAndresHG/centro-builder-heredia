-- CreateEnum
CREATE TYPE "BuilderUpdateType" AS ENUM ('NOVEDAD', 'TIP', 'IA', 'RECOMENDACION');

-- CreateTable
CREATE TABLE "builder_updates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "BuilderUpdateType" NOT NULL DEFAULT 'NOVEDAD',
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "builder_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "builder_updates_is_published_published_at_idx" ON "builder_updates"("is_published", "published_at");

-- CreateIndex
CREATE INDEX "builder_updates_type_idx" ON "builder_updates"("type");
