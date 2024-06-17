/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CRP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectJob` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileExtention` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emptyTargetIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emptyTargetQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraNumberInTargetIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraNumberInTargetQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inconsistenInTargetIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inconsistenInTargetQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadingAndTrailingSpaceIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadingAndTrailingSpaceQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markProjectAssigned` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markProjectCanceled` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `markProjectCompleted` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTargetLengthCharacterIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTargetLengthCharacterQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTargetLengthPercentageIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTargetLengthPercentageQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingNumberIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingNumberQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingSpaceIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missingSpaceQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repeatedWordIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repeatedWordQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spellingIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spellingQA` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetTextIdenticalIgnore` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetTextIdenticalQA` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CRP" DROP CONSTRAINT "CRP_permissionName_fkey";

-- DropForeignKey
ALTER TABLE "CRP" DROP CONSTRAINT "CRP_roleName_fkey";

-- DropForeignKey
ALTER TABLE "ProjectJob" DROP CONSTRAINT "ProjectJob_jobId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectJob" DROP CONSTRAINT "ProjectJob_projectId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
ALTER COLUMN "type" DROP NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "description",
ADD COLUMN     "fileExtention" TEXT NOT NULL,
ADD COLUMN     "projectId" INTEGER,
ADD COLUMN     "targetLanguageId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'new',
ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emptyTargetIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "emptyTargetQA" BOOLEAN NOT NULL,
ADD COLUMN     "extraNumberInTargetIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "extraNumberInTargetQA" BOOLEAN NOT NULL,
ADD COLUMN     "inconsistenInTargetIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "inconsistenInTargetQA" BOOLEAN NOT NULL,
ADD COLUMN     "leadingAndTrailingSpaceIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "leadingAndTrailingSpaceQA" BOOLEAN NOT NULL,
ADD COLUMN     "markProjectAssigned" TEXT NOT NULL,
ADD COLUMN     "markProjectCanceled" BOOLEAN NOT NULL,
ADD COLUMN     "markProjectCompleted" TEXT NOT NULL,
ADD COLUMN     "maxTargetLengthCharacter" INTEGER,
ADD COLUMN     "maxTargetLengthCharacterIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "maxTargetLengthCharacterQA" BOOLEAN NOT NULL,
ADD COLUMN     "maxTargetLengthPercentage" INTEGER,
ADD COLUMN     "maxTargetLengthPercentageIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "maxTargetLengthPercentageQA" BOOLEAN NOT NULL,
ADD COLUMN     "metadata" TEXT NOT NULL,
ADD COLUMN     "missingNumberIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "missingNumberQA" BOOLEAN NOT NULL,
ADD COLUMN     "missingSpaceIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "missingSpaceQA" BOOLEAN NOT NULL,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "repeatedWordIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "repeatedWordQA" BOOLEAN NOT NULL,
ADD COLUMN     "spellingIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "spellingQA" BOOLEAN NOT NULL,
ADD COLUMN     "targetTextIdenticalIgnore" BOOLEAN NOT NULL,
ADD COLUMN     "targetTextIdenticalQA" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "allowManageJobs" BOOLEAN DEFAULT false,
ADD COLUMN     "allowManageTermBase" BOOLEAN DEFAULT false,
ADD COLUMN     "allowManageUsers" BOOLEAN DEFAULT false,
ADD COLUMN     "allowRejectJob" BOOLEAN DEFAULT false,
ADD COLUMN     "allowViewAllProject" BOOLEAN DEFAULT false,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "userName" TEXT;

-- DropTable
DROP TABLE "CRP";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "ProjectJob";

-- CreateTable
CREATE TABLE "UserJob" (
    "userId" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "UserJob_pkey" PRIMARY KEY ("userId","jobId")
);

-- CreateTable
CREATE TABLE "UserProject" (
    "userId" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "outDate" TIMESTAMP(3),

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "LanguageUser" (
    "languageCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "LanguageUser_pkey" PRIMARY KEY ("languageCode","userId","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_targetLanguageId_fkey" FOREIGN KEY ("targetLanguageId") REFERENCES "Language"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJob" ADD CONSTRAINT "UserJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJob" ADD CONSTRAINT "UserJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageUser" ADD CONSTRAINT "LanguageUser_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageUser" ADD CONSTRAINT "LanguageUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
