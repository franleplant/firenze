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

export function useArchive(): UseQueryResult<Array<string>> {
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

/**
 * the argument that the mutation accepts is
 * "the NEW paths or cids" that you want to add
 * to your message list in ceramic
 */
export function useSaveArchive(): UseMutationResult<
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
      const messageIds = [...(profile.firenzePosts || []), ...cids];
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
