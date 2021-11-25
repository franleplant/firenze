import { useRef, useState } from "react";

import { IMessage, MsgURL } from "dal/message";
import type { IMessageUI } from "components/Messenger";

export interface ISendQueue {
  [convoId: string]: Array<IMessageUI>;
}

export function useSendQueue(convoId: string) {
  const [queue, setQueue] = useState<ISendQueue>({});

  function push(msg: IMessage): void {
    setQueue((q) => {
      const convoQ = get();
      return {
        ...q,
        [convoId]: [...convoQ, { preview: msg, timestamp: msg.date, convoId }],
      };
    });
  }

  function setURL(msg: IMessage, msgURL: MsgURL): void {
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
    setQueue((q) => {
      const convoQ = get();
      return {
        ...q,
        [convoId]: convoQ.filter((other) => other.msgURL !== msgURL),
      };
    });
  }

  function get(): Array<IMessageUI> {
    return queue[convoId] || [];
  }

  return {
    queue: queue,
    get,
    push,
    pop,
    setURL,
  };
}
