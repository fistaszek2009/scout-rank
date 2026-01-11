/*
  Warnings:

  - Added the required column `timestamp` to the `PatrolTaskScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `UserTaskScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatrolTaskScore" ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserTaskScore" ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;
