import { FC, useState } from "react";

const NewTweet: FC = () => {
	const [input, setInput] = useState<string>("");

	const handleSubmit = async () => {
		console.log(input);
		alert(input);
		setInput("");
	};
	return (
		<section className='w-full py-4 border-b border-yellow-600 px-8'>
			<span className='text-gray-100'>New Tweet</span>
			<textarea
				className='mt-1 block w-full bg-transparent text-white placeholder-gray-400'
				rows={2}
				placeholder='Share your thoughts...'
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<div className='flex justify-end '>
				<button
					onClick={() => handleSubmit()}
					className='px-4 py-2 rounded-lg text-white bg-blueGray-700 hover:bg-blueGray-600'>
					Share
				</button>
			</div>
		</section>
	);
};

export default NewTweet;
