// TODO replace with web3Provider
import { useEffect, useState, useContext, createContext } from "react";

export interface IContext {
  address: string | undefined;
}

export const Context = createContext<IContext>({ address: undefined });

export interface IProps {
  children: React.ReactNode | undefined;
}

export function WalletProvider(props: IProps) {
  const [address, setAddress] = useState<string | undefined>();

  useEffect(() => {
    async function effect() {
      const addresses = await (window as any).ethereum.enable();
      const address = addresses[0] || ""
      setAddress(address.toLowerCase());
    }

    effect();
  }, []);

  return (
    <Context.Provider
      value={{
        address,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function useWallet(): IContext {
  const context = useContext(Context);
  return context;
}
