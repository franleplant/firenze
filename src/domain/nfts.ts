import { INFT } from "server/io/moralis";

export function getMetadata(nft: INFT): any {
  return JSON.parse(nft?.metadata || "{}");
}

export function getAttributes(nft: INFT): Array<any> {
  const meta = getMetadata(nft);
  return meta.attributes || [];
}
