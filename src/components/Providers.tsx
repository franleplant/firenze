import { Web3ReactProvider } from "@web3-react/core";

import Web3ReactManager from "./Web3ReactManager";

import getLibrary from "utils/getLibrary";

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

export interface IProps {
  children: JSX.Element;
}

export default function Providers(props: IProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>{props.children}</Web3ReactManager>
    </Web3ReactProvider>
  );
}
