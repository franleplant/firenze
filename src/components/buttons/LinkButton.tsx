import { FC } from "react";
import Link from "next/link";

interface IProps {
  children: string;
  href: string;
  className?: string;
}

const defaultClassName = "text-gray-300 py-1 px-2";

const LinkButton: FC<IProps> = ({
  children,
  href,
  className = defaultClassName,
}) => {
  return (
    <Link href={href}>
      <a className={`hover:underline ${className}`}>{children}</a>
    </Link>
  );
};

export default LinkButton;
