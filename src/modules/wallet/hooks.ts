import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  // then, if that fails, try connecting to an injected connector
  useEffect(() => {
    async function effect() {
      const isAuthorized = await injected.isAuthorized();
      if (!isAuthorized) {
        return;
      }
      try {
        await activate(injected, undefined, true);
      } catch (err) {
        setTried(true);
      }
    }

    if (!active) {
      effect();
    }
  }, [activate, active]);

  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

// TODO make this output loading and error reactive states for convenience
export function useConnect(): () => Promise<void> {
  const { activate, active } = useWeb3React();

  return () => activate(injected, undefined, true);
}
