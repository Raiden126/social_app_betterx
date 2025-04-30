import multer from "multer";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.user;

        if(!id) {
            return res.status(401).json(new ApiError(401, 'Id is not present'));
        }

        const user = await User.findById(id);
        if(!user) {
            return res.status(402).json(new ApiError(402, 'The user not found'));
        }

        user.email = `${user.email}_deleted_${Date.now()}`;
        user.username = `${user.username}_deleted_${Date.now()}`;
        user.isVerified = false;
        user.deletedAt = Date.now();

        await user.save({validateBeforeSave: false});

        return res
        .status(200)
        .json(
            new ApiResponse(200, null, 'User deleted successfully')
        )
    } catch (error) {
        console.log('error in deleteUser', error.message);
        return res
        .status(500)
        .json(new ApiError(500, 'Something went wrong, please try again'));
    }
}

export const updateUser = async (req, res) => {
    try{
      const { id } = req.user;
      const { firstname, lastname, bio } = req.body;

      if (!id) {
        return res.status(401).json(new ApiError(401, "Id is not present"));
      }

      if(!firstname && !lastname && !bio && !req.files) {
        return res.status(400).json(new ApiError(400, "No fields to update"));
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json(new ApiError(404, "The user not found"));
      }

      if (firstname !== undefined) user.firstname = firstname;
      if (lastname !== undefined) user.lastname = lastname;
      if (bio !== undefined) user.bio = bio;

      // Handle file uploads
      if (req.files?.profilePicture) {
        user.profilePicture = req.files.profilePicture[0].path;
      }
      if (req.files?.coverImage) {
        user.coverImage = req.files.coverImage[0].path;
      }

      await user.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json(new ApiResponse(200, null, "User updated successfully"));
    }catch (error) {
        console.log('error in updateUser', error.message);
        if (error instanceof multer.MulterError) {
          return res.status(400).json(new ApiError(400, error.message));
        }
        return res
        .status(500)
        .json(new ApiError(500, 'Something went wrong, please try again'));
    }
}

export const getUserProfile = async (req, res) => {
  try {
    const {username} = req.params;

    if(!username.trim()) {
      return res.status(400).json(new ApiError(400, 'Username is missing'));
    }

    const user = await User.aggregate([
      {
        $match: {
          username: username.toLowerCase()
        }
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
          as: "following"
        }
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "follows",
          as: "follower"
        }
      },
      {
        $addFields: {
          followerCount: {
            $size: "$follower"  
          },
          followingCount: {
            $size: "$following"
          }
        }
      },
      {
        $project: {
          username: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          followingCount: 1,
          followerCount: 1,
          profilePicture: 1,
          coverImage: 1,
          bio: 1
        }
      }
    ])

    if(!user || user.length === 0) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user[0], 'User profile fetched successfully'));
  } catch (error) {
    console.log('error in getUserProfile', error.message);
    return res
      .status(500)
      .json(new ApiError(500, 'Something went wrong, please try again'));
  }
}