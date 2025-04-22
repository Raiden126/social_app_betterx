import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.user;

        if(!id) {
            throw new ApiError(401, 'Id is not present');
        }

        const user = await User.findById(id);
        if(!user) {
            throw new ApiError(402, 'The user not found');
        }

        user.email = `${user.email}_deleted_${Date.now()}`;
        user.username = `${user.username}_deleted_${Date.now()}`;
        user.isVerified = false;
        user.deletedAt = Date.now();

        await user.save({validateBeforeSave: false});

        return res
        .status(200)
        .json(
            new ApiResponse(200, 'User deleted successfully')
        )
    } catch (error) {
        console.log('error in deleteUser', error.message);
        return res
        .status(500)
        .json(new ApiResponse(500, 'Something went wrong, please try again'));
    }
}