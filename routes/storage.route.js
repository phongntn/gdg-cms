const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {getFiles, getFile, createFile, updateFile, deleteFile} = require("../controllers/storage.controller.js");

router.get('/', authenticateToken, getFiles);
router.get('/:id', authenticateToken, getFile);

router.post('/', authenticateToken, createFile);

router.put('/:id', authenticateToken, updateFile);
router.put('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete('/:id', authenticateToken, deleteFile);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;