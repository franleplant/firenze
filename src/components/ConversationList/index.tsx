import ConvoItem from "./ConvoItem";

import NewConversation from "components/NewConversation";

export interface IConversation {
  convoId: string;
}

export interface IProps {
  convoId: string;
  conversations: Array<IConversation>;
  onConversationChange: (convoId: string) => void;
}

export default function Conversations(props: IProps) {
  return (
    <div className="contacts__container">
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
    </div>
  );
}
