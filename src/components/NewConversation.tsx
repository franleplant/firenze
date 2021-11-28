import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";

export interface IProps {
  onNew: (threadId: string) => void;
}

export default function NewConversation(props: IProps) {
  const [newThreadId, setNewThreadId] = useState("");
  return (
    <Box
      component="form"
      // TODO fucking types
      onSubmit={(e: any) => {
        e.preventDefault();
        props.onNew(newThreadId);
        setNewThreadId("");
      }}
    >
      <Stack direction="row" spacing={0}>
        <TextField
          id="outlined-basic"
          label="Start a new conversation"
          variant="outlined"
          value={newThreadId}
          onChange={(e) => setNewThreadId(e.target.value?.toLowerCase() || "")}
          sx={{ flex: 1 }}
          size="small"
        />

        <IconButton type="submit" aria-label="add">
          <AddBoxIcon fontSize="inherit" />
        </IconButton>
      </Stack>
    </Box>
  );
}
