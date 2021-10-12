import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "ts-invariant";
import { isNftOwner } from "server/io/ethereum";
import { ISignedPayload, isValid } from "modules/signedPayload";
import { getNFT, INFT } from "server/io/moralis";

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
    // TODO Save references to our db

    return res.status(200).send({ ok: true });
  }

  if (req.method === "GET") {
    const { chainId } = req.query;
    invariant(typeof chainId === "string");

    // TODO db query by pubKey and chainId

    return res.status(200).send({
      chainId: Number(chainId),
      nftAddress: "0xc724a926836c66083c20aeb5186b6a140016bcbf",
      nftId: "5",
      nft: {
        amount: "1",
        block_number: "9276660",
        block_number_minted: "9276660",
        contract_type: "ERC721",
        metadata:
          '{"description":"CuCo description","external_url":"/api/nfts/test/5","image":"https://www.cucollectors.com/dog.jpg","name":"CuCo test","attributes":[{"trait_type":"Kind","value":"Test"}]}',
        name: "Cuco_test_3",
        owner_of: "0x7dce8a09ae403863dbaf9815de20e4a7bb18ae9d",
        symbol: "CCT3",
        synced_at: "2021-10-09T21:33:58.579Z",
        token_address: "0xc724a926836c66083c20aeb5186b6a140016bcbf",
        token_id: "5",
        token_uri: "https://www.cucollectors.com/api/nfts/test/5",
      },
    } as IProfile & { nft: INFT | undefined });
  }

  throw new Error("method unsupported");
}
