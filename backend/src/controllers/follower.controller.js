import Follow from "../models/follower.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const followUser = async (req, res) => {
    try {
        const followerId = req.user._id;
        const { userId } = req.params;

        if(!followerId || !userId) {
            return res.status(400).json(new ApiError(400, "Follower ID and User ID are required"));
        }

        if(followerId === userId) {
            return res.status(400).json(new ApiError(400, "You cannot follow yourself"));
        }

        const alreadyFollowing = await Follow.findOne({ follower: followerId, following: userId });
        
        if(alreadyFollowing) {
            return res.status(400).json(new ApiError(400, "You are already following this user"));
        }

        const newFollow = await Follow.create({ follower: followerId, following: userId });

        await newFollow.save();
        
        return res.status(200).json(new ApiResponse(200, newFollow, "Followed user successfully"));
    } catch (error) {
        console.error("error in followUser", error.message);
        return res.status(500).json(new ApiError(500, "Something went wrong while following user"));
    }
}

export const unfollowUser = async (req, res) => {
    try {
        const followerId = req.user._id;
        const { userId } = req.params;

        if(!followerId || !userId) {
            return res.status(400).json(new ApiError(400, "Follower ID and User ID are required"));
        }

        if(followerId === userId) {
            return res.status(400).json(new ApiError(400, "You cannot unfollow yourself"));
        }

        const alreadyFollowing = await Follow.findOne({ follower: followerId, following: userId });
        
        if(!alreadyFollowing) {
            return res.status(400).json(new ApiError(400, "You are not following this user"));
        }

        await Follow.deleteOne({ follower: followerId, following: userId });

        return res.status(200).json(new ApiResponse(200, null, "Unfollowed user successfully"));    
    } catch (error) {
        console.error("error in unfollowUser", error.message);
        return res.status(500).json(new ApiError(500, "Something went wrong while unfollowing user"));
    }
}

export const getFollowers = async (req, res) => {
    try {
        const targetUserId = req.user.id || req.params.userId;
        if(!targetUserId) {
            return res.status(400).json(new ApiError(400, "User ID is required"));
        }
        const followers = await Follow.find({ following: targetUserId })
            .populate("follower", "username email profilePicture firstname lastname")
            .select("-__v -createdAt -updatedAt");
        if(!followers || followers.length === 0) {
            return res.status(404).json(new ApiError(404, "No followers found"));
        }
        return res.status(200).json(new ApiResponse(200, followers, "Followers fetched successfully"));
    } catch (error) {
        console.error("error in getFollowers", error.message);
        return res.status(500).json(new ApiError(500, "Something went wrong while getting followers"));
    }
}

export const getFollowing = async (req, res) => {
    try {
        const targetUserId = req.user.id || req.params.userId;

        if(!targetUserId) {
            return res.status(400).json(new ApiError(400, "User ID is required"));
        }
        const following = await Follow.find({ follower: targetUserId })
            .populate("following", "username email profilePicture firstname lastname")
            .select("-__v -createdAt -updatedAt");
            
        if(!following || following.length === 0) {
            return res.status(404).json(new ApiError(404, "No following found"));
        }
        // const followingList = following.map(f => f.following);
        return res.status(200).json(new ApiResponse(200, following, "Following fetched successfully"));
    } catch (error) {
        console.error("error in getFollowing", error.message);
        return res.status(500).json(new ApiError(500, "Something went wrong while getting following"));
    }
}