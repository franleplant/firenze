import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "ts-invariant";
import { isNftOwner } from "server/io/ethereum";
import { ISignedPayload, isValid } from "modules/signedPayload";

export interface IProfile {
  // These two (signer) are primary key
  // TODO make a more broad support for multiple chains
  // the hooks we have in place return chainId as a number identifier,
  // we shoujld probably use that across the board
  /** chain id */
  chainId: number;

  /** contract address */
  nftAddress: string | undefined;
  /** token id */
  nftId: string | undefined;
}

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { pubkey } = req.query;
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
    const { nftAddress, nftId, chainId } = payload;
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
    }

    // TODO Store the new profile in IPFS
    // TODO Save references to our db

    return res.status(200).send({ ok: true });
  }

  throw new Error("method unsupported");
}
