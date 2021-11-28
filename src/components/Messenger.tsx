import type { NextPage } from "next";
import uniqBy from "lodash.uniqby";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import ConversationList from "components/ConversationList";
import Conversation from "components/Conversation";
import { useSelfID } from "components/SelfID";
import { IMessage, MsgURL, toMsgURL, useSaveMessage } from "dal/message";
import { IArchivedConvos, useArchive, useSaveArchive } from "dal/archive";
import { useMailbox, useSaveToMailbox } from "dal/mailbox";
import { IInbox, useInbox } from "components/Inbox";
import { useAddress, useWeb3Session } from "hooks/web3";
import { ISendQueue, useSendQueue } from "components/SendQueue";

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

export interface IProps {
  convoId?: string;
  onConversationChange: (convoId: string) => void;
}

export default function Messenger(props: IProps) {
  const { selfID } = useSelfID();
  const address = useAddress();

  const currentConvoId = props.convoId;

  const sendQueue = useSendQueue(currentConvoId);

  // archive
  const { data: archive = {}, isLoading } = useArchive();
  const { mutateAsync: saveMessageHistory } = useSaveArchive();

  // mailbox
  const { mutateAsync: SaveToMailbox } = useSaveToMailbox();

  // ipfs
  const { mutateAsync: saveMessage } = useSaveMessage();

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

  const toThread = (pubKey: string) => ({
    address: pubKey.toLowerCase(),
  });

  const threads: Array<IConversation> = [
    ...HARDCODED_THREADS,
    ...Object.keys(archive).map(toThread),
    ...Object.keys(inbox.messages).map(toThread),
  ];

  const messages = useCombineMessages({
    convoId: currentConvoId,
    archive,
    inbox,
    sendQueue,
  });

  // TODO improve
  if (isLoading && Object.keys(archive).length === 0) {
    return <div>loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <ConversationList
          convoId={currentConvoId}
          onConversationChange={props.onConversationChange}
          conversations={uniqBy(threads, (e) => e.address).map((e) => ({
            convoId: e.address,
          }))}
        />
      </div>
      <Conversation messages={messages} onSend={onSend} />
    </div>
  );
}

// TODO memoize
export function useCombineMessages({
  convoId,
  archive,
  inbox,
  sendQueue,
}: {
  convoId: string | undefined;
  archive: IArchivedConvos;
  inbox: IInbox;
  sendQueue: ISendQueue;
}): Array<IMessageUI> {
  if (!convoId) {
    return [];
  }

  const archivedMsgs = archive[convoId]?.messages || [];
  const inboxMsgs = inbox.messages[convoId] || [];

  const messages: Array<IMessageUI> = [
    ...archivedMsgs.map((archivedMsg) => ({
      msgURL: archivedMsg.url,
      timestamp: archivedMsg.timestamp,
      convoId,
      isArchived: true,
    })),
    ...inboxMsgs.map((envelope) => ({
      msgURL: envelope.msg.msgURL,
      timestamp: envelope.msg.timestamp,
      convoId,
      isArchived: false,
    })),
    ...sendQueue.get(),
  ];

  const sortedMessages = uniqBy(messages, (e) => e.msgURL).sort((a, b) => {
    const dateA = new Date(a.timestamp).valueOf();
    const dateB = new Date(b.timestamp).valueOf();
    return dateA < dateB ? -1 : 1;
  });

  return sortedMessages;
}
