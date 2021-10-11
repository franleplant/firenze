import React from "react";

export interface IProps {
  url: string;
}

export default function Avatar(props: IProps) {
  return (
    <div
      className="rounded-full w-32 h-32 center inline-block"
      style={{
        backgroundImage: `url(${props.url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    ></div>
  );
}
