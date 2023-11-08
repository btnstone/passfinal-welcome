-- CreateTable
CREATE TABLE `QueryLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outTradeNo` VARCHAR(27) NOT NULL,
    `userId` VARCHAR(50) NOT NULL,
    `userName` VARCHAR(100) NOT NULL,
    `ipAddress` VARCHAR(45) NOT NULL,
    `queryTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;