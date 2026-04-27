-- CreateTable
CREATE TABLE "early_access_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "early_access_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "early_access_leads_email_key" ON "early_access_leads"("email");

-- CreateIndex
CREATE INDEX "early_access_leads_source_idx" ON "early_access_leads"("source");

-- CreateIndex
CREATE INDEX "early_access_leads_status_idx" ON "early_access_leads"("status");
