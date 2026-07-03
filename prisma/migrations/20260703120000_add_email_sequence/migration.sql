-- CreateEnum
CREATE TYPE "EmailSequenceStatus" AS ENUM ('pending', 'done', 'unsubscribed', 'failed');

-- CreateTable
CREATE TABLE "email_sequence_state" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 0,
    "status" "EmailSequenceStatus" NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_send_at" TIMESTAMP(3) NOT NULL,
    "last_sent_at" TIMESTAMP(3),
    "unsubscribe_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_sequence_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_sequence_state_user_id_key" ON "email_sequence_state"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_sequence_state_unsubscribe_token_key" ON "email_sequence_state"("unsubscribe_token");

-- CreateIndex
CREATE INDEX "email_sequence_state_status_next_send_at_idx" ON "email_sequence_state"("status", "next_send_at");

-- AddForeignKey
ALTER TABLE "email_sequence_state" ADD CONSTRAINT "email_sequence_state_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
