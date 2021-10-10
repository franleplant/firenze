/** Input output (network requests, etc) */
import fetch from "isomorphic-fetch";

const BASE_URL = `https://deep-index.moralis.io/api/v2`;

export interface INFT {
  token_address: string;
  token_id: string;
  amount: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  contract_type: string;
  token_uri: string;
  /** JSON inside */
  metadata: string;
  synced_at: string;
  name: string;
  symbol: string;
}

export interface IResult {
  status: "SYNCING" | "SYNCED";
  total: number;
  page: number;
  page_size: number;
  result: Array<INFT>;
}

export async function getNFTs(
  account: string,
  chain: string
): Promise<IResult> {
  // TODO this needs to be wrapped by our server to protect our apikey
  const res = await fetch(`${BASE_URL}/${account}/nft?chain=${chain}`, {
    headers: {
      accept: "application/json",
      "X-API-Key":
        "pVkSoQsH6spneZZlmuYveW33eJjk0k0CG75NyszImpp8SOcRaZKekzz5kL8aAVxD",
      // TODO better typed wrappers for env vairbales
      //"X-API-Key": process.env.MORALIS_API_KEY!,
    },
  });
  const body = await res.json();

  return body;
}
