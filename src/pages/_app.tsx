import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import getLibrary from "../modules/wallet/getLibrary";

function MyApp({ Component, pageProps }: AppProps) {
  //useEff

  //if (!!window.ethereum) {
  //window.ethereum.autoRefreshOnNetworkChange = false;
  //}
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />;
    </Web3ReactProvider>
  );
}
export default MyApp;
