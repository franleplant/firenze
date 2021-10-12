import Head from "next/head";

interface Iprop {
  title: string;
  name?: string;
  content?: string;
}

const Meta = ({ title, name, content }: Iprop) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name={name} content={content ? content : ""} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
