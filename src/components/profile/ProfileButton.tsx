interface Iprop {
	text: string;
}

const ProfileButton = ({ text }: Iprop) => {
	return (
		<button className='px-2 py-1 sm:px-4 sm:py-2 rounded-3xl bg-blueGray-400 text-white hover:bg-blueGray-300 mx-1'>
			{text}
		</button>
	);
};

export default ProfileButton;
