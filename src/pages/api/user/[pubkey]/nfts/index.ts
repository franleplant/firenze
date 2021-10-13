import type { NextApiRequest, NextApiResponse } from "next";

import { getUserNFTs, IResult } from "server/io/moralis";
import invariant from "ts-invariant";

export default async function getUserNFTsHandler(
  req: NextApiRequest,
  res: NextApiResponse<IResult>
): Promise<void> {
  if (req.method === "GET") {
    const { pubkey, chain } = req.query;
    invariant(typeof pubkey === "string");
    invariant(typeof chain === "string");

    const nfts = await getUserNFTs(pubkey, chain?.toString());

    return res.status(200).json(nfts);
  }

  throw new Error("method unsupported");
}
