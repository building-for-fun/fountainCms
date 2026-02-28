-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN     "publishedAt" TIMESTAMP(6),
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "ContentItem_collection_status_idx" ON "ContentItem"("collection", "status");
