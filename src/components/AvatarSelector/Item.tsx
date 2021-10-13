import React from "react";
import { RadioGroup } from "@headlessui/react";
import { INFT } from "server/io/moralis";
import { getMetadata } from "domain/nfts";

export interface IProps {
  nft: INFT;
  active: boolean;
  checked: boolean;
}

export default function Item({ nft, active, checked }: IProps) {
  const meta = getMetadata(nft);

  // TODO default to something
  const image = meta.image;
  if (!image) {
    return null;
  }

  return (
    <div className={getClassNames(active, checked)}>
      <div
        className="rounded-sm w-32 h-32 center flex-shrink-0 flex-auto"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="flex flex-col">
        <RadioGroup.Label
          className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}
        >
          {nft.name}
          <small className="float-right">
            <a href={nft.token_uri} target="__blank">
              uri
            </a>
          </small>
        </RadioGroup.Label>
        <RadioGroup.Description as="div">
          <p>{meta.description || "no description"}</p>

          <div>Id: {nft.token_id}</div>
          <div>Address: {nft.token_address}</div>
        </RadioGroup.Description>
      </div>
    </div>
  );
}

function getClassNames(active: boolean, checked: boolean): string {
  return `
    max-w-2xl flex gap-2
    rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none

    ${
      active
        ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
        : ""
    }

    ${checked ? "bg-blue-400 bg-opacity-75 text-white" : "bg-white"}
  `;
}
