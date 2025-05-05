import * as api from "@/api/like/like";

export const likeService = {
  react: async (postId: string, type: string) => {
     const response = await api.reactToPostApi(postId, type)
     return response;
    },
  remove: async (postId: string) => {
     const response = await api.removeReactionApi(postId)
     return response;
    },
  getReactions: async (postId: string) => {
     const response = await api.getPostReactionsApi(postId)
     return response;
    },
  getUserReaction: async (postId: string) => {
     const response = await api.getUserReactionsApi(postId)
      return response;
    },
};