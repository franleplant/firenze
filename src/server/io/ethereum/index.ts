import { ethers } from "ethers";

export function getProvider(chain: string): ethers.providers.BaseProvider {
  const provider = ethers.getDefaultProvider(chain, {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
  });

  return provider;
}

// TODO this  fn can be abstracted into an isomorphic one,
// maybe we can move it into a domain module
export async function isNftOwner({
  ownerAddress,
  tokenAddress,
  tokenId,
  chain,
}: {
  ownerAddress: string;
  tokenAddress: string;
  tokenId: string;
  chain: string;
}): Promise<boolean> {
  const provider = getProvider(chain);

  // TODO i just copied the erc721 standard, should we do
  // something more fancy with this?
  const abi = [
    "function ownerOf(uint256 _tokenId) external view returns (address)",
  ];

  // https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#IERC721-ownerOf-uint256-
  const contract = new ethers.Contract(tokenAddress, abi, provider);

  const actualOwnerAddress = await contract.ownerOf(tokenId);

  return actualOwnerAddress === ownerAddress;
}
