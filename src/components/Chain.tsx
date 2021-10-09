import React from "react";
import { CHAIN_INFO, useWeb3React } from "modules/wallet";

export default function Chain() {
  const { active, chainId } = useWeb3React();
  if (!active) {
    return null;
  }

  if (!chainId) {
    return null;
  }

  const chain = CHAIN_INFO[chainId];

  return (
    <span>
      <img
        src={chain.logoUrl}
        style={{ maxWidth: "20px", display: "inline" }}
      />{" "}
      {chain.label}
    </span>
  );
}
