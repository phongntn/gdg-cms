const express = require("express");
const router = express.Router();
const {getFiles, getFile, createFile, updateFile, deleteFile} = require("../controllers/storage.controller.js");

router.get('/', getFiles);
router.get('/:id', getFile);

router.post('/', createFile);

router.put('/:id', updateFile);

router.delete('/:id', deleteFile);

module.exports = router;