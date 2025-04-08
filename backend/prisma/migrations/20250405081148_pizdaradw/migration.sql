-- AlterTable
ALTER TABLE `Group` ADD COLUMN `courseNumberId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CourseNumber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `CourseNumber_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_courseNumberId_fkey` FOREIGN KEY (`courseNumberId`) REFERENCES `CourseNumber`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
