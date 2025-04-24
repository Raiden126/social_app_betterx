import express from 'express';
import {
    addComment, deleteComment, getComments, getComment, updateComment,
    likeComment, unlikeComment, replyToComment
} from '../controllers/comment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/comments/:postId', addComment);
router.delete('/comments/:commentId', deleteComment);
router.get('/comments/:postId', getComments);
router.get('/comment/:commentId', getComment);
router.put('/comments/:commentId', updateComment);

router.post('/comments/:commentId/like', likeComment);
router.post('/comments/:commentId/unlike', unlikeComment);

router.post('/comments/:commentId/reply', replyToComment);

export default router;
