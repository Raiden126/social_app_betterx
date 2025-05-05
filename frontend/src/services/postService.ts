import { getAuthUserPosts, getUserPosts } from "@/api/post/post";

export const postService = {
  getAuthUserPost: async () => {
    try {
      return await getAuthUserPosts();
    } catch (error) {
      throw error;
    }
  },
  getUserPosts: async (username: any) => {
    try {
      return await getUserPosts(username);
    } catch (error) {
      throw error;
    }
  }
}