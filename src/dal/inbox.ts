import { useFirebase } from "components/Firebase";
import { ref, set, onValue, push, remove } from "firebase/database";
import { useEffect, useRef } from "react";
import { useMutation, UseMutationResult } from "react-query";
import { IMessage } from "./message";

export function usePushToInbox(): UseMutationResult<
  void,
  unknown,
  { msg: IMessage }
> {
  const { db } = useFirebase();

  return useMutation(async ({ msg }) => {
    const inboxRef = ref(db, `inbox/${msg.to}`);
    const key = push(inboxRef);
    return set(key, msg);
  });
}

export type OnMessage = (
  messages: Array<{ pop: () => void; msg: IMessage }>
) => void;

export function useInbox(address: string | undefined, onMessage: OnMessage) {
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
