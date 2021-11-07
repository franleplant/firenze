import { useIpfs } from "components/IPFS";
import { useSelfID } from "components/SelfID";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient,
} from "react-query";

export interface IMessage {
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

export function useMessage(path: string): UseQueryResult<IMessage> {
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
