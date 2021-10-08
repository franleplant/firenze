import React from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEnsName } from "./useEnsName";

export default function Account() {
  const { active, account } = useWeb3React<Web3Provider>();
  const domain = useEnsName(account);
  if (!active) {
    return null;
  }

  if (!account) {
    return null;
  }

  let label = account;
  if (domain) {
    // TODO alwasy show address somehow
    label = domain;
  }

  return <strong title={account}>{label}</strong>;
}
