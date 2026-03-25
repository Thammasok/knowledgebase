-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'system');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "isExternalAccount" BOOLEAN DEFAULT false,
    "externalProvider" VARCHAR(255),
    "source" VARCHAR(255),
    "isVerify" BOOLEAN NOT NULL DEFAULT false,
    "isRemove" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_request_access" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_request_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_forgot_passwords" (
    "accountId" VARCHAR(128) NOT NULL,
    "token" VARCHAR(128) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "accountId" VARCHAR(128) NOT NULL,
    "deviceId" VARCHAR(128),
    "ip" VARCHAR(128),
    "userAgent" TEXT,
    "ipInfo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_settings" (
    "accountId" VARCHAR(128) NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" "Theme" NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_id_key" ON "accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_request_access_id_key" ON "account_request_access"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_request_access_email_key" ON "account_request_access"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_forgot_passwords_accountId_key" ON "account_forgot_passwords"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "account_settings_accountId_key" ON "account_settings"("accountId");

-- AddForeignKey
ALTER TABLE "account_forgot_passwords" ADD CONSTRAINT "account_forgot_passwords_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_settings" ADD CONSTRAINT "account_settings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
