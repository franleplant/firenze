import { useEffect, useState } from "react";
import { useWeb3Session } from "./web3";

// TODO this might be modeled as a react-query query
export default function useENSName(
  account: string | undefined | null
): string | undefined {
  const { library } = useWeb3Session();
  const [domain, setDomain] = useState<string | undefined>();

  useEffect(() => {
    async function effect() {
      if (!account || !library) {
        return;
      }
      const name = await library.lookupAddress(account);
      setDomain(name || undefined);
    }

    effect();
  }, [account, library]);

  return domain;
}
