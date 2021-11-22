import { useEffect, useRef } from "react";

import { IMessage, MsgURL } from "dal/message";

export interface IProps {
  msg?: IMessage;
  style?: any;
  address: string;
  status: "sending" | "archiving" | "archived";
  isLoading?: boolean;
  timestamp: string;
  msgURL?: MsgURL;
  onMount?: () => void;
}

// TODO styling
export default function Message(props: IProps) {
  const isFromLocalUser = props.msg?.from === props.address;

  const onMount = useRef(props.onMount);
  useEffect(() => {
    onMount?.current?.();
  }, [onMount]);

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid grey",
        maxWidth: "500px",
        background: isFromLocalUser ? "#EEE" : "",
        alignSelf: isFromLocalUser ? "flex-end" : "flex-start",
        ...props.style,
      }}
    >
      <div>
        <div>
          <small>{props.timestamp}</small>
          <small>{` ${props.status}`}</small>
        </div>
        <div>
          <small>{props.msgURL || ""}</small>
        </div>
        <div style={{ marginTop: "20px" }}>
          {props.isLoading ? "Loading..." : props.msg?.content}
        </div>
      </div>
    </div>
  );
}
