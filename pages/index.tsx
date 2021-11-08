import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSelfID } from "components/SelfID";
import { v4 as uuid } from "uuid";
import { useWallet } from "components/Wallet";
import Message from "components/Message";
import MessageFromPath from "components/MessageFromPath";
import {
  IMessage,
  useMessageHistory,
  useSaveMessage,
  useSaveMessageHistory,
} from "dal/message";
import { useInbox, usePushToInbox } from "dal/inbox";
import Composer from "components/Composer";

//
// TODO
// - login with wallet (like uniswap) for a better UX
// - UI
// - Index
// - the consuming messages from Q needs to be more dynamic,
//   - first get the message from the Q and display it
//   - give the user the chance to chose not to store it in ceramic
//   - build UI to display this change in status (msg in memory, msg in ceramic, msg rejected)
//
//

interface Window {
  ethereum: any;
}

const Home: NextPage = () => {
  const { selfID } = useSelfID();
  const { address } = useWallet();

  // TODO find better name, these are the messages that were found in the Q
  // and are in the process of being saved into ipfs and ceramic
  // But also i am calling inbox to the q itself, to it does not make sense
  const [inbox, setInbox] = useState<Array<{ msg: IMessage; pop: () => void }>>(
    []
  );
  const { mutateAsync: saveMessage } = useSaveMessage();
  const { mutateAsync: pushToInbox } = usePushToInbox();

  const [receiverAddress, setReceiverAddress] = useState(
    "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase()
  );

  const { data: messageIds = [], isLoading } = useMessageHistory();
  const { mutateAsync: saveMessageHistory } = useSaveMessageHistory();
  //const [messages, setMessages] = useState<Array<IMessage>>([]);
  //const [transientMessages, setTransientMessages] = useState<Array<IMessage>>( []);

  useInbox(address, async (messages) => {
    if (!selfID) {
      return;
    }
    const newCids = await Promise.all(
      messages.map(async ({ msg, pop }) => {
        setInbox((inbox) => [...inbox, { msg, pop }]);
        // store the msg in ipfs
        const path = await saveMessage({ msg });
        // TODO show queed messages and their status
        return path;
      })
    );

    await saveMessageHistory(newCids);

    // remove all messages from q
    //await Promise.all(messages.map(({ pop }) => pop()));
  });

  function onMessageLoad(msg: IMessage) {
    setInbox((inbox) => {
      const byId = (other: { msg: IMessage; pop: () => void }) =>
        msg.id === other.msg.id;

      const msgAlreadyInCeramic = inbox.find(byId);
      if (!msgAlreadyInCeramic) {
        //console.warn(`tried to remove ${JSON.stringify(msg)} from inbox, but didn't find it`);
        return inbox;
      }

      msgAlreadyInCeramic.pop();

      return inbox.filter((other) => !byId(other));
    });
  }

  if (!selfID || !address || (isLoading && messageIds?.length === 0)) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <label>Send to</label>
        <input
          type="text"
          value={receiverAddress}
          onChange={(e) =>
            setReceiverAddress(e.target.value?.toLowerCase() || "")
          }
          style={{
            width: "500px",
            padding: "5px",
            marginLeft: "10px",
          }}
        />
      </div>
      <Composer
        onSend={async (newMsg) => {
          if (!address) {
            throw new Error(`we fucked up`);
          }
          // TODO store this message in our stream too
          await pushToInbox({
            msg: {
              id: uuid(),
              from: address,
              to: receiverAddress,
              date: new Date().toISOString(),
              content: newMsg,
            },
          });
          console.log("DONE!");
        }}
      />
      <div style={{ padding: "10px" }}>
        {inbox.map(({ msg }) => (
          <Message key={msg.id} msg={msg} style={{ background: "grey" }} />
        ))}
        {[...messageIds].reverse().map((cid) => (
          <MessageFromPath key={cid} path={cid} onSuccess={onMessageLoad} />
        ))}
      </div>
    </div>
  );
};

export default Home;
