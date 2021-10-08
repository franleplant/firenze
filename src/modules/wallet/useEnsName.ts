import { useEffect, useState } from "react";
import useLibrary from "./useLibrary";

export function useEnsName(account: string | undefined): string | undefined {
  const library = useLibrary();
  const [domain, setDomain] = useState<string | undefined>();

  useEffect(() => {
    async function effect() {
      if (!account || !library) {
        return;
      }
      const name = await library.lookupAddress(account);
      setDomain(name);
    }

    effect();
  }, [account, library]);

  return domain;
}
