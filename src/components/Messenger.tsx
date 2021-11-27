import type { NextPage } from "next";
import uniqBy from "lodash.uniqby";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import invariant from "ts-invariant";

import ConvoItem from "./ConvoItem";

import { useSelfID } from "components/SelfID";
import MessageFromPath from "components/MessageFromPath";
import { IMessage, MsgURL, toMsgURL, useSaveMessage } from "dal/message";
import { IArchivedConvos, useArchive, useSaveArchive } from "dal/archive";
import { useMailbox, useSaveToMailbox } from "dal/mailbox";
import Composer from "components/Composer";
import NewConversation from "components/NewConversation";
import { useInbox } from "components/Inbox";
import Message from "components/Message";
import { useAddress, useWeb3Session } from "hooks/web3";
import { useSendQueue } from "components/SendQueue";

//
// TODO
// - UI
// - the consuming messages from Q needs to be more dynamic,
//   - first get the message from the Q and display it
//   - give the user the chance to chose not to store it in ceramic
//   - build UI to display this change in status (msg in memory, msg in ceramic, msg rejected)
// - ENS domains
//
//
//

export interface IConversation {
  // pubkey
  address: string;
  // TODO this is a super place holder
  name?: string;
}

export interface IMessageUI {
  msgURL?: MsgURL;
  timestamp: string;
  convoId: string;
  isArchived?: boolean;
  preview?: IMessage;
}

const HARDCODED_THREADS: Array<IConversation> = [
  {
    address: "0x6f98518890604Aa8aC740E66806bCa93613E3CDe".toLowerCase(),
    name: "lucas",
  },
  {
    address: "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase(),
    name: "fran",
  },
  {
    address: "0x9863d00B0b896A0115D00e919227A26F8f3895E1".toLowerCase(),
    name: "ignacio",
  },
];

export interface IProps {}

export default function Messenger(props: IProps) {
  const { selfID } = useSelfID();
  const address = useAddress();

  const [currentConvoId, setCurrentConvoId] = useState(
    "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase()
  );

  const sendQueue = useSendQueue(currentConvoId);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  function scrollToLast() {
    // Scroll to the bottom to reveal last message
    const element = messagesContainerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  // archive
  const { data: archive = {}, isLoading } = useArchive();
  const { mutateAsync: saveMessageHistory } = useSaveArchive();

  // mailbox
  const { mutateAsync: SaveToMailbox } = useSaveToMailbox();

  // ipfs
  const { mutateAsync: saveMessage, isLoading: isSavingMessage } =
    useSaveMessage();

  // inbox
  const inbox = useInbox({ archive, convoId: currentConvoId });

  // TODO this can be abstracted inside the mailbox module
  useMailbox(address, async (messages) => {
    if (!selfID) {
      console.log("No selfid");
      return;
    }

    const envelopes = messages.map((envelope) => {
      inbox.push(envelope);
      return envelope;
    });

    // TODO abstract away
    const archivePatch = {} as IArchivedConvos;
    envelopes.forEach(({ msg }) => {
      let old = archivePatch[msg.convoId];
      if (!old) {
        old = { messages: [] };
        archivePatch[msg.convoId] = old;
      }
      const newMsg = { url: msg.msgURL, timestamp: msg.timestamp };
      archivePatch[msg.convoId].messages = [newMsg, ...old.messages];
    });

    await saveMessageHistory(archivePatch);
  });

  async function onSend(newMsg: string) {
    if (!address) {
      throw new Error(`we fucked up`);
    }

    const msg: IMessage = {
      id: uuid(),
      from: address,
      to: currentConvoId as string,
      date: new Date().toISOString(),
      content: newMsg,
    };

    sendQueue.push(msg);

    const cid = await saveMessage({ msg });

    const msgURL = toMsgURL(cid.toString());
    sendQueue.setURL(msg, msgURL);

    // send it to the recipient mailbox
    // and also to the sender mailbox, to be processed and archived
    await Promise.all([
      // Put in the recipient's mailbox address,
      // with the convoId if the sender
      SaveToMailbox({
        address: msg.to,
        convoId: msg.from,
        timestamp: msg.date,
        msgURL: `ipfs://${cid.toString()}`,
      }),
      // Put in the sender's mailbox address,
      // with the convoId of the recipient
      SaveToMailbox({
        address: msg.from,
        convoId: msg.to,
        timestamp: msg.date,
        msgURL: `ipfs://${cid.toString()}`,
      }),
    ]);

    sendQueue.pop(msgURL);
  }

  if (!selfID || !address || (isLoading && Object.keys(archive).length === 0)) {
    return <div>loading...</div>;
  }

  const toThread = (pubKey: string) => ({
    address: pubKey.toLowerCase(),
  });

  const threads: Array<IConversation> = [
    ...HARDCODED_THREADS,
    ...Object.keys(archive).map(toThread),
    ...Object.keys(inbox.messages).map(toThread),
  ];

  const messages: Array<IMessageUI> = [
    ...(archive[currentConvoId]?.messages || []).map((archivedMsg) => ({
      msgURL: archivedMsg.url,
      timestamp: archivedMsg.timestamp,
      convoId: currentConvoId,
      isArchived: true,
    })),
    ...(inbox.messages[currentConvoId] || []).map((envelope) => ({
      msgURL: envelope.msg.msgURL,
      timestamp: envelope.msg.timestamp,
      convoId: currentConvoId,
      isArchived: false,
    })),
    ...sendQueue.get(),
  ];

  const sortedMessages = uniqBy(messages, (e) => e.msgURL).sort((a, b) => {
    const dateA = new Date(a.timestamp).valueOf();
    const dateB = new Date(b.timestamp).valueOf();
    return dateA < dateB ? -1 : 1;
  });

  //console.log("Inbox messages", inbox.messages);
  //console.log("UI messages", sortedMessages);
  //

  return (
    <div className="page-container">
      <div className="container">
        <div className="contacts__container">
          <div className="contact__item" style={{ background: "grey" }}>
            <NewConversation
              onNew={(newThreadId) => setCurrentConvoId(newThreadId)}
            />
          </div>

          {uniqBy(threads, (e) => e.address).map((contact) => (
            <ConvoItem
              key={contact.address}
              address={contact.address}
              isSelected={contact.address === currentConvoId}
              onClick={() => {
                setCurrentConvoId(contact.address);
              }}
            />
          ))}
        </div>
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
            {sortedMessages.map((msg, index) => {
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
                    address={address}
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
                  address={address}
                  onSuccess={() => scrollToLast()}
                />
              );
            })}
          </div>
          <div className="messages_composer">
            <Composer onSend={onSend} isSavingMessage={isSavingMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
