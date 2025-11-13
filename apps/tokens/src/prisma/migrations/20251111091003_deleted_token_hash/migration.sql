/*
  Warnings:

  - You are about to drop the column `token_hash` on the `tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tokens" DROP COLUMN "token_hash";
