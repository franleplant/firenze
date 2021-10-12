import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { getLibrary } from "client/modules/wallet";
import SideNav from "components/SideNav";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	//if (!!window.ethereum) {
	//window.ethereum.autoRefreshOnNetworkChange = false;
	//}
	return (
		<QueryClientProvider client={queryClient}>
			<Web3ReactProvider getLibrary={getLibrary}>
				<div className='flex flex-col sm:flex-row sm:mx-16 h-full'>
					<SideNav />
					<Component {...pageProps} />
				</div>
			</Web3ReactProvider>
		</QueryClientProvider>
	);
}
export default MyApp;
