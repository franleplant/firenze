import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "ts-invariant";

import { getNFT, INFT } from "server/io/moralis";

export default async function getNFTHandler(
  req: NextApiRequest,
  res: NextApiResponse<INFT>
): Promise<void> {
  const { chainId, tokenAddress, tokenId } = req.query;
  invariant(typeof chainId === "string");
  invariant(typeof tokenAddress === "string");
  invariant(typeof tokenId === "string");

  if (req.method === "GET") {
    const nft = await getNFT(tokenAddress, tokenId, chainId);

    return res.status(200).json(nft);
  }

  throw new Error("method unsupported");
}
