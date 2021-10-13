/** reactive wrappers of io module */

import { useQuery, UseQueryResult } from "react-query";
import { useChain, useWeb3React } from "client/modules/wallet";
import type { IResult, INFT } from "server/io/moralis";
import { getNFTs } from "./provider";

export type { IResult, INFT };

export function useNfts(
  account: string | undefined | null
): UseQueryResult<IResult | undefined> {
  const { chainId } = useWeb3React();
  return useQuery({
    queryKey: "user-nfts",
    enabled: !!(chainId && account),
    queryFn: async () => {
      if (!(chainId && account)) {
        return;
      }
      const nfts = await getNFTs(account!, chainId);
      if (nfts.status !== "SYNCED") {
        console.log(`nfts still not synced, failing and retrying...`);
        throw new Error(`nfts still not synced`);
      }

      return nfts;
    },
  });
}

// TODO validate nft ownership for each user by calling the blockchain
