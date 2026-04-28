-- AlterTable
ALTER TABLE "lessons"
ADD COLUMN "stream_video_id" TEXT,
ADD COLUMN "video_status" TEXT NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX "lessons_stream_video_id_key" ON "lessons"("stream_video_id");
