import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export interface IProps {
  onSend: (content: string) => void;
  isSavingMessage: boolean;
}

export default function Composer(props: IProps) {
  const [newMsg, setNewMsg] = useState("");

  return (
    <form
      style={{ display: "flex", gap: "5px", alignItems: "center" }}
      onSubmit={async (e) => {
        e.preventDefault();
        setNewMsg("");
        props.onSend(newMsg);
      }}
    >
      <div style={{ flex: 1 }}>
        <TextField
          variant="outlined"
          label="write something"
          type="text"
          fullWidth
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          size={"small"}
        />
      </div>
      <div>
        <Button
          type="submit"
          size="large"
          disabled={props.isSavingMessage}
          variant="contained"
        >
          {props.isSavingMessage ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
