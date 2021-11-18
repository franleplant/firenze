import { useEffect, useState } from "react";

import { IMailboxEnvelope } from "dal/mailbox";
import { MsgURL } from "dal/message";
import { IArchivedMessages } from "dal/archive";

// TODO abstract away
export interface IInboxMessages {
  [convoId: string]: Array<IMailboxEnvelope>;
}

export interface IInboxArgs {
  archive: IArchivedMessages;
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

  // remove already archived messages from the inbox and also pop them out of the mailbox
  useEffect(() => {
    //if(true) {return}
    // If the inbox is emtpy for that conversation then simply skip this hook
    // if the archive is empty do also the same
    if (!inbox[convoId]?.length || !archive[convoId]?.length) {
      return;
    }

    console.log("inbox effect", inbox[convoId], archive, archive[convoId]);

    // TODO this is super inefficient, make it better
    const isArchived = (targetUrl: MsgURL): boolean => {
      return (archive[convoId] || []).map(({ url }) => url).includes(targetUrl);
    };

    setInbox((inbox) => {
      const convo = inbox[convoId] || [];
      convo.forEach(({ msg, pop }) => {
        if (isArchived(msg.msgURL)) {
          pop();
        }
      });
      return {
        ...inbox,
        [convoId]: convo.filter(({ msg, pop }) => !isArchived(msg.msgURL)),
      };
    });
  }, [inbox, archive, convoId]);

  return {
    messages: inbox,
    push,
  };
}
