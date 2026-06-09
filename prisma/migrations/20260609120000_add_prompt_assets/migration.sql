-- CreateEnum
CREATE TYPE "PromptPlatform" AS ENUM ('CLAUDE', 'CHATGPT', 'GEMINI', 'MULTI');

-- CreateTable
CREATE TABLE "prompt_assets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "platform" "PromptPlatform" NOT NULL DEFAULT 'MULTI',
    "category" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_assets_is_published_platform_idx" ON "prompt_assets"("is_published", "platform");

-- CreateIndex
CREATE INDEX "prompt_assets_category_idx" ON "prompt_assets"("category");
