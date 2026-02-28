-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "filename" VARCHAR(512) NOT NULL,
    "originalName" VARCHAR(512) NOT NULL,
    "mimeType" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "path" VARCHAR(1024) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_createdAt_idx" ON "media"("createdAt");
