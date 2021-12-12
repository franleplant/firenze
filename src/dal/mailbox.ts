/**
 * The mailbox is the place where messages not received yet are stored.
 * It updates in real time and it's the heart and bit of the system.
 * The mailbox acts as a in between place for messages, where they
 * after they get sent and before they get received.
 *
 * TODO eventually the mailbox should be more robust and
 * have a policiy about long lived messages that haven't
 * been read in x amount of time.
 */
import { useFirebase } from "components/Firebase";
import { ref, set, onValue, push, remove } from "firebase/database";
import { useEffect, useRef } from "react";
import { useMutation, UseMutationResult } from "react-query";
import { MsgURL } from "./message";

export interface IMailboxMsg {
  convoId: string;
  msgURL: MsgURL;
  timestamp: string;
}

export interface IMailboxEnvelope {
  msg: IMailboxMsg;
  pop: () => void;
}

export function useSaveToMailbox(): UseMutationResult<
  void,
  unknown,
  {
    // whose mailbox?
    address: string;
    // conversation id
    convoId: string;
    timestamp: string;
    msgURL: MsgURL;
  }
> {
  const { db } = useFirebase();

  return useMutation(async ({ address, convoId, timestamp, msgURL }) => {
    const mailboxRef = ref(db, `mailbox/${address}`);
    const key = push(mailboxRef);
    return set(key, { msgURL, timestamp, convoId } as IMailboxMsg);
  });
}

export type OnMessage = (messages: Array<IMailboxEnvelope>) => void;

export function useMailbox(
  address: string | undefined,
  onMessage: OnMessage
): void {
  const { db } = useFirebase();
  const mailbox = ref(db, `mailbox/${address}`);

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!address) {
      return;
    }

    onValue(mailbox, async (snapshot) => {
      // no data in q
      if (!snapshot.hasChildren()) {
        return;
      }

      const messages: Array<IMailboxEnvelope> = [];

      snapshot.forEach((child) => {
        // TODO validations
        const msg = child.val() as IMailboxMsg;

        const pop = () => remove(child.ref);

        messages.push({ msg, pop });
      });

      onMessageRef.current(messages);
    });
  }, [address]);
}
