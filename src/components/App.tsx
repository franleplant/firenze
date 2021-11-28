import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "./Layout";

import { IPFSProvider } from "components/IPFS";
import { SelfIDProvider } from "components/SelfID";
import { FirebaseProvider } from "components/Firebase";
import Providers from "components/Providers";
import Landing from "components/Landing";

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
                <Landing>{props.children}</Landing>
              </Layout>
            </SelfIDProvider>
          </IPFSProvider>
        </FirebaseProvider>
      </QueryClientProvider>
    </Providers>
  );
}
