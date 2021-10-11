/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `AuthorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `AuthorProfile` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `AuthorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `AuthorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthorProfile" DROP COLUMN "isDeleted",
DROP COLUMN "profile",
ADD COLUMN     "avatar" VARCHAR(255) NOT NULL,
ADD COLUMN     "description" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "idx_authorpost_author" ON "AuthorPost"("author");

-- CreateIndex
CREATE INDEX "idx_follow_fromUser" ON "Follow"("fromUser");

-- CreateIndex
CREATE INDEX "idx_follow_toUser" ON "Follow"("toUser");

-- CreateIndex
CREATE INDEX "idx_postlike_post" ON "PostLike"("post");

-- CreateIndex
CREATE INDEX "idx_postresponse_topost" ON "PostResponse"("toPost");
