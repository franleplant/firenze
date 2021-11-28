import { Fragment } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

import ConvoItem from "./ConvoItem";

import NewConversation from "components/NewConversation";

export interface IConversation {
  convoId: string;
}

export interface IProps {
  convoId?: string;
  conversations: Array<IConversation>;
  onConversationChange: (convoId: string) => void;
}

export default function ConversationSelect(props: IProps) {
  return (
    <Container>
      <Paper sx={{ padding: "10px" }} elevation={2}>
        <NewConversation
          onNew={(newConvoId) => props.onConversationChange(newConvoId)}
        />
      </Paper>

      <Paper elevation={1} sx={{ width: "100%", height: "100%" }}>
        <List sx={{ width: "100%", height: "100%" }}>
          {props.conversations.map((convo) => (
            <Fragment key={convo.convoId}>
              <ConvoItem
                address={convo.convoId}
                isSelected={convo.convoId === props.convoId}
                onClick={() => {
                  props.onConversationChange(convo.convoId);
                }}
              />
              <Divider variant="inset" component="li" />
            </Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

const Container = styled("div")(({ theme }) => ({
  height: "100%",
  maxWidth: "400px",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
}));
