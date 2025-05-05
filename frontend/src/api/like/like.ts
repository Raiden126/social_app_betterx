import axiosInstance from "@/utils/axiosInstance";

export const reactToPostApi = async (postId: string, type: string) =>
  await axiosInstance.post(`/like/${postId}`, { type });

export const removeReactionApi = async (postId: string) =>
  await axiosInstance.delete(`/like/${postId}`);

export const getPostReactionsApi = async (postId: string) =>
  await axiosInstance.get(`/like/${postId}`);

export const getUserReactionsApi = async (postId: string) => 
  await axiosInstance.get(`/like/${postId}/user-reaction`);