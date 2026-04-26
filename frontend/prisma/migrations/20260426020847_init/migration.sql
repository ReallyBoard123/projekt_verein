-- CreateTable
CREATE TABLE "Verein" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Verein',
    "isCharitable" BOOLEAN NOT NULL DEFAULT false,
    "subtitle" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "district" TEXT,
    "addressRaw" TEXT,
    "addressLat" REAL,
    "addressLng" REAL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "socialMedia" TEXT,
    "source" TEXT,
    "originalUrl" TEXT,
    "lastSynced" DATETIME,
    "completenessScore" REAL DEFAULT 0,
    "verification" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vereinId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'regular_meeting',
    "schedule" TEXT NOT NULL,
    "dayOfWeek" TEXT,
    "time" TEXT,
    "frequency" TEXT,
    "location" TEXT,
    "description" TEXT,
    "confidence" TEXT DEFAULT 'medium',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Meeting_vereinId_fkey" FOREIGN KEY ("vereinId") REFERENCES "Verein" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vereinId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'special_event',
    "title" TEXT,
    "date" TEXT,
    "dateDisplay" TEXT,
    "endDate" TEXT,
    "time" TEXT,
    "location" TEXT,
    "description" TEXT,
    "rawMatch" TEXT,
    "confidence" TEXT DEFAULT 'medium',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_vereinId_fkey" FOREIGN KEY ("vereinId") REFERENCES "Verein" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Verein_slug_key" ON "Verein"("slug");

-- CreateIndex
CREATE INDEX "Verein_slug_idx" ON "Verein"("slug");

-- CreateIndex
CREATE INDEX "Verein_district_idx" ON "Verein"("district");

-- CreateIndex
CREATE INDEX "Verein_name_idx" ON "Verein"("name");

-- CreateIndex
CREATE INDEX "Meeting_vereinId_idx" ON "Meeting"("vereinId");

-- CreateIndex
CREATE INDEX "Meeting_dayOfWeek_idx" ON "Meeting"("dayOfWeek");

-- CreateIndex
CREATE INDEX "Event_vereinId_idx" ON "Event"("vereinId");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");
