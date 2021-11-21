import { useEffect, useState, createContext, useContext } from "react";
import { IPFS } from "ipfs-core";
import { create } from "ipfs-http-client";
//import * as dagJose from "dag-jose";
import pinataSDK, { PinataClient } from "@pinata/sdk";

export interface IContext {
  ipfs: IPFS | undefined;
  pinata: PinataClient | undefined;
}

export const Context = createContext<IContext>({
  ipfs: undefined,
  pinata: undefined,
});

export interface IProps {
  children: React.ReactNode | undefined;
}

export function IPFSProvider(props: IProps) {
  const [ipfs, setIpfs] = useState<IPFS | undefined>();
  const [pinata, setPinata] = useState<PinataClient | undefined>();
  useEffect(() => {
    async function effect() {
      // source https://blog.ceramic.network/how-to-store-signed-and-encrypted-data-on-ipfs/
      const ipfs = create({
        // TODO proper config module
        url: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
        //ipld: { codecs: [dagJose] },
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      });

      //ipfs.pin.remote.add

      // TODO remove
      (window as any).ipfs = ipfs;
      setIpfs(ipfs);

      //const pinata = pinataSDK(process.env.NEXT_PUBLIC_PINATA_APIKEY!, process.env.NEXT_PUBLIC_PINATA_SECRET!);

      //setPinata(pinata)
    }

    effect();
  }, []);

  return (
    <Context.Provider
      value={{
        ipfs,
        pinata,
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
