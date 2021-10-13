import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "ts-invariant";
import { isNftOwner } from "server/io/ethereum";
import { ISignedPayload, isValid } from "modules/signedPayload";
import { getNFT, INFT } from "server/io/moralis";
import { CHAIN_INFO } from "client/modules/wallet";
import { db } from "server/io/db";

// TODO move this type elsewhere (maybe use db)
export interface IProfile {
  // TODO primary key: chainId and signer
  // TODO remove as not needed
  chainId: string | number | undefined;

  /** contract address */
  nftAddress: string | undefined;
  /** token id */
  nftId: string | undefined;
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { pubkey, chainId } = req.query;

  // TODO abstract into a reusbale middleware
  invariant(typeof chainId === "string");

  const chain = CHAIN_INFO[Number(chainId)];
  invariant(chain);

  invariant(
    typeof pubkey === "string",
    "pubkey must be present and of type string"
  );

  if (req.method === "POST") {
    // TODO validate / schema this
    const signedPayload = req.body as ISignedPayload<IProfile>;
    const { signer, payload } = signedPayload;

    if (!isValid(signedPayload)) {
      return res.status(401).send({ error: true, message: "bad signature" });
    }

    // verify that the chosen nft is owned by the author
    const { nftAddress, nftId } = payload;
    let nft: INFT | undefined;
    // if the nft isn't present then the call is erasing this data
    if (nftAddress && nftId) {
      const isOwner = await isNftOwner({
        ownerAddress: signer,
        tokenAddress: nftAddress,
        tokenId: nftId,
        chainId: chainId,
      });
      if (!isOwner) {
        return res.status(404).send({
          error: true,
          message: `user ${signer} does not own token ${nftAddress} with id ${nftId}`,
        });
      }

      // fetch the entire nft data for caching reasons
      nft = await getNFT(nftAddress, nftId, chainId);
    }

    // TODO Store the new profile in IPFS
    const profile = await db.authorProfile.create({
      data: {
        author: signer,
        chainId: chainId,
        nftId: nftId,
        nftAddress: nftAddress
      }
    });

    return res.status(200).send({ ok: true, profile });
  }

  if (req.method === "GET") {
    const { chainId, pubkey } = req.query;
    invariant(typeof chainId === "string");
    invariant(typeof pubkey === "string");

    const profile = await db.authorProfile.findFirst({
      where: {
        author: pubkey as string,
        chainId: chainId as string
      }
    });

    let nft = {};
    if (profile?.nftAddress && profile?.nftId) {
      nft = await getNFT(profile?.nftAddress, profile?.nftId, Number(chainId));
    }

    return res.status(200).send({
      chainId: Number(chainId),
      nftAddress: profile?.nftAddress,
      nftId: profile?.nftId,
      nft,
    } as IProfile & { nft: INFT | undefined });
  }

  throw new Error("method unsupported");
}
