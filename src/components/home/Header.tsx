import Link from "next/link";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <header className="hidden sm:block bg-black text-gray-200 sticky top-0 py-2 px-4">
      <div className="hover:text-white">
        <Link href="/">Home</Link>
      </div>
    </header>
  );
};

export default Header;
