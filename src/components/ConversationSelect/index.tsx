import { styled } from "@mui/material/styles";

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
    <Container className="contacts__container">
      <div className="contact__item" style={{ background: "grey" }}>
        <NewConversation
          onNew={(newConvoId) => props.onConversationChange(newConvoId)}
        />
      </div>

      {props.conversations.map((convo) => (
        <ConvoItem
          key={convo.convoId}
          address={convo.convoId}
          isSelected={convo.convoId === props.convoId}
          onClick={() => {
            props.onConversationChange(convo.convoId);
          }}
        />
      ))}
    </Container>
  );
}

const Container = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
}));
