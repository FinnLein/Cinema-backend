-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD', 'TWO_FACTOR', 'EMAIL_CONFIRMATION');

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);
