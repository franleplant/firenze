import { ethers } from "ethers";
import invariant from "ts-invariant";

export interface ISignedPayload<T> {
  /** pub key of the user owner of this payload */
  signer: string;
  /** sign(hash(payload))*/
  signature: string;

  payload: T;
}

export async function sign<T>(
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  payload: T
): Promise<ISignedPayload<T>> {
  const signer = provider.getSigner();
  const signature = await signer?.signMessage(JSON.stringify(payload));
  invariant(!!signature, "bad signature");

  return {
    signer: address,
    signature,
    payload: payload,
  };
}

export function isValid<T>(signedPayload: ISignedPayload<T>): boolean {
  const { signer, signature, payload } = signedPayload;

  // Validate the cryptographic signature
  const expectedSigner = ethers.utils.verifyMessage(
    JSON.stringify(payload),
    signature
  );

  return expectedSigner !== signer;
}
