import * as api from "@/api/like/like";

export const likeService = {
  react: api.reactToPostApi,
  remove: api.removeReactionApi,
  getReactions: api.getReactionsApi,
};
