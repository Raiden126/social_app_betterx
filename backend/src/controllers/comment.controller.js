import Comment from "../models/comment.model.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {postId} = req.params;
        const {text} = req.body;

        if(!userId || !postId) {
            return res.status(400).json(400, 'Id is not found')
        }

        if(!text) {
            return res.status(400).json(400, 'Text is required');
        }

        const cretedComment = await Comment.create({user: userId, post: postId, text})

        return res.status(200).json(new ApiResponse(200, "Success", cretedComment))
    } catch (error) {
        console.log('error in addComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong during adding the comment'));
    }
}

export const deleteComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {commentId} = req.params;

        if(!userId || !commentId) {
            return res.status(400).json(400, 'User id ')
        }

        const comment = await Comment.findById(commentId);

        if(!comment) {
            return res.status(404).json(new ApiError(404, 'Comment not found'));
        }

        if(comment.user.toString() !== userId) {
            return res.status(403).json(new ApiError(403, 'You are not allowed to delete this comment'));
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json(new ApiResponse(200, 'Comment deleted successfully'));
    } catch (error) {
        console.error('error in deleteComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
}

export const getComments = async (req, res) => {
    try {
        const {postId} = req.params;
        if(!postId) {
            return res.status(400).json(new ApiError(400, 'Post id is required'));
        }

        const comments = await Comment.find({post: postId}).populate('user', 'firstname lastname profilePicture').sort({createdAt: -1});

        if(!comments || comments.length === 0) {
            return res.status(404).json(new ApiError(404, 'No comments found'));
        }

        return res.status(200).json(new ApiResponse(200, 'Comment fetched successfully', comments));
    } catch (error) {
        console.error('error in getComments', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
}

export const getComment = async (req, res) => {
    try {
        const {commentId} = req.params;
        if(!commentId) {
            return res.status(400).json(new ApiError(400, 'Comment id is required'));
        }

        const comment = await Comment.findById(commentId).populate('user', 'firstname lastname profilePicture');

        if(!comment) {
            return res.status(404).json(new ApiError(404, 'Comment not found'));
        }

        return res.status(200).json(new ApiResponse(200, 'Comment fetched successfully', comment));
    } catch (error) {
        console.error('error in getComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
}

export const updateComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const {text} = req.body;

        if(!userId || !commentId) {
            return res.status(400).json(new ApiError(400, 'Id is not found'));
        }

        if(!text) {
            return res.status(400).json(new ApiError(400, 'Text is required'));
        }

        const comment = await Comment.findById(commentId);

        if(!comment) {
            return res.status(400).json(new ApiError(400, 'Comment not found'));
        }

        if(comment.user.toString() !== userId) {
            return res.status(401).json(new ApiError(401, 'You are not allowed to edit this comment'));
        }

        comment.text = text;
        await comment.save();

        return res.status(200).json(new ApiResponse(200, 'Comment updated successfully'))
    } catch (error) {
        console.error('error in updateComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
}

export const likeComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(400).json(new ApiError(400, 'Comment ID is required'));
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json(new ApiError(404, 'Comment not found'));
        }

        if (comment.likes.includes(userId)) {
            return res.status(400).json(new ApiError(400, 'You have already liked this comment'));
        }

        comment.likes.push(userId);
        await comment.save();

        return res.status(200).json(new ApiResponse(200, 'Comment liked successfully', comment));
    } catch (error) {
        console.error('Error in likeComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
};

export const unlikeComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(400).json(new ApiError(400, 'Comment ID is required'));
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json(new ApiError(404, 'Comment not found'));
        }

        if (!comment.likes.includes(userId)) {
            return res.status(400).json(new ApiError(400, 'You have not liked this comment'));
        }

        comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        await comment.save();

        return res.status(200).json(new ApiResponse(200, 'Comment unliked successfully', comment));
    } catch (error) {
        console.error('Error in unlikeComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
};

export const replyToComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { commentId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json(new ApiError(400, 'Text is required for the reply'));
        }

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json(new ApiError(404, 'Parent comment not found'));
        }

        const newReply = await Comment.create({ user: userId, post: parentComment.post, text });

        parentComment.replies.push(newReply._id);
        await parentComment.save();

        return res.status(200).json(new ApiResponse(200, 'Reply added successfully', newReply));
    } catch (error) {
        console.error('Error in replyToComment', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong'));
    }
};