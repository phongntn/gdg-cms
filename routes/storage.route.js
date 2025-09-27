const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {getFiles, getFile, createFile, updateFile, deleteFile} = require("../controllers/storage.controller.js");

router.get('/', authenticateToken, getFiles);
router.get('/:id', authenticateToken, getFile);

router.post('/', authenticateToken, createFile);

router.put('/:id', authenticateToken, updateFile);

router.delete('/:id', authenticateToken, deleteFile);

module.exports = router;