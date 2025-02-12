-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "capturerId" TEXT;

-- CreateIndex
CREATE INDEX "Property_capturerId_idx" ON "Property"("capturerId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_capturerId_fkey" FOREIGN KEY ("capturerId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
