import { getPosts } from "@/api/post/post";
import { PostData, PostResponse } from "@/types/post";

export const postService = {
  getpost: async (postData: PostData): Promise<PostResponse> => {
    try {
      return await getPosts(postData);
    } catch (error) {
      throw error;
    }
  }
}