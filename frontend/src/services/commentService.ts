import * as api from "@/api/comment/comment";

export const commentService = {
  add: api.addCommentApi,
  update: api.updateCommentApi,
  delete: api.deleteCommentApi,
  getAll: api.getCommentsApi,
  getOne: api.getCommentApi,
  like: api.likeCommentApi,
  unlike: api.unlikeCommentApi,
  reply: api.replyToCommentApi
};
