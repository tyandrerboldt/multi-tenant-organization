/*
  Warnings:

  - Added the required column `boardId` to the `KanbanColumn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KanbanColumn" ADD COLUMN     "boardId" TEXT NOT NULL,
ADD COLUMN     "color" TEXT;

-- CreateTable
CREATE TABLE "KanbanBoard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KanbanBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KanbanBoard_organizationId_idx" ON "KanbanBoard"("organizationId");

-- CreateIndex
CREATE INDEX "KanbanColumn_boardId_idx" ON "KanbanColumn"("boardId");

-- AddForeignKey
ALTER TABLE "KanbanBoard" ADD CONSTRAINT "KanbanBoard_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanColumn" ADD CONSTRAINT "KanbanColumn_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "KanbanBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
