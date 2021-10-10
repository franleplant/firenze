import React from "react";
import { useWeb3React } from "modules/wallet";
import { useNfts } from "modules/nfts";

export interface IProps {}

export default function AvatarSelector(props: IProps) {
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

  return (
    <div>
      {result.map((nft, index) => {
        // TODO abstract metadata access
        const meta = JSON.parse(nft.metadata || "{}");
        // TODO default to something
        const image = meta.image;

        return (
          <div
            key={index}
            className="max-w-2xl rounded-md border border-gray-400 cursor-pointer"
            onClick={() => alert(`Selected ${index}`)}
          >
            <div
              className="rounded-sm w-32 h-32 center inline-block"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />

            <h3>{nft.name}</h3>

            <code>{JSON.stringify({ ...nft, metadata: meta })}</code>
          </div>
        );
      })}
    </div>
  );
}
