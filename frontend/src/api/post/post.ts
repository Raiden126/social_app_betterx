import axiosInstance from "@/utils/axiosInstance";

export const getAuthUserPosts = async () => {
  try {
    const response = await axiosInstance.get(
      "/post/get-auth-posts"
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getUserPosts = async (username: string) => {
  try {
    const response = await axiosInstance.get(
      `/post/get-user-posts/${username}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
