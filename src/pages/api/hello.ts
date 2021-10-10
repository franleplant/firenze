// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { AuthorPost, PrismaClient } from "@prisma/client";

type Data = {
  name: string;
  data: AuthorPost[];
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const posts = await prisma.authorPost.findMany()
    .finally(async () => await prisma.$disconnect());
  res.status(200).json({
    name: "test",
    data: posts
  });
}
