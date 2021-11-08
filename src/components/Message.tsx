import { IMessage } from "dal/message";

export interface IProps {
  msg: IMessage | undefined;
  isLoading?: boolean;
  style?: any;
}

export default function Message(props: IProps) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid grey",
        //background: props.msg?.transient ? "grey" : "white",
        ...props.style,
      }}
    >
      {props.isLoading ? "Loading..." : JSON.stringify(props.msg, null, 2)}
    </div>
  );
}
