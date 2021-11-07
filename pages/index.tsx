import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useIpfs } from "components/IPFS";
import { useSelfID } from "components/SelfID";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
  push,
  remove,
  DataSnapshot,
} from "firebase/database";
import { useWallet } from "components/Wallet";
import Message from "components/Message";
import { useSaveMessage } from "dal/message";
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

  const { mutateAsync: saveMessage } = useSaveMessage();
  const { mutateAsync: pushToInbox } = usePushToInbox();

  const [receiverAddress, setReceiverAddress] = useState(
    "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase()
  );

  const [messageIds, setMessageIds] = useState<Array<string>>([]);
  //const [messages, setMessages] = useState<Array<IMessage>>([]);
  //const [transientMessages, setTransientMessages] = useState<Array<IMessage>>( []);

  useInbox(address, async (messages) => {
    if (!selfID) {
      return;
    }
    const cids = await Promise.all(
      messages.map(async ({ msg, pop }) => {
        // store the msg in ipfs
        const path = await saveMessage({ msg });
        // TODO show queed messages and their status
        // remove from q
        pop();

        return path;
      })
    );

    const profile = await selfID.get("basicProfile");
    const messageIds = [...profile.firenzePosts, ...cids];
    await selfID.set("basicProfile", {
      // store references into ceramic
      // TODO it would be nice to store also dates here to make it simpler to order by date
      firenzePosts: messageIds,
    });

    setMessageIds(messageIds);
  });

  if (!selfID || !address) {
    return <div>loading...</div>
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
        {[
          ...messageIds,
          //...transientMessages.map((m) => ({ ...m, transient: true })),
        ].map((cid) => (
          <Message key={cid} path={cid} />
        ))}
      </div>
    </div>
  );
};

export default Home;
