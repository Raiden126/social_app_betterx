import jwt from 'jsonwebtoken';
import { sendEmail } from "../config/sendEmail.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateOTP } from "../utils/GenerateOtp.js";

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});
    
        return {accessToken, refreshToken}
    } catch (error) {
        console.error('error in generateAccessAndRefreshToken', error.message);
        return res.status(500).json( new ApiError(500, 'Something went wrong while generating referesh and access token'))
    }
}

export const registerUser = async (req, res) => {
    try {
        const {email, username, firstname, lastname, password, confirmPassword} = req.body;
    
        if(
            [firstname, lastname, email, username, password, confirmPassword].some((field) => field?.trim() === '')
        ) {
            return res.status(400).json( new ApiError(400, "All fields are required"));
        }
    
        const existingUser = await User.findOne({
            $or: [{username}, {email}],
            deletedAt: { $eq: null }
        })
    
        if(existingUser) {
            return res.status(400).json( new ApiError(400, "User already exists"));
        }

        if (password !== confirmPassword) {
            return res.status(401).json(new ApiError(401, 'Both passwords are not same'))
        }

        const {otp, expiresAt} = generateOTP();
    
        const user = await User.create({
            firstname,
            lastname,
            email,
            username,
            password,
            otp: {code: otp, expiresAt}
        })
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken -otp");
    
        if(!createdUser) {
            return res.status(500).json( new ApiError(500, "Something went wrong while registering the user"));
        }
        
        await sendEmail(
            email,
            'Your Otp Code',
            `Hi ${firstname},\n\nYour OTP is ${otp}. It expires in 10 minutes.`
        );
    
        return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "OTP sent successfully")
        )
    } catch (error) {
        console.error("Something went wrong in register user", error)
        return res.status(500).json( new ApiError(500, "Something went wrong, please try again")) 
    }
}

export const verifyUser = async (req, res) => {
    const {otp, email} = req.body;

    try {
        if(!otp) {
            return res.status(400).json( new ApiError(400, "OTP is required"));
        }

        const user = await User.findOne({ email, deletedAt: null }).select('-password -refreshToken');
        if(!user) {
            return res.status(400).json( new ApiError(400, "User not found"));
        }

        if(user.otp.code !== otp) {
            return res.status(400).json( new ApiError(400, "Invalid OTP"));
        }

        const currentTime = new Date();
        if(user.otp.expiresAt < currentTime) {
            return res.status(400).json( new ApiError(400, "OTP expired. Please request a new OTP"));
        }

        user.isVerified = true;
        user.otp.code = null;
        user.otp.expiresAt = null;
        await user.save({validateBeforeSave: false});

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, user, "User verified successfully")
        )
    } catch (error) {
        console.error("Something went wrong in verify user", error)
        return res.status(500).json( new ApiError(500, "Something went wrong, please try again"))
    }
}

export const loginUser = async (req, res) => {
    const {email, password, username} = req.body;

    try{
        if(!password || (!email && !username)) {
            return res.status(400).json( new ApiError(400, "Email or username and password are required"));
        }

        const user = await User.findOne({
            $or: [{email}, {username}],
            deletedAt: { $eq: null }
        }).select('-refreshToken -otp -resetPasswordToken');

        if(!user){
            return res.status(400).json( new ApiError(400, "Invalid credentials"));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched) {
            return res.status(400).json( new ApiError(400, "Invalid credentials"));
        }

        if (!user.isVerified) {
          return res.status(400).json( new ApiError(
            400,
            "Email not verified. Please verify your email to login"
          ))
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, userResponse, "User logged in successfully")
        )
    }catch (err) {
        console.error("Something went wrong in login user", err);
        return res.status(500).json( new ApiError(500, "Something went wrong"));
    }
}

export const logoutUser = async (req, res) => {
    try{
        const user = req.user;
        user.refreshToken = null;
        await user.save({validateBeforeSave: false});

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json(
            new ApiResponse(200, null, "User logged out successfully")
        )
    }catch (err) {
        console.error("Something went wrong in logout user", err);
        return res.status(500).json( new ApiError(500, "Something went wrong"));
    }
}

export const resendOTP = async (req, res) => {
    try {
        const {email} = req.body;

        if(!email) {
            return res.status(400).json(new ApiError(400, 'Email is required'));
        }

        const user = await User.findOne({email, deleteAt: {$eq: null}})
        
        if(!user) {
            return res.status(404).json(new ApiError(404, 'User not found'));
        }

        const {otp, expiresAt} = generateOTP();

        user.otp.code = otp;
        user.otp.expiresAt = expiresAt;

        await user.save({validateBeforeSave: false});

        await sendEmail(
            email,
            'Your Otp Code',
            `Hi ${user.firstname || ''},\n\nYour OTP is ${otp}. It expires in 10 minutes.`
        );

        return res.status(200).json(new ApiResponse(200, 'OTP send successfully'))
    } catch (error) {
        console.error('Something went wrong in resendOTP', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong, please try again'))
    }
}

export const forgotpassword = async (req, res) => {
    try {
        const {email} = req.body;

        if(!email) {
            return res.status(400).json(new ApiError(400, 'Email is required'));
        }

        const user = await User.findOne({email, deleteAt: {$eq: null}})
        
        if(!user) {
            return res.status(404).json(new ApiError(404, 'User not found'));
        }
        const resetToken = await user.generateResetToken();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        await sendEmail(
        email,
        'Your Reset Password Link',
        `Hi ${user.firstname || 'User'},\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you didn’t request this, you can ignore this email.`
        );

        return res.status(200).json(new ApiResponse(200, 'Email Sent Successfully'))
    } catch (error) {
        console.error('Something went wrong in the forgotpassword', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong, please try again'))
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, password, newPassword } = req.body;
    
        if (!token || !password || !newPassword) {
            return res.status(400).json(new ApiError(400, 'All fields are required'));
        }

        if(password !== newPassword) {
            return res.status(400).json(new ApiError(400, 'Password do not matched'))
        }
    
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_RESET_TOKEN);
        } catch (err) {
            return res.status(401).json(new ApiError(401, 'Invalid or expired token'));
        }
    
        const user = await User.findOne({
            _id: decoded.id,
            'resetPasswordToken.token': token,
            'resetPasswordToken.expiresAt': { $gt: new Date() },
            deleteAt: {$eq: null}
        });
    
        if (!user) {
            return res.status(404).json(new ApiError(404, 'Invalid or expired reset token'));
        }
    
        user.password = password;
        user.resetPasswordToken.token = null;
        user.resetPasswordToken.expiresAt = null;
        await user.save();
    
        return res.status(200).json(new ApiResponse(200, 'Password reset successfully'));
    } catch (error) {
      console.error('Error in resetPassword:', error.message);
      return res.status(500).json(new ApiError(500, 'Something went wrong. Try again.'));
    }
};

export const changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword) {
            return res.status(400).json(new ApiError(400, 'All fields are required'));
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json(new ApiError(400, 'Password do not matched'))
        }

        const user = req.user;

        const isPasswordMatched = await user.comparePassword(oldPassword);

        if(!isPasswordMatched) {
            return res.status(400).json(new ApiError(400, 'Invalid credentials'));
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json(new ApiResponse(200, 'Password changed successfully'))
    } catch (error) {
        console.error('Something went wrong in change password', error.message);
        return res.status(500).json(new ApiError(500, 'Something went wrong. Try again.'));
    }
}