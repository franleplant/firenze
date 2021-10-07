import Link from "next/link";

interface Iprop {
	author: string;
	content: string;
	date: string;
}

const Tweet = ({ author, content, date }: Iprop) => {
	return (
		<div className=''>
			<section className='h-full flex items-center '>
				<img
					alt='team'
					className='w-8 h-8 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
					src='https://dummyimage.com/80x80'
				/>
				<Link href={`/${author}`}>
					<div className='flex-grow'>
						<h2 className='text-white hover:underline title-font font-medium'>{author}</h2>
					</div>
				</Link>
			</section>
			<p className='p-1 mt-2 text-sm text-gray-200'>{content}</p>
		</div>
	);
};

export default Tweet;
