import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { IPFSProvider } from "components/IPFS";
import { SelfIDProvider } from "components/SelfID";
import { WalletProvider } from "components/Wallet";
import { FirebaseProvider } from "components/Firebase";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <WalletProvider>
          <IPFSProvider>
            <SelfIDProvider>
              <Component {...pageProps} />;
            </SelfIDProvider>
          </IPFSProvider>
        </WalletProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
