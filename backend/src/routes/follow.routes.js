import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/follower.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfollowUser);

router.get('/followers', getFollowers);               // self
router.get('/followers/:userId', getFollowers);       // other user

router.get('/following', getFollowing);               // self
router.get('/following/:userId', getFollowing);       // other user

export default router;