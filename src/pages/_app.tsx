import "../styles/globals.css";
import type { AppProps } from "next/app";
import SideNav from "../components/SideNav";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div className='flex flex-col sm:flex-row sm:mx-16 h-full'>
			<SideNav />
			<Component {...pageProps} />
		</div>
	);
}
export default MyApp;
