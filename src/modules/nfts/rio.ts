/** reactive wrappers of io module */

import { useQuery, UseQueryResult } from "react-query";
import { useChain } from "modules/wallet";
import type { IResult } from "server/io/moralis";
import { getNFTs } from "./io";

// TODO if it returns "SYNCING" we should try again
export function useNfts(
  account: string | undefined | null
): UseQueryResult<IResult | undefined> {
  const chain = useChain();
  return useQuery({
    queryKey: "user-nfts",
    enabled: !!(chain && account),
    queryFn: async () => {
      if (!(chain && account)) {
        return;
      }
      const nfts = await getNFTs(account!, chain.label.toLowerCase());
      if (nfts.status !== "SYNCED") {
        console.log(`nfts still not synced, failing and retrying...`);
        throw new Error(`nfts still not synced`);
      }

      return nfts;
    },
  });
}
