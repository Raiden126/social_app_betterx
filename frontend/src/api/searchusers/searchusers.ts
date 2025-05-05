import axiosInstance from "@/utils/axiosInstance";

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/v1/users/get-all-users");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const viewProfile = async (username: string) => {
  try {
    const response = await axiosInstance.get(
      `/v1/users/get-user/${username}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const followUser = async (user_id: string) => {
  try {
    const response = await axiosInstance.post(`/follow/follow/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
