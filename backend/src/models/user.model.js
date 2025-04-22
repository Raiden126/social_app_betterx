import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    email: {
        type: String,
        required: ["Email is required", true],
        unique: ["Email already exists", true],
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: ["Username is required", true],
        unique: ["Username already exists", true],
        trim: true,
        minlength: 3,
        maxlength: 20,
        lowercase: true,
    },
    firstname: {
        type: String,
        required: ["Firstname is required", true],
        trim: true,
        minlength: 3,
        maxlength: 20,
        default: ""
    },
    lastname: {
        type: String,
        required: ["Lastname is required", true],
        trim: true,
        minlength: 3,
        maxlength: 20,
        default: ""
    },
    password:{
        type: String,
        required: ["Password is required", true],
        minlength: 6,
        maxlength: 20,
    },
    bio: {
        type: String,
        default: ""
    }, 
    profilePicture: {
        type: String,
        default: ""
    },
    savedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    avatar: {
        type: String,
        default: ""
    },
    otp: {
        code: {
            type: String,
            default: null
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username
    },

    process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        id: this._id
    },
    process.env.JWT_REFRESH_TOKEN,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    )
}

const User = model("User", userSchema);
export default User;