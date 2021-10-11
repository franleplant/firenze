/** Input output (network requests, etc) */
import fetch from "isomorphic-fetch";
import type { IResult } from "server/io/moralis";

export async function getNFTs(
  account: string,
  chain: string
): Promise<IResult> {
  const res = await fetch(`/api/nfts/${account}?chain=${chain}`);
  const body = await res.json();

  return body;
}
