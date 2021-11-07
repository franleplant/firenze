import { IPost } from 'client/io/posts';
import Image from 'next/image';

export default function Post(props: IPost) {
  return <div style={{ border: "2px dotted black" }}>
    <h3>Author: {props.author}</h3>
    <p>Content: {props.content}</p>
    {props.images && props.images.map((image, i) => {
      return (
        <div key= {image} style={{ 
          position: "relative", 
          maxWidth: "300px", 
          minHeight: "300px"
        }}>
          <Image
            src={`https://ipfs.io/ipfs/${image}`}
            alt={`Image ${i}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )
    })}
  </div>
}