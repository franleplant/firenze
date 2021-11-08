import { useIpfs } from "components/IPFS";
import { useSelfID } from "components/SelfID";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient,
  UseQueryOptions,
} from "react-query";

export interface IMessage {
  id: string;
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

export function useMessage(
  path: string,
  options?: UseQueryOptions<any, unknown, IMessage>
): UseQueryResult<IMessage> {
  const { ipfs } = useIpfs();

  return useQuery({
    queryKey: `message/${path}`,
    enabled: !!ipfs,
    queryFn: async () => {
      if (!ipfs) {
        return;
      }
      let chunks: Array<number> = [];
      for await (const buf of ipfs.cat(path)) {
        chunks = [...chunks, ...(buf as any)];
      }

      const buffer = new Uint8Array(chunks);
      const str = new TextDecoder().decode(buffer);
      // TODO validate the shape
      // TODO handle errors
      return JSON.parse(str);
    },
    ...options,
  });
}

export function useSaveMessage(): UseMutationResult<
  string,
  unknown,
  { msg: IMessage }
> {
  const { ipfs } = useIpfs();

  return useMutation(async ({ msg }) => {
    if (!ipfs) {
      throw new Error(`invalid ipfs instance`);
    }
    const { path } = await ipfs.add(
      new TextEncoder().encode(JSON.stringify(msg))
    );

    return path;
  });
}

export function useMessageHistory(): UseQueryResult<Array<string>> {
  const { selfID } = useSelfID();
  return useQuery({
    queryKey: `messageHistory`,
    enabled: !!selfID,
    queryFn: async () => {
      if (!selfID) {
        return;
      }
      const profile = await selfID.get("basicProfile");
      return profile.firenzePosts;
    },
  });
}

export function useSaveMessageHistory(): UseMutationResult<
  Array<string>,
  unknown,
  Array<string>
> {
  const queryClient = useQueryClient();
  const { selfID } = useSelfID();
  return useMutation(
    async (cids) => {
      if (!selfID) {
        return [];
      }

      const profile = await selfID.get("basicProfile");
      const messageIds = [...profile.firenzePosts, ...cids];
      await selfID.set("basicProfile", {
        // store references into ceramic
        // TODO it would be nice to store also dates here to make it simpler to order by date
        // TODO this does not scale at all.
        // We need some sort of block or separation of ids to make it possible to "fetch the last 1000 posts" and then
        // decide if the user wants the others (or maybe its already cached)
        // Soemthing like this might work
        //
        // ListOfMessages = [m1_cid, m2_cid, ..., mn_cid, nextListOfMessagesStream]
        // And so with this you get the first n messages, and if you want more then you just
        // fetch the next stream. And so on and so forth.
        //
        // Also, it would be nice to segment messages by conversations or threads, i.e. conversationWith: [pubKey: string]: ListOfMessages
        //
        firenzePosts: messageIds,
      });

      return messageIds;
    },
    {
      onSuccess: (newMessageIds) => {
        queryClient.setQueryData(`messageHistory`, newMessageIds);
      },
    }
  );
}
