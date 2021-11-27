import invariant from "ts-invariant";
import { useRef } from "react";

import Composer from "components/Composer";
import Message from "components/Message";
import MessageFromPath from "components/MessageFromPath";
import { IMessageUI } from "components/Messenger";
import { useAddress } from "hooks/web3";

export interface IProps {
  messages: Array<IMessageUI>;
  onSend: (newMessage: string) => void;
}

export default function Conversation(props: IProps) {
  const ownAddress = useAddress();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  function scrollToLast() {
    // Scroll to the bottom to reveal last message
    const element = messagesContainerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <div className="messages__container">
      <div
        style={{
          //marginTop: "20px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          //maxWidth: "900px",
          background: "#FAFAFA",
          overflowY: "scroll",
          flex: "1",
        }}
        ref={messagesContainerRef}
      >
        {props.messages.map((msg, index) => {
          // is still sending
          if (!msg.msgURL) {
            invariant(
              msg.preview,
              "a message without a url should have a preview"
            );
            return (
              <Message
                key={index}
                status={"sending"}
                timestamp={msg.timestamp}
                msg={msg.preview}
                // TODO review this prop, it is not understanable
                address={ownAddress}
                onMount={() => scrollToLast()}
              />
            );
          }

          return (
            <MessageFromPath
              key={index}
              msgURL={msg.msgURL}
              timestamp={msg.timestamp}
              status={msg.isArchived ? "archived" : "archiving"}
              // TODO review this prop, it is not understanable
              address={ownAddress}
              onSuccess={() => scrollToLast()}
            />
          );
        })}
      </div>
      <div className="messages_composer">
        <Composer onSend={props.onSend} isSavingMessage={false} />
      </div>
    </div>
  );
}
