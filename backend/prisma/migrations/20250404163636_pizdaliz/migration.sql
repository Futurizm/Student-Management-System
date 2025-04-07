/*
  Warnings:

  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[iin]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropIndex
DROP INDEX `Student_email_key` ON `Student`;

-- AlterTable
ALTER TABLE `Group` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `specialty` VARCHAR(191) NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `email`,
    DROP COLUMN `phone`,
    ADD COLUMN `admissionDate` DATETIME(3) NULL,
    ADD COLUMN `citizenship` VARCHAR(191) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `graduationDate` DATETIME(3) NULL,
    ADD COLUMN `identityDocument` VARCHAR(191) NULL,
    ADD COLUMN `iin` VARCHAR(191) NULL,
    ADD COLUMN `medicalCertificate` VARCHAR(191) NULL,
    ADD COLUMN `middleName` VARCHAR(191) NULL,
    ADD COLUMN `nationality` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `qualification` VARCHAR(191) NULL,
    ADD COLUMN `specialty` VARCHAR(191) NULL,
    ADD COLUMN `studyLanguage` VARCHAR(191) NULL,
    MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL,
    MODIFY `birthDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Teacher` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `birthDate` DATETIME(3) NULL,
    ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `education` VARCHAR(191) NULL,
    ADD COLUMN `experience` VARCHAR(191) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    ADD COLUMN `middleName` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `position` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `subjects` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Profile`;

-- CreateIndex
CREATE UNIQUE INDEX `Student_iin_key` ON `Student`(`iin`);
