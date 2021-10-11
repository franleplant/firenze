import type { NextApiRequest, NextApiResponse } from "next";
import { isNftOwner } from "server/io/ethereum";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // TODO verify that the nft chosen as avatar is owned by user
  // Store the new profile in IPFS
  // Save references to our db
  //if (req.method === "POST") {
  //const { address, chain } = req.query;
  //if (!address || typeof address !== "string") {
  //throw new Error(`address missing`);
  //}
  //const nfts = await getNFTs(address, chain?.toString());

  //return res.status(200).json(nfts);
  //}

  throw new Error("method unsupported");
}
