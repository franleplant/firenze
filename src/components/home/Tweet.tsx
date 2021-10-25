import Link from "next/link";
import Image from "next/image";
import {
  RefreshIcon,
  HeartIcon,
  ShareIcon,
  AnnotationIcon,
} from "@heroicons/react/outline";
import { FC } from "react";

interface IProps {
  author: string;
  content: string;
  date: string;
}

const Tweet: FC<IProps> = ({ author, content, date }: IProps) => {
  return (
    <div className="px-2 pt-2">
      <section className="h-full flex items-center">
        <Link href={`/${author}`} passHref>
          <div className="flex items-center space-x-2 relative">
            <Image
              alt="team"
              className="w-8 h-8 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
              src="https://dummyimage.com/80x80"
              width="32"
              height="32"
            />
            <h2 className="text-white hover:underline title-font font-medium">
              {author}
            </h2>
          </div>
        </Link>
        <span className="ml-2 text-xs text-gray-400">{date}</span>
      </section>
      <p className="p-1 mt-2 text-sm text-gray-200">{content}</p>
      <section className="mt-2 flex justify-around text-gray-300 text-xs">
        <AnnotationIcon className="w-5 h-5" />
        <RefreshIcon className="w-5 h-5" />
        <HeartIcon className="w-5 h-5" />
        <ShareIcon className="w-5 h-5" />
      </section>
    </div>
  );
};

export default Tweet;
