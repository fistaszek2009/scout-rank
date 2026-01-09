/*
  Warnings:

  - You are about to drop the column `leaderId` on the `Patrol` table. All the data in the column will be lost.
  - You are about to drop the column `leaderId` on the `Troop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leaderOfPatrolId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leaderOfTroopId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Patrol" DROP CONSTRAINT "Patrol_leaderId_fkey";

-- DropForeignKey
ALTER TABLE "Troop" DROP CONSTRAINT "Troop_leaderId_fkey";

-- DropIndex
DROP INDEX "Patrol_leaderId_key";

-- DropIndex
DROP INDEX "Troop_leaderId_key";

-- AlterTable
ALTER TABLE "Patrol" DROP COLUMN "leaderId";

-- AlterTable
ALTER TABLE "Troop" DROP COLUMN "leaderId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "leaderOfPatrolId" INTEGER,
ADD COLUMN     "leaderOfTroopId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_leaderOfPatrolId_key" ON "User"("leaderOfPatrolId");

-- CreateIndex
CREATE UNIQUE INDEX "User_leaderOfTroopId_key" ON "User"("leaderOfTroopId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_leaderOfPatrolId_fkey" FOREIGN KEY ("leaderOfPatrolId") REFERENCES "Patrol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_leaderOfTroopId_fkey" FOREIGN KEY ("leaderOfTroopId") REFERENCES "Troop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
