-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "accountId" VARCHAR(128) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(128),
    "color" VARCHAR(32) NOT NULL DEFAULT '#18181b',
    "isRemove" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_id_key" ON "teams"("id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
