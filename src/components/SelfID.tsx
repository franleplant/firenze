import { useEffect, useState, useContext, createContext } from "react";
import { EthereumAuthProvider, SelfID } from "@self.id/web";

import ceramicModel from "../../ceramic-management/published-model.json";

import { useWeb3Session } from "hooks/web3";

export interface IContext {
  selfID: SelfID | undefined;
}

export const Context = createContext<IContext>({ selfID: undefined });

export interface IProps {
  children: React.ReactNode | undefined;
}

export function SelfIDProvider(props: IProps) {
  const { account: address } = useWeb3Session();
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
        model: ceramicModel,
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
