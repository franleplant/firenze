import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { getLibrary } from "client/modules/wallet";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  //if (!!window.ethereum) {
  //window.ethereum.autoRefreshOnNetworkChange = false;
  //}
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />;
      </Web3ReactProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
