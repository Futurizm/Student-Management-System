/*
  Warnings:

  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_groupId_fkey`;

-- DropIndex
DROP INDEX `Attendance_studentId_fkey` ON `Attendance`;

-- DropIndex
DROP INDEX `Document_studentId_fkey` ON `Document`;

-- DropIndex
DROP INDEX `Performance_studentId_fkey` ON `Performance`;

-- DropTable
DROP TABLE `student`;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iin` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `middleName` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `citizenship` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `admissionDate` DATETIME(3) NULL,
    `graduationDate` DATETIME(3) NULL,
    `studyLanguage` VARCHAR(191) NULL,
    `direction` VARCHAR(191) NULL,
    `specialty` VARCHAR(191) NULL,
    `qualification` VARCHAR(191) NULL,
    `identityDocument` VARCHAR(191) NULL,
    `medicalCertificate` VARCHAR(191) NULL,
    `profilePicture` VARCHAR(191) NULL,
    `groupId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `Student_iin_key`(`iin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Performance` ADD CONSTRAINT `Performance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
