-- CreateEnum
CREATE TYPE "Segment" AS ENUM ('ELDER', 'IBADUR_RAHMAN', 'ZEENATUL_IGATHAH', 'FATAYAATUL_IGATHAH', 'MEMBER');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('STUDENT', 'MEMBER');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MEMBER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "segment" "Segment";

-- AlterTable
ALTER TABLE "FeeItem" ADD COLUMN     "audience" "Audience" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "segment" "Segment";

-- CreateIndex
CREATE INDEX "User_segment_idx" ON "User"("segment");
