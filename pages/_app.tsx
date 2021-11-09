import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { IPFSProvider, useIpfs } from "components/IPFS";
import { SelfIDProvider, useSelfID } from "components/SelfID";
import { useWallet, WalletProvider } from "components/Wallet";
import { FirebaseProvider } from "components/Firebase";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <WalletProvider>
          <IPFSProvider>
            <SelfIDProvider>
              <Loader>
                <Component {...pageProps} />
              </Loader>
            </SelfIDProvider>
          </IPFSProvider>
        </WalletProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
}

export function Loader({ children }: { children: JSX.Element | null }) {
  const { selfID } = useSelfID();
  const { ipfs } = useIpfs();
  const { address } = useWallet();

  if (!selfID || !ipfs || !address) {
    return <div>...LOADING...</div>;
  }

  return children;
}

export default MyApp;
