import Link from "next/link";

export const Header = () => {
	return (
		<header className='hidden sm:block bg-black text-gray-200 sticky top-0 py-2 px-4'>
			<div className='hover:text-white flex'>
				<Link href='/'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6 rounded-full hover:bg-trueGray-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M11 17l-5-5m0 0l5-5m-5 5h12'
						/>
					</svg>
				</Link>
				<span className='text-red-400'>Author</span>
			</div>
		</header>
	);
};

export default Header;
