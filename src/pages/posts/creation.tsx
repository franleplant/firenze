import { useCreatePost } from "client/io/posts";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import styles from "../../styles/Home.module.css";

const CreatePost: NextPage = () => {
  const router = useRouter();
  const createPost = useCreatePost();
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      content: {
        value: string
      };
      image: {
        value: string
      };
    };
    const content = target.content.value;
    const image = target.image.value;
    createPost.mutate({
      content,
      images: image ? [image] : []
    });
  }
  return (
    <div className={styles.main}>
      <button onClick={() => router.back()}>Back</button>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="content">Content</label>
          <input id="content" name="content" type="text" required />
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input id="image" name="image" type="text" required />
        </div>
        <button type="submit">Post!</button>
      </form>
    </div>
  )
}

export default CreatePost;