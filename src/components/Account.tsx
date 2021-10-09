import React from "react";
import { useEnsName, useWeb3React } from "modules/wallet";

export default function Account() {
  const { active, account } = useWeb3React();
  const domain = useEnsName(account);
  if (!active) {
    return null;
  }

  if (!account) {
    return null;
  }

  // TODO improve the flicker of raw pubkey when trying to load the domain
  let label = account;
  if (domain) {
    // TODO alwasy show address somehow
    label = domain;
  }

  return <strong title={account}>{label}</strong>;
}
