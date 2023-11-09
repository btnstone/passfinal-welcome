/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `QueryLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `QueryLog` DROP COLUMN `avatarUrl`,
    ADD COLUMN `avatar` VARCHAR(255) NOT NULL DEFAULT 'https://techfens.cachefly.net/image/20220320231057.png';
