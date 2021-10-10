/** reactive wrappers of io module */

import { useQuery, UseQueryResult } from "react-query";
import { useChain } from "modules/wallet";
import { getNFTs, IResult } from "./io";

export function useNfts(
  account: string | undefined | null
): UseQueryResult<IResult | undefined> {
  const chain = useChain();
  return useQuery({
    queryKey: "user-nfts",
    enabled: !!(chain && account),
    queryFn: () => {
      if (!(chain && account)) {
        return;
      }
      return getNFTs(account!, chain.label.toLowerCase());
    },
  });
}
