import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import { create, IPFS } from "ipfs-core";
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

const firebaseConfig = {
  apiKey: "AIzaSyAMu0zDHHwPYPf8JkSeSLLTdedkc6SArQQ",
  authDomain: "firenze-q.firebaseapp.com",
  projectId: "firenze-q",
  storageBucket: "firenze-q.appspot.com",
  messagingSenderId: "698512516258",
  appId: "1:698512516258:web:fed85217ffd972f231e3fb",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

interface IMessage {
  from: string;
  to: string;
  // TODO posts need to be signed with the receiver's public key
  content: string;
  // TODO we should also add a signature from the sender to validate that
  // the sender is effectively the sender
  date: string;

  // TODO specialized
  transient?: boolean;
}

function pushToQ(msg: IMessage) {
  const inboxRef = ref(db, `inbox/${msg.to}`);
  const key = push(inboxRef);
  return set(key, msg);
}

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

// TODO this needs to be a context unique value
function useIpfs(): IPFS | undefined {
  const [ipfs, setIpfs] = useState<IPFS | undefined>();

  useEffect(() => {
    async function effect() {
      const ipfs = await create();
      //console.log("node", ipfs);
      setIpfs(ipfs);
      (window as any).ipfs = ipfs;
    }

    if (!ipfs) {
      effect();
    }
  }, [ipfs]);

  return ipfs;
}

const Home: NextPage = () => {
  const [receiverAddress, setReceiverAddress] = useState(
    "0x7dCE8a09aE403863dbAf9815DE20E4A7Bb18Ae9D".toLowerCase()
  );
  const [newMsg, setNewMsg] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const [messageIds, setMessageIds] = useState<Array<string>>([]);
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [transientMessages, setTransientMessages] = useState<Array<IMessage>>([]);
  const ipfs = useIpfs();

  useEffect(() => {
    async function effect() {
      const addresses = await (window as any).ethereum.enable();

      setSenderAddress(addresses[0]);

      // The following configuration assumes your local node is connected to the Clay testnet
      const self = await SelfID.authenticate({
        authProvider: new EthereumAuthProvider(
          (window as any).ethereum,
          addresses[0]
        ),
        ceramic: "testnet-clay",
        //connectNetwork: 'testnet-clay',
      });
      //self.client.ceramic

      //console.log("self", self);

      //const posts: Array<IMessage> = "0"
      //.repeat(3)
      //.split("")
      //.map((index) => ({
      //// TODO we need to create two entries per single message
      //// and assign it a single message id (uuid),
      //// one will be encrypted for the receiver and one for the sender,
      //// using there respective public keys
      //from: addresses[0],
      //to: "userB",
      //// TODO posts need to be signed with the receiver's public key
      //content: "hello userB",
      //// TODO we should also add a signature from the sender to validate that
      //// the sender is effectively the sender
      //date: new Date().toISOString(),
      //}));

      //const postCids = await Promise.all(
      //posts.map((post) =>
      //ipfs?.add(new TextEncoder().encode(JSON.stringify(post)))
      //)
      //);
      //console.log("posts", posts, postCids);

      //setMessageIds(postCids.map((p) => p!.path));

      //
      // TODO firebase part, abstract
      //
      const inbox = ref(db, `inbox/${addresses[0]}`);
      console.log("inbox key", inbox.key);
      onValue(inbox, async (snapshot) => {
        // no data in q
        if (!snapshot.hasChildren()) {
          console.log("nothing in inbox", snapshot.val());
          return;
        }

        console.log("fetching inbox");
        const cids: Array<string> = [];
        snapshot.forEach((async (child: DataSnapshot) => {
          // TODO validations
          const msg = child.val() as IMessage;
          setTransientMessages(msgs => {
            return [...msgs, msg]
          })

          // remove the transient message
          // TODO make this better
          setTimeout(() => {
            setTransientMessages(m => {
              return m.filter(m => m !== msg)
            })
          }, 2000)
          // store the msg in ipfs
          const { path } = await ipfs!.add(
            new TextEncoder().encode(JSON.stringify(msg))
          );
          // remove the msg from the q
          await remove(child.ref);
          cids.push(path);
        }) as any);

        //const data = snapshot.val();
        //console.log("my inbox", data, snapshot.key, snapshot.ref.toString());

        //const cids = await Promise.all(
        //((Object.values(data) || []) as Array<DataSnapshot>).map(
        //async (snapshot) => {
        //}
        //)
        //);

        const profile = await self.get("basicProfile");
        const messageIds = [...profile.firenzePosts, ...cids];
        await self.set("basicProfile", {
          // store references into ceramic
          firenzePosts: messageIds,
        });

        setMessageIds(messageIds);
      });
      //
      // TODO end firebase part, abstract
      //

      //await self.set("basicProfile", {
      //firenzePosts: postCids.map((p) => p?.path),
      //});

      const profile = await self.get("basicProfile");
      console.log("profile", profile);
      setMessageIds(profile.firenzePosts);
    }

    if (ipfs) {
      effect();
    }
  }, [ipfs]);

  useEffect(() => {
    async function getJson(path: string) {
      let a: Array<number> = [];
      for await (const buf of ipfs!.cat(path)) {
        //console.log(buf);
        a = [...a, ...(buf as any)];
      }

      const b = new Uint8Array(a);
      const s = new TextDecoder().decode(b);
      //console.log("payload", b, s);
      return JSON.parse(s);
    }

    // TODO this should probably be wrapped with react query
    async function effect() {
      const messages = await Promise.all(messageIds.map(getJson));
      //console.log("messages", messages);
      setMessages(messages);
    }

    if (ipfs) {
      effect();
    }
  }, [ipfs, messageIds]);

  console.log("messagePaths", messageIds);

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
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // TODO store this message in our stream too
          await pushToQ({
            from: senderAddress,
            to: receiverAddress,
            date: new Date().toISOString(),
            content: newMsg,
          });
          console.log("DONE!");
        }}
      >
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          style={{
            width: "500px",
            padding: "5px",
            marginLeft: "10px",
          }}
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ padding: "10px" }}>
        {[...messages, ...(transientMessages.map(m => ({...m, transient: true})))]
          .sort((a, b) => (a.date > b.date ? -1 : 1))
          .map((msg, index) => (
            <div
              key={index}
              style={{ padding: "10px", border: "1px solid grey", background: msg.transient ? "grey" : "white" }}
            >
              {JSON.stringify(msg, null, 2)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
