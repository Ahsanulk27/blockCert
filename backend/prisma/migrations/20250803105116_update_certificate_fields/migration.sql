/*
  Warnings:

  - You are about to drop the column `instititutionName` on the `Certificate` table. All the data in the column will be lost.
  - Added the required column `institutionName` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "instititutionName",
ADD COLUMN     "institutionName" TEXT NOT NULL;
