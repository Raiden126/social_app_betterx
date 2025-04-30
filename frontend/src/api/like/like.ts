import axiosInstance from "@/utils/axiosInstance";

export const reactToPostApi = (postId: string, type: string) =>
  axiosInstance.post(`/like/${postId}`, { type });

export const removeReactionApi = (postId: string) =>
  axiosInstance.delete(`/like/${postId}`);

export const getReactionsApi = (postId: string) =>
  axiosInstance.get(`/like/post/${postId}`);
