import Link from "next/link";

interface Iprop {
	author: string;
	content: string;
	date: string;
}

const Tweet = ({ author, content, date }: Iprop) => {
	return (
		<div className='px-2 pt-2'>
			<section className='h-full flex items-center'>
				<Link href={`/${author}`}>
					<div className='flex items-center'>
						<img
							alt='team'
							className='w-8 h-8 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
							src='https://dummyimage.com/80x80'
						/>
						<h2 className='text-white hover:underline title-font font-medium'>{author}</h2>
					</div>
				</Link>
				<span className='ml-2 text-xs text-gray-400'>{date}</span>
			</section>
			<p className='p-1 mt-2 text-sm text-gray-200'>{content}</p>
			<section className='mt-2 flex justify-around text-gray-300 text-xs'>
				<button className='comment'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 hover:text-blue-500'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1}
							d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
						/>
					</svg>
				</button>
				<button className='retweet'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 hover:text-green-500'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1}
							d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
						/>
					</svg>
				</button>
				<button className='like'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 hover:text-red-500'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1}
							d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
						/>
					</svg>
				</button>
				<button className='share'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 hover:text-white'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1}
							d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
						/>
					</svg>
				</button>
			</section>
		</div>
	);
};

export default Tweet;
