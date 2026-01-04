/*
  Warnings:

  - You are about to drop the column `bookmark` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `collection` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `filter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `layout_options` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `layout_query` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_interval` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `search` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bookmark",
DROP COLUMN "collection",
DROP COLUMN "color",
DROP COLUMN "filter",
DROP COLUMN "icon",
DROP COLUMN "layout",
DROP COLUMN "layout_options",
DROP COLUMN "layout_query",
DROP COLUMN "refresh_interval",
DROP COLUMN "search";

-- DropTable
DROP TABLE "Content";
