import type { NextPage } from "next";
import invariant from "ts-invariant";
import uniqBy from "lodash.uniqby";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { useSelfID } from "components/SelfID";
import { useWallet } from "components/Wallet";
import Message from "components/Message";
import MessageFromPath from "components/MessageFromPath";
import { IMessage, useSaveMessage } from "dal/message";
import { IMessageArchive, useArchive, useSaveArchive } from "dal/archive";
import { useMailbox, useSaveToMailbox } from "dal/mailbox";
import Composer from "components/Composer";
import NewConversation from "components/NewConversation";

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

export interface IMsgThread {
  // pubkey
  address: string;
  // TODO this is a super place holder
  name?: string;
}

const HARDCODED_THREADS: Array<IMsgThread> = [
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

// TODO abstract away
interface IInboxMessage {
  msg: IMessage;
  pop: () => void;
}

// TODO abstract away
interface IInbox {
  [threadId: string]: Array<IInboxMessage>;
}

const Home: NextPage = () => {
  const { selfID } = useSelfID();
  const { address } = useWallet();

  // This is the inbox, the eventually consistent copy of new messages in the mailbox
  const [inbox, setInbox] = useState<IInbox>({});
  const { mutateAsync: saveMessage } = useSaveMessage();
  const { mutateAsync: SaveToMailbox } = useSaveToMailbox();

  // TODO call this "conversationWith" or something better
  const [receiverAddress, setReceiverAddress] = useState(
    "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase()
  );

  const { data: archive = {}, isLoading } = useArchive();
  const { mutateAsync: saveMessageHistory } = useSaveArchive();
  //const [messages, setMessages] = useState<Array<IMessage>>([]);
  //const [transientMessages, setTransientMessages] = useState<Array<IMessage>>( []);

  useMailbox(address, async (messages) => {
    if (!selfID) {
      console.log("No selfid");
      return;
    }
    const newCids = await Promise.all(
      messages.map(async ({ msg, pop }) => {
        // TODO explain this shit.
        // TLDR: since all messages are stored in the mailbox (the ones we receive and the ones we send),
        // we need to disambugiate
        const threadId = msg.from === address ? msg.to : msg.from;
        setInbox((inbox) => {
          const oldThreadMessages = inbox[threadId] || [];
          // TODO we need to use immer or somethign like that to make this update easier to read
          return { ...inbox, [threadId]: [{ msg, pop }, ...oldThreadMessages] };
        });
        // store the msg in ipfs
        const path = await saveMessage({ msg });
        // TODO show queed messages and their status
        return [threadId, path] as [threadId: string, path: string];
      })
    );

    const archivePatch = {} as IMessageArchive;
    newCids.forEach(([threadId, path]) => {
      const old = archivePatch[threadId] || [];
      archivePatch[threadId] = [path, ...old];
    });

    await saveMessageHistory(archivePatch);

    // remove all messages from q
    //await Promise.all(messages.map(({ pop }) => pop()));
  });

  function onMessageLoad(msg: IMessage) {
    setInbox((inbox) => {
      const byId = (other: IInboxMessage) => msg.id === other.msg.id;

      // TODO explain this shit.
      // TLDR: since all messages are stored in the mailbox (the ones we receive and the ones we send),
      // we need to disambugiate
      const threadId = msg.from === address ? msg.to : msg.from;

      const oldThreadMessages = inbox[threadId] || [];
      const msgAlreadyInCeramic = oldThreadMessages.find(byId);
      if (!msgAlreadyInCeramic) {
        return inbox;
      }

      msgAlreadyInCeramic.pop();

      return {
        ...inbox,
        [threadId]: oldThreadMessages.filter((other) => !byId(other)),
      };
    });
  }

  async function onSend(newMsg: string) {
    if (!address) {
      throw new Error(`we fucked up`);
    }

    // TODO sign and encrypt and change the structure of the mailbox
    // msg = sign(encrypt(payload))
    // pushToMailBox(threadId, msg)

    const msg: IMessage = {
      id: uuid(),
      from: address,
      to: receiverAddress as string,
      date: new Date().toISOString(),
      content: newMsg,
    };

    // send it to the recipient mailbox
    // and also to the sender mailbox, to be processed
    // and archived
    await Promise.all([
      SaveToMailbox({ msg, address: msg.to }),
      SaveToMailbox({ msg, address: msg.from }),
    ]);
  }

  if (!selfID || !address || (isLoading && Object.keys(archive).length === 0)) {
    return <div>loading...</div>;
  }

  const toThread = (pubKey: string) => ({
    address: pubKey.toLowerCase(),
  });

  const threads: Array<IMsgThread> = [
    ...HARDCODED_THREADS,
    ...Object.keys(archive).map(toThread),
    ...Object.keys(inbox).map(toThread),
  ];

  return (
    <div className="page-container">
      <div className="container">
        <div className="contacts__container">
          <div className="contact__item" style={{ background: "grey" }}>
            <NewConversation
              onNew={(newThreadId) => setReceiverAddress(newThreadId)}
            />
          </div>

          {uniqBy(threads, (e) => e.address).map((contact) => (
            <div
              key={contact.address}
              className="contact__item"
              onClick={() => {
                setReceiverAddress(contact.address);
              }}
              style={{
                background:
                  contact.address === receiverAddress ? "grey" : "white",
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
          >
            {uniqBy(archive[receiverAddress] || [], (e) => e).map((cid) => (
              <MessageFromPath
                key={cid}
                path={cid}
                onSuccess={onMessageLoad}
                address={address}
              />
            ))}
            {uniqBy(inbox[receiverAddress], "msg.id").map(({ msg }) => (
              <Message
                key={msg.id}
                msg={msg}
                style={{ background: "grey" }}
                address={address}
              />
            ))}
          </div>
          <div className="messages_composer">
            <Composer onSend={onSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
