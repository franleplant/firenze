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

const TEMP_KEY = "firenze.message.v3";

export interface IArchivedConvo {
  url: MsgURL;
  timestamp: string;
}

export interface IArchivedConvos {
  [convoID: string]: {
    messages: Array<IArchivedConvo>;
  };
}

export function useArchive(): UseQueryResult<IArchivedConvos> {
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
      //await selfID.set("basicProfile", { [TEMP_KEY]: {}, });
      //console.log("clean slated the archive")

      //return {
      //"0x7dce8a09ae403863dbaf9815de20e4a7bb18ae9d": [
      //{
      //url: "ipfs://bagcqcerammm4rci4jsrk2zs5xm5b4h6girwjv24xkpc3r5hqkpvxxqza42sq",
      //timestamp: new Date().toISOString(),
      //},
      //],
      //} as IArchivedMessages;

      const myConversations: IArchivedConvos =
        (await selfID.get("myConversations")) || {};
      console.log("archive", myConversations);
      return myConversations;
    },
  });
}

/**
 * the argument that the mutation accepts is
 * "the NEW paths or cids" that you want to add
 * to your message list in ceramic
 */
export function useSaveArchive(): UseMutationResult<
  IArchivedConvos,
  unknown,
  IArchivedConvos
> {
  const queryClient = useQueryClient();
  const { selfID } = useSelfID();
  return useMutation(
    async (newMessages) => {
      if (!selfID) {
        return {};
      }

      const myConversations: IArchivedConvos =
        (await selfID.get("myConversations")) || {};

      Object.entries(newMessages).forEach(([convoId, newMessages]) => {
        // TODO this merge logic needs to be much more robust
        const oldConvo = myConversations[convoId] || { messages: [] };
        myConversations[convoId] = {
          messages: [...newMessages.messages, ...oldConvo.messages],
        };
      });

      // store references into ceramic
      // TODO this does not scale at all.
      // We need some sort of block or separation of ids to make it possible to "fetch the last 1000 posts" and then
      // decide if the user wants the others (or maybe its already cached)
      // Soemthing like this might work
      //
      // ListOfMessages = [m1_cid, m2_cid, ..., mn_cid, nextListOfMessagesStream]
      // And so with this you get the first n messages, and if you want more then you just
      // fetch the next stream. And so on and so forth.
      //
      await selfID.set("myConversations", myConversations);
      return myConversations;
    },
    {
      onSuccess: (messages: IArchivedConvos) => {
        queryClient.setQueryData(`messageHistory`, messages);
      },
    }
  );
}
