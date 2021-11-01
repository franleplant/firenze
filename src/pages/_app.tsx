import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { getLibrary } from "client/modules/wallet";
import LayoutComponent from "components/Layout";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  //if (!!window.ethereum) {
  //window.ethereum.autoRefreshOnNetworkChange = false;
  //}
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
