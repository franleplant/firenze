import { useMyPosts } from "client/io/posts";
import { useEagerConnect, useWeb3React } from "client/modules/wallet";
import Post from "components/Post";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import styles from "../../styles/Home.module.css";

const MyPosts: NextPage = () => {
  const router = useRouter();
  const { data: posts } = useMyPosts();
  console.log("My posts", posts);
  return (
    <div className={styles.main}>
      <button onClick={() => router.back()}>Back</button>
      <h1>My Posts</h1>
      {posts && posts.map((post, id) => {
        return (
          <div key={id}>
            <Post {...post} />
          </div>
        )
      })}
    </div>
  )
}
export default MyPosts;