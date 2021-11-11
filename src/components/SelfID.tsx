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
