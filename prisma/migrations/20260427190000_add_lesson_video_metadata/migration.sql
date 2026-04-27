-- AlterTable
ALTER TABLE "lessons"
ADD COLUMN "video_provider" TEXT,
ADD COLUMN "video_title" TEXT,
ADD COLUMN "video_thumbnail_url" TEXT,
ADD COLUMN "video_duration" INTEGER,
ADD COLUMN "is_preview" BOOLEAN NOT NULL DEFAULT false;
