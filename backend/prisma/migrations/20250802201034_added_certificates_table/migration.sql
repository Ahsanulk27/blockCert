/*
  Warnings:

  - Added the required column `instititutionName` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "instititutionName" TEXT NOT NULL;
