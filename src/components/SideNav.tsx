import { FC, useState } from "react";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Profile", href: "/profile", current: false },
  { name: "Explore", href: "/explore", current: false },
  { name: "More Options", href: "#", current: false },
];

const SideNav: FC = () => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  const handleOpen = () => {};

  return (
    <>
      <nav className="sm:w-1/5 lg:w-1/6 min-w-max">
        <section className="sticky sm:hidden bg-gray-600 text-white p-3 top-0">
          <button
            onClick={() => setOpenSideBar(!openSideBar)}
            className="text-white text-xl sm:hidden z-50"
          >
            +
          </button>
        </section>
        <section
          className={`asdasdasd ${
            openSideBar
              ? " flex h-screen sm:h-auto fixed z-40 w-full flex-row"
              : " hidden "
          } sm:block text-white sm:rounded-lg sm:shadow-lg sm:top-10 top-0 sm:sticky sm:bg-blueGray-600`}
        >
          <div className="bg-blueGray-600 sm:bg-transparent w-2/5 sm:w-auto flex flex-col space-y-2 p-4 pl-0 border-r border-gray-300 sm:border-0">
            {navigation.map((navigation, index) => (
              <div key={index} className="py-1">
                <Link href={navigation.href}>
                  <a className="hover:bg-gray-700 rounded rounded-l-none px-4 py-2">
                    {navigation.name}
                  </a>
                </Link>
              </div>
            ))}
          </div>
          <div
            className="bg-blueGray-600 opacity-60 h-screen w-3/5 sm:hidden"
            onClick={() => setOpenSideBar(!openSideBar)}
          ></div>
        </section>
      </nav>
    </>
  );
};

export default SideNav;
