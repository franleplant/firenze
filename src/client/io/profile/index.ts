import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import fetch from "isomorphic-fetch";
import type { ISignedPayload } from "modules/signedPayload";
// TODO this type should come from elsewhere
import type { IProfile } from "pages/api/chain/[chainId]/user/[pubkey]/profile";
import { INFT } from "server/io/moralis";
import useSelfID from "client/modules/wallet/useSelfID";

export type { IProfile };

export function useProfile(
  account: string | null | undefined,
  chainId: number | undefined
  // TODO define and reuse this type
): UseQueryResult<IProfile & { nft: INFT | undefined }> {
  return useQuery({
    enabled: !!account && !!chainId,
    queryKey: `chain/${chainId}/profile/${account}`,
    queryFn: async () => {
      const res = await fetch(`/api/chain/${chainId}/user/${account}/profile`);

      const body = await res.json();
      return body;
    },
  });
}

export function useSaveProfile(): UseMutationResult<
  unknown,
  unknown,
  ISignedPayload<IProfile>
> {
  return useMutation(async (data) => {
    const res = await fetch(
      `/api/chain/${data.payload.chainId}/user/${data.signer}/profile`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const body = await res.json();
    return body;
  });
}

// TODO delete old methods

export interface ICeramicProfile {
  follows: string;
  posts: string;
  replies: string;
  likes: string;
  avatar?: {
    chainId: string;
    tokenAddress: string;
    tokenId: string;
  }
}
export function useCeramicProfile(): UseQueryResult<ICeramicProfile | undefined> {
  const { data: selfID } = useSelfID();
  return useQuery({
    queryKey: `ceramic-profile/${selfID?.id}`,
    enabled: !!(selfID),
    queryFn: async () => {
      if (!(selfID)) {
        console.log("No self ID...")
        return undefined;
      }
      let profile: ICeramicProfile | null = await selfID.get("myProfile");
      if (!profile) {
        console.log("Creating profile...")
        const postsStream = await selfID.client.dataModel.createTile("Posts", {
          posts: []
        });
        profile = {
          follows: "",
          likes: "",
          posts: postsStream.id.toString(),
          replies: "",

        }
        const profileStreamID = await selfID.set("myProfile", profile);
      } else {
        console.log("Profile", profile);
      }
      return profile;
    },
  });
}

export function useUpdateCeramicProfile(): UseMutationResult<unknown, unknown, ICeramicProfile> {
  const { data: selfID } = useSelfID();
  return useMutation(
    async (data) => {
      selfID?.set("Profile", data);
    }
  );
}