import { useMutation, UseMutationResult } from "react-query";
import fetch from "isomorphic-fetch";
// TODO move this elsewhere
import type { ISignedPayload, IProfile } from "pages/api/user/[pubkey]/profile";

export type { ISignedPayload, IProfile };

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
