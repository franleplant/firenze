-- CreateTable
CREATE TABLE "AuthorProfile" (
    "author" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "chainId" INTEGER NOT NULL,
    "nftAddress" VARCHAR(255),
    "nftId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorProfile_pkey" PRIMARY KEY ("author")
);

-- CreateTable
CREATE TABLE "AuthorPost" (
    "author" VARCHAR(255) NOT NULL,
    "post" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AuthorPost_pkey" PRIMARY KEY ("post")
);

-- CreateTable
CREATE TABLE "AuthorPostHead" (
    "author" VARCHAR(255) NOT NULL,
    "post" VARCHAR(255) NOT NULL,

    CONSTRAINT "AuthorPostHead_pkey" PRIMARY KEY ("author")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "fromUser" VARCHAR(255) NOT NULL,
    "toUser" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" SERIAL NOT NULL,
    "post" VARCHAR(255) NOT NULL,
    "liker" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostResponse" (
    "fromPost" VARCHAR(255) NOT NULL,
    "toPost" VARCHAR(255) NOT NULL,

    CONSTRAINT "PostResponse_pkey" PRIMARY KEY ("fromPost")
);

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
