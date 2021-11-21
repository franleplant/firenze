import { Caip10Link } from '@ceramicnetwork/stream-caip10-link'
import { useIpfs, IContext } from "components/IPFS";
import { useSelfID } from "components/SelfID";
import { IPFS, CID } from "ipfs-core";
// TODO get the CID from multiformats
//https://github.com/multiformats/js-multiformats
import { DID } from "dids";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from "react-query";
import invariant from "ts-invariant";
import type { CID as CIDType } from "ipfs-core/src/block-storage";

// Eventually this will support more protocols like ethereum
export type MsgURL = `ipfs://${string}`;

export function getIpfsPath(url: MsgURL): string {
  const [protocol, id] = url.split("://");
  invariant(protocol === "ipfs", "protocol should be ipfs");
  invariant(id, "empty id");

  return id;
}

export function toMsgURL(id: string, storage: "ipfs" = "ipfs"): MsgURL {
  return `${storage}://${id}`;
}

export interface IMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  date: string;
}

export function useMessage(
  url: MsgURL,
  options?: UseQueryOptions<any, unknown, IMessage>
): UseQueryResult<IMessage> {
  const { ipfs } = useIpfs();
  const { selfID } = useSelfID();
  const path = getIpfsPath(url);

  return useQuery({
    queryKey: `message/${url}`,
    enabled: !!ipfs,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    queryFn: async () => {
      if (!ipfs) {
        throw new Error(`invalid ipfs instance`);
      }
      if (!selfID) {
        throw new Error(`invalid selfID instance`);
      }
      const did = selfID.client.ceramic.did;
      if (!did) {
        throw new Error(`invalid did`);
      }

      const cid = CID.parse(path);
      const payload = await getSigned(cid, ipfs, did,selfID.client.ceramic);
      return payload;
    },
    ...options,
  });
}

// TODO maybe this should be called send message or something like this,
// this represents the creation of a message signed by the active user and
// store it in ipfs
export function useSaveMessage(): UseMutationResult<
  CIDType,
  unknown,
  { msg: IMessage }
> {
  const { ipfs, web3 } = useIpfs();
  const { selfID } = useSelfID();

  return useMutation(async ({ msg }) => {
    if (!ipfs) {
      throw new Error(`invalid ipfs instance`);
    }
    if (!web3) {
      throw new Error(`invalid web3 instance`);
    }
    if (!selfID) {
      throw new Error(`invalid selfID instance`);
    }
    const did = selfID.client.ceramic.did;
    if (!did) {
      throw new Error(`invalid did`);
    }

    const cid = await sign(msg, web3, did);
    return cid;
  });
}

// TODO unit test
export async function sign(
  payload: Record<string, any>,
  web3: NonNullable<IContext["web3"]>,
  did: DID
): Promise<CIDType> {
  const jws = await did.createJWS(payload);
  // we are actually not using the DAG part of the jws
  // because a) we don't really care about, the jws is self contained,
  // b) it requires special plugins out of ipfs making the deployment harder
  // c) it lacks transparent compatibility with other storage mechanisms such as on-chain
  delete jws.link;

  const cid = await web3.put([jsonToFile(jws)], {
    wrapWithDirectory: false,
  });

  invariant(cid, "received a bad cid from web3.put")

  return CID.parse(cid);
}

export async function getSigned(
  cid: CIDType,
  ipfs: NonNullable<IContext["ipfs"]>,
  did: DID,
  ceramic: any
): Promise<IMessage> {
  let chunks: Array<number> = [];
  for await (const buf of ipfs.cat(cid)) {
    chunks = [...chunks, ...(buf as any)];
  }
  const buffer = new Uint8Array(chunks);
  const jwsString = new TextDecoder().decode(buffer);
  const jws = JSON.parse(jwsString);

  // TODO validate the shape
  // TODO handle errors

  const res = await did.verifyJWS(jws);
  const payload = res.payload as IMessage;

  const authorAddress = payload.from
  // TODO make this chainId dynamic
    // TODO support more chains
  const chainId = 4
  const accountLink = await Caip10Link.fromAccount(
      ceramic,
      `${authorAddress}@eip155:${chainId}`,
  )


  // This has extra query params
  const signerDid = res.didResolutionResult.didDocument?.id || ""
  const authorDid = accountLink.did || ""

  // TODO maybe add an extra field so that we can show this in the UI?
  if (signerDid !== authorDid) {
    throw new Error('Corrupted message: it was signed not by the author')
  }

  console.log("res", res);
  return payload;
}

function jsonToFile(json: Record<string, any>): File {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  return new File([blob], "TODO_randomnames.json");
}
