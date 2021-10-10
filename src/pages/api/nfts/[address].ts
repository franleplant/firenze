import type { NextApiRequest, NextApiResponse } from "next";

import { getNFTs } from "server/io/moralis";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    const { address, chain } = req.query;
    if (!address || typeof address !== "string") {
      throw new Error(`address missing`);
    }
    const nfts = await getNFTs(address, chain?.toString());

    return res.status(200).json(nfts);
  }

  throw new Error("method unsupported");
}
