import { Schema, model } from "mongoose";

const reactionTypes = ['like', 'love', 'laugh', 'sad', 'angry'];

const likeSchema = new Schema({
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
    type: {
        type: String,
        enum: reactionTypes,
        required: true
    }
}, {timestamps: true});

likeSchema.index({ user: 1, post: 1 }, { unique: true });

const Like = model('Like', likeSchema);

export default Like;