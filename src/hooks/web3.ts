import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useEffect, useState } from "react";
import invariant from "ts-invariant";

import { injected } from "connectors";
import { isMobile } from "utils/userAgent";

/**
 * Main entry point to the logged in wallet
 */
export function useWeb3Session(): Web3ReactContextInterface<Web3Provider> {
  const context = useWeb3React<Web3Provider>();
  return context;
}

/**
 * Get the wallet address, if there is not wallet in session then this throws errors,
 * if you want ot handle that case revert back to useWeb3Session
 */
export function useAddress(): string {
  const session = useWeb3Session();
  const address = session.account;
  invariant(typeof address === "string");

  return address.toLowerCase();
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  // then, if that fails, try connecting to an injected connector
  useEffect(() => {
    async function effect() {
      if (active) {
        return;
      }
      const isAuthorized = await injected.isAuthorized();
      const isMobileOk = isMobile && window.ethereum;
      if (isAuthorized || isMobileOk) {
        try {
          activate(injected, undefined, true);
        } catch (err) {
          setTried(true);
        }
      } else {
        setTried(true);
      }
    }

    effect();
  }, [activate, active]);

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

/**
 * TODO what the fuck is this?
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error("Failed to activate after accounts changed", error);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}
