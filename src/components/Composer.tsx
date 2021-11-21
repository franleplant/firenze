import { useState } from "react";

export interface IProps {
  onSend: (content: string) => void;
}

export default function Composer(props: IProps) {
  const [newMsg, setNewMsg] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setNewMsg("");
        props.onSend(newMsg);
      }}
    >
      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        style={{
          width: "500px",
          padding: "5px",
          marginLeft: "10px",
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
