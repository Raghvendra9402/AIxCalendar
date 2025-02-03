-- CreateTable
CREATE TABLE "dates" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dates_date_key" ON "dates"("date");

-- CreateIndex
CREATE INDEX "Event_dateId_idx" ON "Event"("dateId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
