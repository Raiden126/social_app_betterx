import Like from '../models/like.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;
    const userId = req.user._id;

    if(!postId || !userId) {
        return res.status(400).json(new ApiError(400, "UserId or PostId is missing"))
    }

    if(!type) {
        return res.status(400).json(new ApiError(400, 'Reaction is missing'));
    }

    const allowedTypes = ['like', 'love', 'laugh', 'sad', 'angry'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const existing = await Like.findOne({ user: userId, post: postId });
    if (existing && existing.type === type) {
      return res.status(200).json(new ApiResponse(200, existing, 'Reaction unchanged'));
    }

    const reaction = await Like.findOneAndUpdate(
      { user: userId, post: postId },
      { type },
      { new: true, upsert: true }
    );

    return res.status(200).json(new ApiResponse(200, reaction, 'Like updated'));
  } catch (err) {
    console.log('something went wrong in reactToPost:', err.message)
    return res.status(500).json(new ApiError(500, 'Something went wrong'));
  }
};

export const removeReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if(!postId || !userId) {
        return res.status(400).json(new ApiError(400, "UserId or PostId is missing"))
    }

    const result = await Like.findOneAndDelete({ user: userId, post: postId });

    if (!result) {
      return res.status(404).json(new ApiError(404, 'Like not found'));
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed successfully"));
  } catch (err) {
    console.error('something went wrong in removeReaction', err.message);
    return res.status(500).json(new ApiError(500, 'Something went wrong'));
  }
};

export const getPostReactions = async (req, res) => {
  try {
    const { postId } = req.params;

    if(!postId) {
        return res.status(400).json(new ApiError(400, 'PostId is not found'));
    }

    const reactions = await Like.find({ post: postId }).populate('user', 'username');

    if(!reactions) {
      return res.status(200).json(new ApiResponse(200, {}, 'No reactions yet'));
    }

    const grouped = reactions.reduce((acc, r) => {
      acc[r.type] = acc[r.type] ? [...acc[r.type], r.user] : [r.user];
      return acc;
    }, {});

    return res.status(200).json(new ApiResponse(200, grouped, 'Reactions fetched successfully'));
  } catch (err) {
    console.error('something went wrong in getPostReactions:', err.message);
    return res.status(500).json(new ApiError(500, 'something went wrong'));
  }
};

export const getUserReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!postId || !userId) {
      return res.status(400).json(new ApiError(400, "UserId or PostId is missing"));
    }

    const userReaction = await Like.findOne({ user: userId, post: postId });

    if (!userReaction) {
      return res.status(200).json(
        new ApiResponse(200, { reaction: null }, "User has not reacted to this post")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { reaction: userReaction.type }, "User reaction fetched successfully")
    );
  } catch (err) {
    console.error('Something went wrong in getUserReaction:', err.message);
    return res.status(500).json(new ApiError(500, 'Something went wrong'));
  }
};