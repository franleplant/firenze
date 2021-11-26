import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import CircularProgress from "@mui/material/CircularProgress";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";

import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

import { IPFSProvider, useIpfs } from "components/IPFS";
import { SelfIDProvider, useSelfID } from "components/SelfID";
import { useWallet, WalletProvider } from "components/Wallet";
import { FirebaseProvider } from "components/Firebase";

const clientSideEmotionCache = createEmotionCache();

interface IProps extends AppProps {
  emotionCache?: EmotionCache;
}

const queryClient = new QueryClient();

function MyApp(props: IProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {/* TODO abstract */}
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
      </ThemeProvider>
    </CacheProvider>
  );
}

export function Loader({ children }: { children: JSX.Element | null }) {
  const { selfID } = useSelfID();
  const { ipfs } = useIpfs();
  const { address } = useWallet();

  if (!selfID || !ipfs || !address) {
    return (
      <div>
        <div>
          <CircularProgress />
        </div>
        <div>You need to have metamask installed</div>
        <div>we only support ethereum rinkeby for now</div>
      </div>
    );
  }

  return children;
}

export default MyApp;
