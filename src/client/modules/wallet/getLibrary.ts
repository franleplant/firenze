import { Web3Provider } from "@ethersproject/providers";

export default function getLibrary(provider: any): Web3Provider {
  let chainId: string | number = "any";
  if (
    typeof provider.chainId === "number" ||
    typeof provider.chainId === "string"
  ) {
    chainId = Number(provider.chainId);
  }

  const library = new Web3Provider(provider, chainId);
  library.pollingInterval = 15_000;
  //library.detectNetwork().then((network) => {
  //const networkPollingInterval = NETWORK_POLLING_INTERVALS[network.chainId]
  //if (networkPollingInterval) {
  //console.debug('Setting polling interval', networkPollingInterval)
  //library.pollingInterval = networkPollingInterval
  //}
  //})
  return library;
}
