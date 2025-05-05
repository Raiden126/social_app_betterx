import express from 'express';
import {
  reactToPost,
  removeReaction,
  getPostReactions,
  getUserReaction,
//   getUserLikes,
} from '../controllers/like.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/post/:postId', getPostReactions);

router.use(authMiddleware);

router.post('/:postId', reactToPost);
router.delete('/:postId', removeReaction);
router.get('/:postId/user-reaction', getUserReaction);
// router.get('/user/me', getUserLikes);

export default router;
