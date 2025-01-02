-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "customRoleId" TEXT;

-- CreateIndex
CREATE INDEX "Membership_customRoleId_idx" ON "Membership"("customRoleId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "CustomRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
