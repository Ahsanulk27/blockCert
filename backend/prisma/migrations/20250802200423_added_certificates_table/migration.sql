/*
  Warnings:

  - You are about to drop the column `issuedAt` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `issuedTo` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Certificate` table. All the data in the column will be lost.
  - Added the required column `course` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateIssued` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "issuedAt",
DROP COLUMN "issuedTo",
DROP COLUMN "title",
ADD COLUMN     "additionalNotes" TEXT,
ADD COLUMN     "blockchainHash" TEXT,
ADD COLUMN     "course" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateIssued" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "grade" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "studentName" TEXT NOT NULL;
