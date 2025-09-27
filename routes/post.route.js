const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {getPosts, getPost, createPost, updatePost, deletePost} = require('../controllers/post.controller.js');

router.get('/', authenticateToken, getPosts);
router.get("/:id", authenticateToken, getPost);

router.post("/", authenticateToken, createPost);

router.put("/:id", authenticateToken, updatePost);

router.delete("/:id", authenticateToken, deletePost);

module.exports = router;