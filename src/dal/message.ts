import { CeramicClient } from "@ceramicnetwork/http-client";
import { PublicID, Core } from "@self.id/core";
import { useIpfs, IContext } from "components/IPFS";
import { useSelfID } from "components/SelfID";
import { CID } from "ipfs-core";
// TODO get the CID from multiformats
//https://github.com/multiformats/js-multiformats
import { DID } from "dids";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  useQueryClient,
} from "react-query";
import invariant from "ts-invariant";
import type { CID as CIDType } from "ipfs-core/src/block-storage";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";
import type { JWE } from "did-jwt";

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
      invariant(ipfs);
      invariant(selfID);
      const did = selfID.client.ceramic.did;
      invariant(did);

      const cid = CID.parse(path);
      const payload = await get(
        { cid },
        { ipfs, did, ceramic: selfID.client.ceramic }
      );
      return payload;
    },
    ...options,
  });
}

export function useSaveMessage(): UseMutationResult<
  CIDType,
  unknown,
  { msg: IMessage }
> {
  const queryClient = useQueryClient();
  const { web3 } = useIpfs();
  const { selfID } = useSelfID();

  return useMutation(
    async ({ msg }) => {
      invariant(web3);
      invariant(selfID);
      const did = selfID.client.ceramic.did;
      invariant(did);

      // TODO chainId
      const cid = await save(
        { payload: msg, chainId: 4 },
        { web3, did, ceramic: selfID.client.ceramic }
      );
      return cid;
    },
    {
      onSuccess: (cid, { msg }) => {
        const url = toMsgURL(cid.toString(), "ipfs");
        queryClient.setQueryData(`message/${url}`, msg);
      },
    }
  );
}

// TODO unit test
export async function save(
  params: {
    payload: IMessage;
    // TODO chainId
    chainId: number;
    encrypted?: boolean;
  },
  deps: {
    web3: NonNullable<IContext["web3"]>;
    did: DID;
    ceramic: CeramicClient;
  }
) {
  const { payload } = params;

  // TODO make encryption optioinal
  const senderDid = deps.did.id;
  const recipientDid = await getDidFromAddress({
    address: payload.to,
    chainId: params.chainId,
    ceramic: deps.ceramic,
  });

  const jwe = await deps.did.createDagJWE(payload, [senderDid, recipientDid]);
  const jws = await deps.did.createJWS(jwe);
  // we are actually not using the DAG part of the jws
  // because a) we don't really care about, the jws is self contained,
  // b) it requires special plugins out of ipfs making the deployment harder
  // c) it lacks transparent compatibility with other storage mechanisms such as on-chain
  delete jws.link;

  const cid = await deps.web3.put([jsonToFile(jws)], {
    wrapWithDirectory: false,
  });

  invariant(cid, "received a bad cid from web3.put");

  return CID.parse(cid);
}

export async function get(
  params: {
    cid: CIDType;
  },
  deps: {
    ipfs: NonNullable<IContext["ipfs"]>;
    did: DID;
    ceramic: CeramicClient;
  }
): Promise<IMessage> {
  const { cid } = params;

  const jws = await getJsonFromIpfs(cid, deps.ipfs);

  // TODO validate the shape
  // TODO handle errors

  const res = await deps.did.verifyJWS(jws);
  const payload = res.payload;

  let msg: IMessage;
  // duck type
  if (payload?.to && payload?.from) {
    // this means that the message was public
    msg = payload as IMessage;
  } else {
    // duck type
    invariant(payload?.protected, "invalid encrypted payload");
    // this means that the message was encrypted
    const jwe = payload as JWE;
    msg = (await deps.did.decryptDagJWE(jwe)) as IMessage;
    // TODO runtim type checks / schema validation
  }

  const signerDid = res.didResolutionResult.didDocument?.id || "";
  const authorCryptoAccounts = await getCryptoAccounts(signerDid);

  const authorAddress = msg.from;
  // determine whether the signer of the message is the author or not,
  // we would expect they are the same and nobody is posing as anybody else,
  // if it is not trusted then we throw and error
  //
  // it has the shape `${authorAddress}@eip155:${chainId}`
  const isTrusted = Object.keys(authorCryptoAccounts).some((addressLink) =>
    addressLink.startsWith(authorAddress)
  );

  // This has extra query params

  // TODO maybe add an extra field so that we can show this in the UI?
  // TODO make this feature flagable for testing
  if (!isTrusted) {
    throw new Error("Corrupted message: it was signed not by the author");
  }

  return msg;
}

function jsonToFile(json: Record<string, any>): File {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
  return new File([blob], "TODO_randomnames.json");
}

export async function getJsonFromIpfs(
  cid: CIDType,
  ipfs: NonNullable<IContext["ipfs"]>
): Promise<any> {
  let chunks: Array<number> = [];
  for await (const buf of ipfs.cat(cid)) {
    chunks = [...chunks, ...(buf as any)];
  }
  const buffer = new Uint8Array(chunks);
  const jwsString = new TextDecoder().decode(buffer);
  const jws = JSON.parse(jwsString);

  return jws;
}

/**
 * Example of return value
 * {
 *   "0x19552767c2cd3c00745c7bef792e73d92444235f@eip155:4": "ceramic://k2t6wyse1ukyadyhnzvyufabw604wj0n37sw8ba163ug5m5jf8itxdc2ieync1"
 * }
 */
export async function getCryptoAccounts(
  did: string
): Promise<Record<string, string>> {
  const core = new Core({
    // TODO env variable
    ceramic: "testnet-clay",
  });

  const publicId = new PublicID({ core, id: did });

  const cryptoAccounts = await publicId.get("cryptoAccounts");
  invariant(cryptoAccounts, "unexpected crypto accounts");
  return cryptoAccounts;
}

export async function getDidFromAddress(params: {
  address: string;
  chainId: number;
  blockchain?: "ethereum";
  ceramic: CeramicClient;
}): Promise<string> {
  const { blockchain = "ethereum" } = params;
  invariant(
    blockchain === "ethereum",
    "only ethereum compatible chains are supported"
  );

  const accountLink = await Caip10Link.fromAccount(
    params.ceramic as any,
    `${params.address}@eip155:${params.chainId}`
  );

  const did = accountLink.did;
  invariant(did, "error getting did");
  return did;
}
