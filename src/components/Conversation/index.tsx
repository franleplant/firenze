import invariant from "ts-invariant";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { useAddress } from "hooks/web3";
import { IMessageUI } from "components/Messenger";
import MessageFromPath from "components/MessageFromPath";
import Message from "components/Message";
import Composer from "components/Composer";

export interface IProps {
  convoId?: string;
  messages: Array<IMessageUI>;
  onSend: (newMessage: string) => void;
}

export default function Conversation(props: IProps) {
  const router = useRouter();
  const ownAddress = useAddress();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  function scrollToLast() {
    // Scroll to the bottom to reveal last message
    const element = messagesContainerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  // TODO abstract
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Stack sx={{ flex: 1 }}>
      {!isLargeScreen && (
        <Paper elevation={2}>
          <Button
            variant="text"
            onClick={() =>
              router.push("/messenger", undefined, { shallow: true })
            }
          >
            Back
          </Button>
        </Paper>
      )}
      <Paper
        sx={{
          flex: 1,
          overflowY: "scroll",
          width: "100%",
          // TODO this does not work
          scrollbarColor: "hsla(0,0%,100%,.16) transparent",
        }}
        elevation={10}
        square
        ref={messagesContainerRef}
      >
        <Stack
          spacing={1}
          direction={"column"}
          sx={{ flex: 1, padding: "10px" }}
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
        </Stack>
      </Paper>
      {props.convoId && (
        <div className="messages_composer">
          <Composer onSend={props.onSend} isSavingMessage={false} />
        </div>
      )}
    </Stack>
  );
}
