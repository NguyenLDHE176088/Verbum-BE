/*
  Warnings:

  - You are about to drop the column `fileExtention` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `inconsistenInTargetIgnore` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `inconsistenInTargetQA` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `onwer` on the `Project` table. All the data in the column will be lost.
  - Added the required column `fileExtension` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inconsistentInTargetIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inconsistentInTargetQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LanguageUser" DROP CONSTRAINT "LanguageUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_onwer_fkey";

-- DropForeignKey
ALTER TABLE "UserCompany" DROP CONSTRAINT "UserCompany_userId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "fileExtention",
ADD COLUMN     "documentUrl" TEXT,
ADD COLUMN     "fileExtension" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "inconsistenInTargetIgnore",
DROP COLUMN "inconsistenInTargetQA",
DROP COLUMN "onwer",
ADD COLUMN     "inconsistentInTargetIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "inconsistentInTargetQA" BOOLEAN NOT NULL,
ADD COLUMN     "owner" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageUser" ADD CONSTRAINT "LanguageUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
