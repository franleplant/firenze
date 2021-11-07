import { useMessage } from "dal/message";

export interface IProps {
  path: string;
}

export default function Message(props: IProps) {
  const { data: msg, isLoading } = useMessage(props.path);

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid grey",
        background: msg?.transient ? "grey" : "white",
      }}
    >
      {isLoading ? "Loading..." : JSON.stringify(msg, null, 2)}
    </div>
  );
}
