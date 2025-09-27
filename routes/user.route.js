const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {createUser, getUser, getUsers, updateUser, deleteUser} = require('../controllers/user.controller');

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);

router.put('/:id', authenticateToken, updateUser);

router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;