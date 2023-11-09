-- AlterTable
ALTER TABLE `QueryLog` ADD COLUMN `createTime` DATETIME(3) NULL,
    MODIFY `outTradeNo` VARCHAR(50) NOT NULL;
