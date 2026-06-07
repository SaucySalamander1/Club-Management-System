/*
  Warnings:

  - The values [MATCH,COMMUNITY_OUTREACH] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdById` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('MATCHDAY', 'JERSEY_LAUNCH', 'FAN_MEETUP', 'YOUTH_TRIAL', 'CLUB_ANNOUNCEMENT', 'TROPHY_CELEBRATION');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdById_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdById",
DROP COLUMN "eventDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stock" SET DEFAULT 0;
