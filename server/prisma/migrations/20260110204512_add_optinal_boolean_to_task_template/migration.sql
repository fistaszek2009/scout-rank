/*
  Warnings:

  - Added the required column `optional` to the `TaskTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "optional" BOOLEAN NOT NULL;
