import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: []
    }]
}, {timestamps: true});

const Comment = model('Comment', commentSchema);
export default Comment;