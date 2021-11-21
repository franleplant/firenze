import type { NextPage } from "next";
import uniqBy from "lodash.uniqby";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { useSelfID } from "components/SelfID";
import { useWallet } from "components/Wallet";
import MessageFromPath from "components/MessageFromPath";
import { IMessage, MsgURL, useSaveMessage } from "dal/message";
import { IArchivedMessages, useArchive, useSaveArchive } from "dal/archive";
import { useMailbox, useSaveToMailbox } from "dal/mailbox";
import Composer from "components/Composer";
import NewConversation from "components/NewConversation";
import { useInbox } from "components/Inbox";

//
// TODO
// - login with wallet (like uniswap) for a better UX
// - UI
// - Index
// - the consuming messages from Q needs to be more dynamic,
//   - first get the message from the Q and display it
//   - give the user the chance to chose not to store it in ceramic
//   - build UI to display this change in status (msg in memory, msg in ceramic, msg rejected)
// - ENS domains
//
//
//

interface Window {
  ethereum: any;
}

export interface IConversation {
  // pubkey
  address: string;
  // TODO this is a super place holder
  name?: string;
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

const Home: NextPage = () => {
  const { selfID } = useSelfID();
  const { address } = useWallet();

  const [currentConvoId, setCurrentConvoId] = useState(
    "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase()
  );

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
    const archivePatch = {} as IArchivedMessages;
    envelopes.forEach(({ msg }) => {
      const old = archivePatch[msg.convoId] || [];
      archivePatch[msg.convoId] = [
        { url: msg.msgURL, timestamp: msg.timestamp },
        ...old,
      ];
    });

    await saveMessageHistory(archivePatch);
  });

  async function onSend(newMsg: string) {
    if (!address) {
      throw new Error(`we fucked up`);
    }

    // TODO sign and encrypt and change the structure of the mailbox
    // msg = sign(encrypt(payload))
    // path = pushToIpfs(msg)
    // pushToMailBox(convoId, path)

    // TODO store this msg in memory to render it asap
    const msg: IMessage = {
      id: uuid(),
      from: address,
      to: currentConvoId as string,
      date: new Date().toISOString(),
      content: newMsg,
    };

    const cid = await saveMessage({ msg });

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

  interface IMessageUI {
    msgURL: MsgURL;
    timestamp: string;
    convoId: string;
    isArchived: boolean;
  }

  const messages: Array<IMessageUI> = [
    ...(archive[currentConvoId] || []).map((archivedMsg) => ({
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
  ];

  const sortedMessages = uniqBy(messages, (e) => e.msgURL).sort((a, b) => {
    const dateA = new Date(a.timestamp).valueOf();
    const dateB = new Date(b.timestamp).valueOf();
    return dateA < dateB ? -1 : 1;
  });

  console.log("Inbox messages", inbox.messages);
  console.log("UI messages", sortedMessages);

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
            <div
              key={contact.address}
              className="contact__item"
              onClick={() => {
                setCurrentConvoId(contact.address);
              }}
              style={{
                background:
                  contact.address === currentConvoId ? "grey" : "white",
              }}
            >
              <div>{contact.address}</div>
              <div>{contact.name}</div>
            </div>
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
            {sortedMessages.map((msg) => (
              <MessageFromPath
                key={msg.msgURL}
                path={msg.msgURL}
                isArchived={msg.isArchived}
                // TODO review this prop, it is not understanable
                address={address}
                onSuccess={() => scrollToLast()}
              />
            ))}
          </div>
          <div className="messages_composer">
            <Composer onSend={onSend} isSavingMessage={isSavingMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
