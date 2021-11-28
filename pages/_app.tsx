import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";

//import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

interface IProps extends AppProps {
  emotionCache?: EmotionCache;
}

const muiTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function MyApp(props: IProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <MUIThemeProvider theme={muiTheme}>
        <Component {...pageProps} />
      </MUIThemeProvider>
    </CacheProvider>
  );
}
