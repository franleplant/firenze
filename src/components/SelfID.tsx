import { useEffect, useState, useContext, createContext } from "react";
import { EthereumAuthProvider, SelfID } from "@self.id/web";

import { useWallet } from "components/Wallet";

export interface IContext {
  selfID: SelfID | undefined;
}

export const Context = createContext<IContext>({ selfID: undefined });

export interface IProps {
  children: React.ReactNode | undefined;
}

export function SelfIDProvider(props: IProps) {
  const { address } = useWallet();
  const [selfID, setSelfID] = useState<SelfID | undefined>();

  useEffect(() => {
    async function effect() {
      if (!address) {
        return;
      }
      // The following configuration assumes your local node is connected to the Clay testnet
      const selfID = await SelfID.authenticate({
        authProvider: new EthereumAuthProvider(
          (window as any).ethereum,
          address
        ),
        // TODO env variable
        ceramic: "testnet-clay",
        //connectNetwork: 'testnet-clay',
        // TODO import from env specific json file
        model: {
          definitions: {
            myProfile:
              "kjzl6cwe1jw14b2finpk5xng8syumocr79s97umf15e8acxn8j9kwb08z803v3g",
            myConversations:
              "kjzl6cwe1jw145ebogdly1z86gh7kg7q980m5ne2yli5eo2o06ujip3gi9osj3y",
          },
          schemas: {
            Profile:
              "ceramic://k3y52l7qbv1frymbaqwv4nmj6qzqybk442vdlxus2li2karqx8iv69z7k82vwee4g",
            Conversations:
              "ceramic://k3y52l7qbv1fryfrb38g010411bxbc3jam75a50enxn2spjt3jkgranzg5a25mcjk",
          },
          tiles: {},
        },
      });

      setSelfID(selfID);
    }

    effect();
  }, [address]);

  return (
    <Context.Provider
      value={{
        selfID,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function useSelfID(): IContext {
  const context = useContext(Context);
  return context;
}
