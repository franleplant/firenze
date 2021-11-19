import { useEffect, useState, createContext, useContext } from "react";
import { IPFS } from "ipfs-core";
import { create } from "ipfs-http-client";
import * as dagJose from "dag-jose";

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
      // source https://blog.ceramic.network/how-to-store-signed-and-encrypted-data-on-ipfs/
      const ipfs = create({
        // TODO proper config module
        url: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
        ipld: { codecs: [dagJose] },
      });

      //ipfs.pin.remote.add

      // TODO remove
      (window as any).ipfs = ipfs;
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
