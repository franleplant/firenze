import React, { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useWeb3React } from "modules/wallet";
import { useNfts } from "modules/nfts";
import Item from "./Item";
import { getMetadata } from "domain/nfts";

export interface IProps {}

export default function AvatarSelector(props: IProps) {
  const [avatar, setAvatar] = useState(0);
  const { account } = useWeb3React();
  const { data, isLoading } = useNfts(account);

  if (!account) {
    return null;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  console.log(data);
  if ((data?.total ?? 0) === 0) {
    return <div>This account has 0 nfts</div>;
  }

  const result = data?.result || [];

  console.log("SELECTED", avatar);

  return (
    <RadioGroup value={avatar} onChange={setAvatar}>
      <div className="space-y-2">
        {result.map((nft, index) => {
          const meta = getMetadata(nft);
          // TODO default to something
          const image = meta.image;
          if (!image) {
            return null;
          }

          return (
            <RadioGroup.Option value={index} key={index}>
              {({ active, checked }) => (
                <Item nft={nft} active={active} checked={checked} />
              )}
            </RadioGroup.Option>
          );
        })}
      </div>
    </RadioGroup>
  );
}
