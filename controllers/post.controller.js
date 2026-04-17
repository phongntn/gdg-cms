const Post = require('../models/post.model.js');
const User = require('../models/user.model');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPost = async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (Number.isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post id' });
        }

        const post = await Post.findOne({ postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const username = req.user?.username;

        if (!username) {
            return res.status(401).json({ message: 'Unauthorized: no user found' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postData = {
            ...req.body,
            author: username
        };

        const post = await Post.create(postData);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (Number.isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post id' });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { postId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = Number(req.params.id);

        if (Number.isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post id' });
        }

        const post = await Post.findOneAndDelete({ postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
};