/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_phoneNumber_key` ON `Student`(`phoneNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_email_key` ON `Student`(`email`);
