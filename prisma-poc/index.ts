import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  // add some posts
  await prisma.authorPost.create({
    data: {
      author: "0x0000000000000000000000000000000000000001",
      post: "qmv8ndh7ageh9b24zngaextmuhj7aiuw3scc8hkczvjkww"
    }
  });
  await prisma.authorPost.create({
    data: {
      author: "0x0000000000000000000000000000000000000001",
      post: "qmuvjja4s4cgyqyppozttssquvgcv2n2v8mae3gnkrxmol"
    }
  });
  await prisma.authorPost.create({
    data: {
      author: "0x0000000000000000000000000000000000000002",
      post: "qmrgjmlhlddhvxuieveuuwkeci4ygx8z7ujunikzpfzjuk"
    }
  });

  // list all posts
  console.log("> All users:", await prisma.authorPost.findMany({
    orderBy: { timestamp: 'desc' }
  }));

  // heads
  await prisma.authorPostHead.create({
    data: {
      author: "0x0000000000000000000000000000000000000001",
      post: "qmuvjja4s4cgyqyppozttssquvgcv2n2v8mae3gnkrxmol"
    }
  });
  await prisma.authorPostHead.create({
    data: {
      author: "0x0000000000000000000000000000000000000002",
      post: "qmrgjmlhlddhvxuieveuuwkeci4ygx8z7ujunikzpfzjuk"
    }
  });

  // profiles
  await prisma.authorProfile.create({
    data: {
      author: "0x0000000000000000000000000000000000000001",
      profile: "profile1CID"
    }
  });
  await prisma.authorProfile.create({
    data: {
      author: "0x0000000000000000000000000000000000000002",
      profile: "profile2CID"
    }
  });
  await prisma.authorProfile.create({
    data: {
      author: "0x0000000000000000000000000000000000000003",
      profile: "profile3CID"
    }
  });

  // follows
  await prisma.follow.create({
    data: {
      fromUser: "0x0000000000000000000000000000000000000001",
      toUser: "0x0000000000000000000000000000000000000002"
    }
  });
  await prisma.follow.create({
    data: {
      fromUser: "0x0000000000000000000000000000000000000003",
      toUser: "0x0000000000000000000000000000000000000001"
    }
  });
  await prisma.follow.create({
    data: {
      fromUser: "0x0000000000000000000000000000000000000003",
      toUser: "0x0000000000000000000000000000000000000002"
    }
  });

  // likes
  await prisma.postLike.create({
    data: {
      liker: "0x0000000000000000000000000000000000000003",
      post: "qmv8ndh7ageh9b24zngaextmuhj7aiuw3scc8hkczvjkww",
    }
  });
  await prisma.postLike.create({
    data: {
      liker: "0x0000000000000000000000000000000000000003",
      post: "qmrgjmlhlddhvxuieveuuwkeci4ygx8z7ujunikzpfzjuk",
    }
  });

  // response
  await prisma.postResponse.create({
    data: {
      fromPost: "qmrgjmlhlddhvxuieveuuwkeci4ygx8z7ujunikzpfzjuk",
      toPost: "qmv8ndh7ageh9b24zngaextmuhj7aiuw3scc8hkczvjkww",
    }
  });
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });