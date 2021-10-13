import type { NextPage } from "next";
import Tweet from "../components/home/Tweet";
import Meta from "../components/Meta";
import Header from "../components/home/Header";
import NewTweet from "../components/home/NewTweet";

import { useConnect, useEagerConnect, useWeb3React } from "client/modules/wallet";
import Account from "components/Account";
import Chain from "components/Chain";

import { useNfts } from "client/io/nfts";
import Avatar from "components/Avatar";

type tweet = {
	author: string;
	content: string;
	date: string;
	id: string;
};

export const tweets: tweet[] = [
	{
		author: "Toto 1",
		content: "First Content asdasd normal content i guess 1 ",
		date: "2hrs ago",
		id: "1",
	},
	{
		author: "Toto 2 Totera tomo arigato",
		content: "Short content 2",
		date: "2hrs ago",
		id: "2",
	},
	{
		author: "Toto 3",
		content:
			"Long content 3 In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.",
		date: "2hrs ago",
		id: "3",
	},
	{ author: "Toto 4", content: "First Content 4", date: "2hrs ago", id: "4" },
	{ author: "Toto 5", content: "First Content 5", date: "2hrs ago", id: "5" },
	{ author: "Toto 6", content: "First Content 6", date: "2hrs ago", id: "6" },
	{ author: "Toto 7", content: "First Content 7", date: "2hrs ago", id: "7" },
	{ author: "Toto 8", content: "First Content 8", date: "2hrs ago", id: "8" },
	{ author: "Toto 9", content: "First Content 9", date: "2hrs ago", id: "9" },
	{
		author: "Toto 10",
		content: "First Content 10",
		date: "2hrs ago",
		id: "10",
	},
	{
		author: "Toto 11",
		content: "First Content 11",
		date: "2hrs ago",
		id: "11",
	},
	{
		author: "Toto 12",
		content: "First Content 12",
		date: "2hrs ago",
		id: "12",
	},
	{
		author: "Toto 13",
		content: "First Content 13",
		date: "2hrs ago",
		id: "13",
	},
	{
		author: "Toto 14",
		content: "First Content 14",
		date: "2hrs ago",
		id: "14",
	},
	{
		author: "Toto 15",
		content: "First Content 15",
		date: "2hrs ago",
		id: "15",
	},

	{
		author: "Toto 16",
		content: "First Content 16",
		date: "2hrs ago",
		id: "16",
	},
	{
		author: "Toto 17",
		content: "First Content 17",
		date: "2hrs ago",
		id: "17",
	},
	{
		author: "Toto 18",
		content: "First Content 18",
		date: "2hrs ago",
		id: "18",
	},
	{
		author: "Toto 19",
		content: "First Content 19",
		date: "2hrs ago",
		id: "19",
	},
];

const Home: NextPage = () => {
	useEagerConnect();
	// TODO handle error
	const { account, active } = useWeb3React();
	const login = useConnect();
	const { data: nfts } = useNfts(account);

	// TODO abstract
	const avatarUrl = (() => {
		// Grab the first, but evenutally grab the chosen one
		const meta = nfts?.result?.find((element) => !!element.metadata);
		if (!meta) {
			return;
		}
		return JSON.parse(meta.metadata)?.image;
	})();

	return (
		<>
			<Meta title={"Firenze"} />
			<main className='relative flex flex-col sm:ml-10 border-gray-800 sm:w-3/5 sm:border-l sm:border-r'>
				<Header />
				<NewTweet />
				<section className='px-4 sm:px-0 divide-y divide-blueGray-500'>
					{tweets.map(({ author, content, date, id }) => (
						<div key={id} className='p-2'>
							<Tweet author={author} content={content} date={date} />
						</div>
					))}
				</section>
				{/* TODO this should be part of a "nav" or "header" */}
				{active && account ? (
					<div className='text-white'>
						Hello <Account /> on <Chain />
						<Avatar url={avatarUrl} />
					</div>
				) : (
					<button onClick={login} className='text-white'>
						Login with metamask
					</button>
				)}
			</main>
		</>
	);
};

export default Home;
