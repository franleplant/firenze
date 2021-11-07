import { useEffect, useState, createContext, useContext } from "react";
import { create, IPFS } from "ipfs-core";

export interface IContext {
  ipfs: IPFS | undefined;
}

export const Context = createContext<IContext>({ ipfs: undefined });

export interface IProps {
  children: React.ReactNode | undefined;
}

export function IPFSProvider(props: IProps) {
  const [ipfs, setIpfs] = useState<IPFS | undefined>();
  useEffect(() => {
    async function effect() {
      const ipfs = await create();
      setIpfs(ipfs);
    }

    effect();
  }, []);

  return (
    <Context.Provider
      value={{
        ipfs,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function useIpfs(): IContext {
  const context = useContext(Context);
  return context;
}
