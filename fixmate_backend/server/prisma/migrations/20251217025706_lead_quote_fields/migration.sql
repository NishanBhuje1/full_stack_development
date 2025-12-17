-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "finalQuote" INTEGER,
ADD COLUMN     "quoteNotes" TEXT,
ADD COLUMN     "quotedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW';
