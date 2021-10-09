import { useWeb3React } from "@web3-react/core";
import { CHAIN_INFO } from "./chains";
import type { ChainInfo } from "./chains";

export default function useChain<K extends keyof ChainInfo>():
  | ChainInfo[K]
  | undefined {
  const { active, chainId } = useWeb3React();
  if (!active) {
    return;
  }

  if (!chainId) {
    return;
  }

  return CHAIN_INFO[chainId];
}
