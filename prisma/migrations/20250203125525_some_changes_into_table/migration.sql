-- DropIndex
DROP INDEX "Event_dateId_idx";

-- CreateIndex
CREATE INDEX "Event_dateId_userId_idx" ON "Event"("dateId", "userId");
