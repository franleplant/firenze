import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "./Layout";

import { IPFSProvider, useIpfs } from "components/IPFS";
import { SelfIDProvider, useSelfID } from "components/SelfID";
import { FirebaseProvider } from "components/Firebase";
import Providers from "components/Providers";
import { useWeb3Session } from "hooks/web3";

const queryClient = new QueryClient();

export interface IProps {
  children: JSX.Element;
}

export default function App(props: IProps) {
  return (
    <Providers>
      {/* TODO abstract */}
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider>
          <IPFSProvider>
            <SelfIDProvider>
              <Layout>
                <Loader>{props.children}</Loader>
              </Layout>
            </SelfIDProvider>
          </IPFSProvider>
        </FirebaseProvider>
      </QueryClientProvider>
    </Providers>
  );
}

export function Loader({ children }: { children: JSX.Element | null }) {
  const { selfID } = useSelfID();
  const { ipfs } = useIpfs();
  const { account } = useWeb3Session();

  let title = (
    <>
      <Typography variant="h1" color="textPrimary">
        Welcome to Firenze
      </Typography>
      <Typography variant="h3" color="textPrimary" gutterBottom>
        An open communication tool for the web3
      </Typography>
    </>
  );

  if (!ipfs) {
    return (
      <>
        {title}
        <p>Something went terribly wrong with IPFS, please try again.</p>
      </>
    );
  }

  if (!account) {
    return <>{title}</>;
  }

  if (!selfID) {
    return (
      <>
        {title}
        <Typography variant="body1" color="textPrimary">
          Connecting to your Ceramic profile, also called 3ID Connect. Follow
          the instructions on screen.
        </Typography>
        <CircularProgress />
        <Typography variant="body1" color="textPrimary">
          If this is your first time you might need to create a new profile, but
          do not worry, the process is super easy.
        </Typography>
      </>
    );
  }

  return children;
}
