import React from "react";
import { useChain } from "modules/wallet";

export default function Chain() {
  const chain = useChain();

  if (!chain) {
    return null;
  }

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
