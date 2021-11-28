import { useRef, useState } from "react";
import invariant from "ts-invariant";

import { IMessage, MsgURL } from "dal/message";
import type { IMessageUI } from "components/Messenger";

export interface ISendQueueMessages {
  [convoId: string]: Array<IMessageUI>;
}

export interface ISendQueue {
  push: (msg: IMessage) => void;
  setURL: (msg: IMessage, msgURL: MsgURL) => void;
  pop: (msgURL: MsgURL) => void;
  get: () => Array<IMessageUI>;
  queue: ISendQueueMessages;
}

export function useSendQueue(convoId: string | undefined): ISendQueue {
  const [queue, setQueue] = useState<ISendQueueMessages>({});

  function push(msg: IMessage): void {
    invariant(convoId);
    setQueue((q) => {
      const convoQ = get();
      return {
        ...q,
        [convoId]: [...convoQ, { preview: msg, timestamp: msg.date, convoId }],
      };
    });
  }

  function setURL(msg: IMessage, msgURL: MsgURL): void {
    invariant(convoId);
    setQueue((q) => {
      const convoQ = get();
      return {
        ...q,
        [convoId]: convoQ.map((other) => {
          if (other.preview?.id !== msg.id) {
            return other;
          }

          return {
            ...other,
            msgURL,
          };
        }),
      };
    });
  }

  function pop(msgURL: MsgURL): void {
    invariant(convoId);
    setQueue((q) => {
      const convoQ = get();
      return {
        ...q,
        [convoId]: convoQ.filter((other) => other.msgURL !== msgURL),
      };
    });
  }

  function get(): Array<IMessageUI> {
    return queue[convoId || "fake"] || [];
  }

  return {
    queue: queue,
    get,
    push,
    pop,
    setURL,
  };
}
