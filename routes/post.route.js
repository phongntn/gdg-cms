const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {getPosts, getPost, createPost, updatePost, deletePost} = require('../controllers/post.controller.js');

router.get('/', authenticateToken, getPosts);
router.get("/:id", authenticateToken, getPost);

router.post("/", authenticateToken, createPost);

router.put("/:id", authenticateToken, updatePost);
router.put('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete("/:id", authenticateToken, deletePost);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;