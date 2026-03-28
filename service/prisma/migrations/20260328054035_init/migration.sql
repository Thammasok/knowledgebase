-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('free', 'personal', 'startup');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "blockCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "workspaceId" VARCHAR(128) NOT NULL,
    "parentId" VARCHAR(128),
    "name" VARCHAR(255) NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRemove" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "workspaceId" VARCHAR(128) NOT NULL,
    "folderId" VARCHAR(128),
    "parentPageId" VARCHAR(128),
    "title" VARCHAR(500) NOT NULL DEFAULT 'Untitled',
    "content" JSONB NOT NULL DEFAULT '[]',
    "depth" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRemove" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "folders_id_key" ON "folders"("id");

-- CreateIndex
CREATE INDEX "folders_workspaceId_parentId_idx" ON "folders"("workspaceId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "pages_id_key" ON "pages"("id");

-- CreateIndex
CREATE INDEX "pages_workspaceId_folderId_idx" ON "pages"("workspaceId", "folderId");

-- CreateIndex
CREATE INDEX "pages_workspaceId_parentPageId_idx" ON "pages"("workspaceId", "parentPageId");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_parentPageId_fkey" FOREIGN KEY ("parentPageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
