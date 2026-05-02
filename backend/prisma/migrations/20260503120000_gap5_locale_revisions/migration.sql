-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN "locale" VARCHAR(32) NOT NULL DEFAULT 'default';

ALTER TABLE "ContentItem" ADD COLUMN "translationGroupId" UUID;

UPDATE "ContentItem" SET "translationGroupId" = id::uuid WHERE "translationGroupId" IS NULL;

ALTER TABLE "ContentItem" ALTER COLUMN "translationGroupId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_collection_translationGroupId_locale_key" ON "ContentItem"("collection", "translationGroupId", "locale");

CREATE INDEX "ContentItem_collection_locale_idx" ON "ContentItem"("collection", "locale");

-- CreateTable
CREATE TABLE "content_item_revisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itemId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "collection" VARCHAR(255) NOT NULL,
    "locale" VARCHAR(32) NOT NULL,
    "translationGroupId" UUID NOT NULL,
    "data" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "publishedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID,

    CONSTRAINT "content_item_revisions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "content_item_revisions_itemId_version_key" ON "content_item_revisions"("itemId", "version");

CREATE INDEX "content_item_revisions_itemId_idx" ON "content_item_revisions"("itemId");

ALTER TABLE "content_item_revisions" ADD CONSTRAINT "content_item_revisions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
