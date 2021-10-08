// TODO public interface
//
// TODO probably we should support all types of connectors for better use experience,
// for now we are only supporting metamask and that is fine but eventually it wont be enough at all
//
// here is the way uniswap supports all connectors
// https://github.com/Uniswap/interface/blob/2482a10ca87bfe61a2ba2023f847cdf2f909f273/src/components/WalletModal/index.tsx
//
//

import Chain from "./Chain";
import { useConnect } from "./hooks";

export { Chain, useConnect };
