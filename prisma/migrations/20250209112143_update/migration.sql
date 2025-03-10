/*
  Warnings:

  - You are about to drop the column `userId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `dates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_dateId_fkey";

-- DropIndex
DROP INDEX "Event_dateId_userId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userId";

-- DropTable
DROP TABLE "dates";

-- CreateTable
CREATE TABLE "DateRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DateRecord_date_key" ON "DateRecord"("date");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "DateRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
