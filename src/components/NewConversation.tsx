import { useEffect, useState } from "react";

export interface IProps {
  onNew: (threadId: string) => void;
}

export default function NewConversation(props: IProps) {
  const [newThreadId, setNewThreadId] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onNew(newThreadId);
      }}
    >
      <label>Start conversation </label>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={newThreadId}
          onChange={(e) => setNewThreadId(e.target.value?.toLowerCase() || "")}
          style={{ flex: "1", fontSize: "9px" }}
        />
        <button type="submit">+</button>
      </div>
    </form>
  );
}
