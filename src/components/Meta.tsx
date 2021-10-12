import Head from "next/head";
import { FC } from "react";

interface IProps {
	title: string;
	name?: string;
	content?: string;
}

const Meta: FC<IProps> = ({ title, name, content }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name={name} content={content ? content : ""} />
			<link rel='icon' href='/favicon.ico' />
		</Head>
	);
};

export default Meta;
