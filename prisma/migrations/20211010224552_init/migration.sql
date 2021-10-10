-- CreateTable
CREATE TABLE "AuthorProfile" (
    "author" VARCHAR(255) NOT NULL,
    "profile" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

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
