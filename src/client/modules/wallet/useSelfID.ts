import { EthereumAuthProvider, SelfID } from '@self.id/web'
import { useQuery, UseQueryResult } from 'react-query';
import { useEagerConnect, useWeb3React } from '.';

export default function useSelfID(): UseQueryResult<SelfID<any> | undefined> {
  useEagerConnect();
  const { account } = useWeb3React();
  return useQuery({
    queryKey: `self-id/${account}` ,
    enabled: !!(account),
    queryFn: async () => {
      if (!(account)) {
        return;
      }
      const selfID = await SelfID.authenticate({
        authProvider: new EthereumAuthProvider(window.ethereum, account!),
        ceramic: process.env.CERAMIC_NODE!,
        // TODO these are custom schemas defined in local ceramic node, need to externalize this
        model: { "definitions": { "myProfile": "kjzl6cwe1jw146o2xt2idr6gjlfhchnc9qsjkkh5a5q2yy50a1lu576163qffp8" }, "schemas": { "Profile": "ceramic://k3y52l7qbv1frxwg2hjdns8vju2ad0n2vpnn0adgd6x6anunk4u4q2knkuhujbrwg", "Post": "ceramic://k3y52l7qbv1frxnpsdf1gv33xmpybp7tke0w9nrkyzerhsj9v8dfyb6iypyb1b37k", "Posts": "ceramic://k3y52l7qbv1fryh7bhf1jvler9i2821rj24a1v8e8uw2l99mz3i3lafju4yvz3y80" }, "tiles": {} }
      });
      return selfID;
    },
  });
}