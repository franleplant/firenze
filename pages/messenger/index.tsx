import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import invariant from "ts-invariant";

// We need to make dynamic imports that only happen in the browser because
// the app relies on some browser globals. Eventually we could fix them but
// the reality is that the app itself is largely clientside only, but
// eventually we might need other pages or other backend services and that is where
// next.js keeps being useful
const App = dynamic(() => import("components/App"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const Messenger = dynamic(() => import("components/Messenger"), { ssr: false });

const Home: NextPage = () => {
  const router = useRouter();
  const { convoId } = router.query;
  invariant(typeof convoId === "string" || typeof convoId === "undefined");

  return (
    <App>
      <Messenger
        convoId={convoId}
        onConversationChange={(convoID) => {
          router.push(`/messenger?convoId=${convoID}`, undefined, {
            shallow: true,
          });
        }}
      />
    </App>
  );
};

export default Home;
