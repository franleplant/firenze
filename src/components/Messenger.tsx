import uniqBy from "lodash.uniqby";
import { v4 as uuid } from "uuid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Paper, Box } from "@mui/material";

import ConversationSelect from "components/ConversationSelect";
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

const HARDCODED_THREADS: Array<IConversation> = [];

export interface IProps {
  convoId?: string;
  onConversationChange: (convoId: string) => void;
}

// TODO explain why all state handling of both converstaion selector and conversation
// are in this component instead of abstracted there
export default function Messenger(props: IProps) {
  // infer if we have a converstation selected and therefore
  // we are showing the conversation messages or we are in the conversation select
  const isConvoMessagesScreen = !!props.convoId;
  const layout = useLayout(isConvoMessagesScreen);

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
    <Box sx={{ height: "100%", overflow: "hidden" }}>
      <Paper
        sx={{ height: "100%", display: "flex", flexDirection: "row" }}
        elevation={1}
        square
      >
        {layout.showConvoSelect && (
          <ConversationSelect
            convoId={currentConvoId}
            onConversationChange={props.onConversationChange}
            conversations={uniqBy(threads, (e) => e.address).map((e) => ({
              convoId: e.address,
            }))}
          />
        )}

        {layout.showConvoMessages && (
          <Conversation
            convoId={currentConvoId}
            messages={messages}
            onSend={onSend}
          />
        )}
      </Paper>
    </Box>
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

export function useLayout(isConvoMessagesScreen: boolean): {
  showConvoSelect: boolean;
  showConvoMessages: boolean;
} {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return {
    showConvoSelect: !isConvoMessagesScreen || isLargeScreen,
    showConvoMessages: isConvoMessagesScreen || isLargeScreen,
  };
}
