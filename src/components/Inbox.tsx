import { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

import { IMailboxEnvelope } from "dal/mailbox";
import { MsgURL } from "dal/message";
import { IArchivedConvos } from "dal/archive";

// TODO abstract away
export interface IInboxMessages {
  [convoId: string]: Array<IMailboxEnvelope>;
}

export interface IInboxArgs {
  archive: IArchivedConvos;
  convoId: string;
}

export interface IInbox {
  messages: IInboxMessages;
  push: (envelope: IMailboxEnvelope) => void;
}

// This is the inbox, the eventually consistent copy of new messages in the mailbox
export function useInbox({ archive, convoId }: IInboxArgs): IInbox {
  const [inbox, setInbox] = useState<IInboxMessages>({});

  // push
  function push(envelope: IMailboxEnvelope): void {
    setInbox((inbox) => {
      const oldConvo = inbox[envelope.msg.convoId] || [];
      // TODO we need to use immer or somethign like that to make this update easier to read
      return {
        ...inbox,
        [envelope.msg.convoId]: [envelope, ...oldConvo],
      };
    });
  }

  const currentConvoInbox = inbox[convoId] || [];
  const currentConvoArchive = archive[convoId] || [];

  // remove already archived messages from the inbox and also pop them out of the mailbox
  useDeepCompareEffect(() => {
    //if(true) {return}
    // If the inbox is emtpy for that conversation then simply skip this hook
    // if the archive is empty do also the same
    if (
      currentConvoInbox.length === 0 ||
      currentConvoArchive.messages.length === 0
    ) {
      return;
    }

    console.log("inbox effect", currentConvoInbox, currentConvoArchive);

    // TODO this is super inefficient, make it better
    const isArchived = (targetUrl: MsgURL): boolean => {
      return currentConvoArchive.messages
        .map(({ url }) => url)
        .includes(targetUrl);
    };

    setInbox((inbox) => {
      currentConvoInbox.forEach(({ msg, pop }) => {
        if (isArchived(msg.msgURL)) {
          pop();
        }
      });
      return {
        ...inbox,
        [convoId]: currentConvoInbox.filter(
          ({ msg }) => !isArchived(msg.msgURL)
        ),
      };
    });
  }, [currentConvoInbox, currentConvoArchive, convoId]);

  return {
    messages: inbox,
    push,
  };
}
