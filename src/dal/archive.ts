/**
 * This is the Archive, a decentralized
 * secure storage, but slow. Everything ends up in the archive,
 * eventually.
 * */
import { useSelfID } from "components/SelfID";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
  useQueryClient,
} from "react-query";
import { MsgURL } from "./message";

export interface IArchivedMessage {
  url: MsgURL;
  timestamp: string;
}

export interface IArchivedMessages {
  [pubKey: string]: Array<IArchivedMessage>;
}

export function useArchive(): UseQueryResult<IArchivedMessages> {
  const { selfID } = useSelfID();
  return useQuery({
    queryKey: `messageHistory`,
    enabled: !!selfID,
    queryFn: async () => {
      if (!selfID) {
        return;
      }
      // TODO this should be not needed in the long run,
      // uncomment to remove all messages
      //await selfID.set("basicProfile", { ["firenze.messages"]: {}, });

      return {
        "0x7dce8a09ae403863dbaf9815de20e4a7bb18ae9d": [
          {
            url: "ipfs://bagcqcerammm4rci4jsrk2zs5xm5b4h6girwjv24xkpc3r5hqkpvxxqza42sq",
            timestamp: new Date().toISOString(),
          },
        ],
      } as IArchivedMessages;

      //const profile = await selfID.get("basicProfile");
      //return profile?.["firenze.messages"] || {};
    },
  });
}

/**
 * the argument that the mutation accepts is
 * "the NEW paths or cids" that you want to add
 * to your message list in ceramic
 */
export function useSaveArchive(): UseMutationResult<
  IArchivedMessages,
  unknown,
  IArchivedMessages
> {
  const queryClient = useQueryClient();
  const { selfID } = useSelfID();
  return useMutation(
    async (newMessages) => {
      if (!selfID) {
        return {};
      }

      const profile = await selfID.get("basicProfile");
      const archivedMessages = profile?.["firenze.messages"] || {};

      Object.entries(newMessages).forEach(([threadId, messages]) => {
        // TODO this merge logic needs to be much more robust
        const oldThreadMessages = archivedMessages[threadId] || [];
        archivedMessages[threadId] = [...messages, ...oldThreadMessages];
      });

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
        ["firenze.messages"]: archivedMessages,
      });

      return archivedMessages;
    },
    {
      onSuccess: (messages: IArchivedMessages) => {
        queryClient.setQueryData(`messageHistory`, messages);
      },
    }
  );
}
