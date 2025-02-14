/*
  Warnings:

  - You are about to drop the column `email` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Lead` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "KanbanColumn" DROP CONSTRAINT "KanbanColumn_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_propertyId_fkey";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "status",
ADD COLUMN     "description" TEXT;

-- DropEnum
DROP TYPE "LeadStatus";
