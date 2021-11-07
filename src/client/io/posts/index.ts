import { TileDocument } from "@ceramicnetwork/stream-tile";
import useSelfID from "client/modules/wallet/useSelfID";
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "react-query";
import invariant from "ts-invariant";
import { useCeramicProfile } from "../profile";

export interface IPosts {
  posts: string[];
}

export interface IPost {
  streamID?: string;
  author: string;
  content: string;
  images: string[];
}

export interface ICreatePost {
  content: string;
  images: string[];
}

export function useMyPosts(): UseQueryResult<IPost[] | undefined> {
  const { data: selfID } = useSelfID();
  const { data: profile } = useCeramicProfile();
  return useQuery({
    queryKey: "user-posts",
    cacheTime: 5000,
    enabled: !!(profile && selfID),
    queryFn: async () => {
      if (!(profile && selfID)) {
        console.log("Profile not available...")
        return [];
      }
      const postsStream = await selfID.client.ceramic.loadStream(profile.posts);
      const posts = postsStream!.content as IPosts;
      console.log("Fetching posts...");
      return Promise.all(
        posts.posts.map(streamId => selfID.client.ceramic.loadStream(streamId))
        
      ).then(tiles => tiles.filter(tile => null !== tile)
      .map(tile => {
        return {
          streamID: tile?.id.toString(),
          ...tile?.content
        } as IPost
      }));
    },
  });
}

export function useCreatePost(): UseMutationResult<unknown, unknown, ICreatePost> {
  const { data: selfID } = useSelfID();
  const { data: profile } = useCeramicProfile();
  return useMutation(
    async (data) => {
      invariant(selfID, "SelfID not available");
      invariant(profile, "User profile not available");
      const post = {
        ...data,
        author: selfID.id
      } as IPost;
      const doc = await TileDocument.create(selfID.client.ceramic, post, {
        controllers: [ selfID.id.toString() ],
        schema: selfID.client.dataModel.getSchemaURL("Post")!,
        family: "firenze"
      });
      console.log("Post created", doc);
      const postsStream = await TileDocument.load(selfID.client.ceramic, profile.posts);
      const posts = postsStream!.content as IPosts;
      posts.posts = [ doc.id.toString() , ...posts.posts];
      await postsStream?.update(posts);
      console.log("Posts updated...");
      alert("Post created. StreamID: " + doc.id.toString());
    }
  );
}