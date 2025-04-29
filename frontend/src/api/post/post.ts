import axiosInstance from "@/utils/axiosInstance";
import { PostResponse } from "@/types/post";

export const getPosts = async (): Promise<PostResponse> => {
  try {
    const response = await axiosInstance.get<PostResponse>(
      "/post/get-posts"
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
