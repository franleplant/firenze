import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "react-query";
import fetch from "isomorphic-fetch";
import type { ISignedPayload } from "modules/signedPayload";
import type { IProfile } from "pages/api/user/[pubkey]/profile";
import { INFT } from "server/io/moralis";

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
      const res = await fetch(
        `/api/user/${account}/profile?chainId=${chainId}`
      );

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
    const res = await fetch(`/api/user/${data.signer}/profile`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    const body = await res.json();
    return body;
  });
}
