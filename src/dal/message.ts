import { useIpfs } from "components/IPFS";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
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
