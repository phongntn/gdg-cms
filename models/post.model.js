const mongoose = require('mongoose');
const Counter = require('./counter.model');

const PostSchema = mongoose.Schema(
    {
        postId: {
            type: Number,
            unique: true
        },

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
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
            ret.id = ret.postId;
            delete ret._id;
            delete ret.__v;
            delete ret.postId;
            return {
                    id: ret.id,
                    title: ret.title,
                    content: ret.content,
                    author: ret.author,
                    vote: ret.vote
                };
            }
        }
    }
);

PostSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "postId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.postId = counter.seq;
  }
  next();
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;