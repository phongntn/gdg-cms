const express = require("express");
const router = express.Router();
const {authenticateToken, authorizeRoles} = require('../middlewares/auth.middleware.js');
const restrictRequest = require('../middlewares/request.restrict.js');
const restrictResponse = require('../middlewares/response.restrict.js');
const ownership = require('../middlewares/ownership.js');
const permission = require('../config/post.perm.js');
const {getPosts, getPost, createPost, updatePost, deletePost} = require('../controllers/post.controller.js');

router.get('/', authenticateToken, getPosts);
router.get("/:id", authenticateToken, getPost);

router.post("/", authenticateToken, restrictRequest(permission.create), createPost);

router.put("/:id", authenticateToken, ownership, restrictRequest(permission.edit), updatePost);
router.put('/', authenticateToken, (req, res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete("/:id", authenticateToken, ownership, authorizeRoles('Admin'), deletePost);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;