import Navbar from "./Navbar";
import ProfileButton from "./ProfileButton";

const navigation = [
	{ name: "Tweets", href: "#", current: true },
	{ name: "Media", href: "/asd", current: false },
	{ name: "Likes", href: "#", current: false },
	{ name: "More", href: "#", current: false },
];

const Profile = () => {
	return (
		<>
			<div className='flex flex-row justify-between p-4 '>
				<section>
					<img
						alt='team'
						className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
						src='https://dummyimage.com/80x80'
					/>
					<h2 className='text-white sm:text-xl mt-5'>Author username</h2>
				</section>
				<section className='space-y-2 space-x-2'>
					<ProfileButton text={"..."} />
					<ProfileButton text={"Options"} />
					<ProfileButton text={"Following"} />
				</section>
			</div>
			<Navbar navigation={navigation} />
		</>
	);
};

export default Profile;
