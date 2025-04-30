import { getPosts } from "@/api/post/post";
import { PostResponse } from "@/types/post";

export const postService = {
  getpost: async (): Promise<PostResponse> => {
    try {
      return await getPosts();
    } catch (error) {
      throw error;
    }
  }
}