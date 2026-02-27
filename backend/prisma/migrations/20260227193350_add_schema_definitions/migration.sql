-- CreateTable
CREATE TABLE "content_type_definitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255),

    CONSTRAINT "content_type_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_type_fields" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentTypeDefId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" JSONB,
    "options" JSONB,
    "readonly" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "content_type_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_type_definitions_name_key" ON "content_type_definitions"("name");

-- CreateIndex
CREATE INDEX "content_type_fields_contentTypeDefId_idx" ON "content_type_fields"("contentTypeDefId");

-- CreateIndex
CREATE UNIQUE INDEX "content_type_fields_contentTypeDefId_name_key" ON "content_type_fields"("contentTypeDefId", "name");

-- AddForeignKey
ALTER TABLE "content_type_fields" ADD CONSTRAINT "content_type_fields_contentTypeDefId_fkey" FOREIGN KEY ("contentTypeDefId") REFERENCES "content_type_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
