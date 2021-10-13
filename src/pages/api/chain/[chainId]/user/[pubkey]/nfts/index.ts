import { CHAIN_INFO } from "client/modules/wallet";
import type { NextApiRequest, NextApiResponse } from "next";

import { getUserNFTs, IResult } from "server/io/moralis";
import invariant from "ts-invariant";

export default async function getUserNFTsHandler(
  req: NextApiRequest,
  res: NextApiResponse<IResult>
): Promise<void> {
  if (req.method === "GET") {
    const { pubkey, chainId } = req.query;
    invariant(typeof pubkey === "string");
    invariant(typeof chainId === "string");

    // TODO abstract into a reusbale middleware
    const chain = CHAIN_INFO[Number(chainId)];
    invariant(chain);

    const nfts = await getUserNFTs(pubkey, chain.label.toString());

    return res.status(200).json(nfts);
  }

  throw new Error("method unsupported");
}
