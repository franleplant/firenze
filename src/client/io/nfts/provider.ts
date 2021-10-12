/** Input output (network requests, etc) */
import fetch from "isomorphic-fetch";
import type { INFT, IResult } from "server/io/moralis";

export async function getNFTs(
  account: string,
  chain: string
): Promise<IResult> {
  const res = await fetch(`/api/user/${account}/nfts?chain=${chain}`);
  const body = await res.json();

  return body;
}

//export async function getNFT(
//tokenAddress: string,
//tokenId: string,
//chainId: number,
//): Promise<INFT> {
//const res = await fetch(`/api/nfts/${tokenAddress}/${tokenId}?chain=${chainId}`);
//const body = await res.json();

//return body;
//}
