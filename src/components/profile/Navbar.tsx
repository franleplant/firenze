type NavLink = {
	name: string;
	href: string;
	current: boolean;
};

interface Iprop {
	navigation: NavLink[];
}

const Navbar = ({ navigation }: Iprop) => {
	return (
		<div className='border-b border-blueGray-500 sm:pt-3 text-gray-300 px-3'>
			<nav className='md:ml-auto md:mr-auto flex items-center text-base justify-around'>
				{navigation.map((navLink: NavLink, index) => (
					<a
						key={index}
						href={navLink.href}
						onClick={() => console.log("hello")}
						className={`mr-5 px-1 sm:px-4 hover:text-white rounded-t-md ${
							navLink.current && "  bg-gradient-to-b from-trueGray-900 to-blueGray-700 text-white "
						}`}>
						{navLink.name}
					</a>
				))}
			</nav>
		</div>
	);
};

export default Navbar;
