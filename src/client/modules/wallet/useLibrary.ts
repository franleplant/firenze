import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

export default function useLibrary(): Web3Provider | undefined {
  const { library } = useWeb3React<Web3Provider>();

  return library;
}