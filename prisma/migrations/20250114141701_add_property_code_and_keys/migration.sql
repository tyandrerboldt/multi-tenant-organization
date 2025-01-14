/*
  Warnings:

  - A unique constraint covering the columns `[slug,categoryId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,organizationId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - The required column `code` was added to the `Property` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Property_slug_key";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'HOUSE';

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_categoryId_key" ON "Property"("slug", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_code_organizationId_key" ON "Property"("code", "organizationId");
