import { useEffect, useState } from "react";
import useLibrary from "./useLibrary";

export default function useEnsName(
  account: string | undefined | null
): string | undefined {
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
