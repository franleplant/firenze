import { IMessage } from "dal/message";

export interface IProps {
  msg: IMessage | undefined;
  isArchived?: boolean;
  isLoading?: boolean;
  style?: any;
  address: string;
}

export default function Message(props: IProps) {
  const isFromLocalUser = props.msg?.from === props.address;
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
      {props.isLoading ? (
        "Loading..."
      ) : (
        <div>
          <div>
            <small>{props.msg?.date}</small>
            <small>{props.isArchived ? "  Archived" : "  Archiving"}</small>
          </div>
          <div>{props.msg?.content}</div>
        </div>
      )}
    </div>
  );
}
