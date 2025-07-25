const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        votes: {
            type: Number,
            required: true,
            default: 0
        },

        image: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;