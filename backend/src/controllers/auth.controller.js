import User from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});
    
        return {accessToken, refreshToken}
    } catch (error) {
        console.error('error in generateAccessAndRefreshToken', error.message);
        throw new ApiError(500, 'Something went wrong while generating referesh and access token')
    }
}

export const registerUser = async (req, res) => {
    try {
        const {email, username, firstname, lastname, password} = req.body;
    
        if(
            [firstname, lastname, email, username, password].some((field) => field?.trim() === '')
        ) {
            throw new ApiError(400, "All fields are required");
        }
    
        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        })
    
        if(existingUser) {
            throw new ApiError(400, "User already exists");
        }
    
        const user = await User.create({
            firstname,
            lastname,
            email,
            username,
            password,
            isVerified: true
        })
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken -otp");
    
        if(!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }
        
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )
    } catch (error) {
        console.error("Something went wrong in register user", error)
        throw new ApiError(500, "Something went wrong, please try again")
    }
}