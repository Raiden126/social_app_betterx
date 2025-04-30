import axiosInstance from "@/utils/axiosInstance";

export const addCommentApi = (postId: string, text: string) =>
  axiosInstance.post(`/comment/comments/${postId}`, { text });

export const updateCommentApi = (commentId: string, text: string) =>
  axiosInstance.put(`/comment/comments/${commentId}`, { text });

export const deleteCommentApi = (commentId: string) =>
  axiosInstance.delete(`/comment/comments/${commentId}`);

export const getCommentsApi = (postId: string) =>
  axiosInstance.get(`/comment/comments/${postId}`);

export const getCommentApi = (commentId: string) =>
  axiosInstance.get(`/comment/comment/${commentId}`);

export const likeCommentApi = (commentId: string) =>
  axiosInstance.post(`/comment/comments/${commentId}/like`);

export const unlikeCommentApi = (commentId: string) =>
  axiosInstance.post(`/comment/comments/${commentId}/unlike`);

export const replyToCommentApi = (commentId: string, text: string) =>
  axiosInstance.post(`/comment/comments/${commentId}/reply`, { text });
