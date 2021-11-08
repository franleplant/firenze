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
import { IMessage } from "./message";

export function useSaveToMailbox(): UseMutationResult<
  void,
  unknown,
  {
    msg: IMessage;
    /** whose inbox? by default it goes to the "to" or recipient */
    address?: string;
  }
> {
  const { db } = useFirebase();

  return useMutation(async ({ msg, address }) => {
    const inboxRef = ref(db, `inbox/${address || msg.to}`);
    const key = push(inboxRef);
    return set(key, msg);
  });
}

export type OnMessage = (
  messages: Array<{ pop: () => void; msg: IMessage }>
) => void;

export function useMailbox(address: string | undefined, onMessage: OnMessage) {
  const { db } = useFirebase();
  const inbox = ref(db, `inbox/${address}`);

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!address) {
      return;
    }
    onValue(inbox, async (snapshot) => {
      // no data in q
      if (!snapshot.hasChildren()) {
        return;
      }

      const messages: Array<{ pop: () => {}; msg: IMessage }> = [];
      snapshot.forEach((child) => {
        // TODO validations
        const msg = child.val() as IMessage;

        const pop = () => remove(child.ref);

        messages.push({ msg, pop });
      });

      onMessageRef.current(messages);
    });
  }, [address]);
}
