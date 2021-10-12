import type { NextPage } from "next";
import Tweet from "../../components/home/Tweet";
import Meta from "../../components/Meta";
import Header from "../../components/profile/Header";
import Profile from "../../components/profile/Profile";
import NewTweet from "../../components/home/NewTweet";
import { tweets } from "../index";

const Home: NextPage = () => {
	return (
		<>
			<Meta title={"Author"} />
			<main className='relative flex flex-col sm:ml-10 border-gray-800 sm:w-3/5 sm:border-l sm:border-r'>
				<Header />
				<Profile />
				<section className='px-4 sm:px-0 divide-y divide-blueGray-800'>
					{tweets.map(({ author, content, date, id }) => (
						<div key={id} className='p-2'>
							<Tweet author={author} content={content} date={date} />
						</div>
					))}
				</section>
			</main>
		</>
	);
};

export default Home;
