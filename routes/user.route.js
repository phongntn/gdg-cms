const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware.js');
const {createUser, getUser, getUsers, updateUser, deleteUser} = require('../controllers/user.controller');

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);

router.put('/:id', authenticateToken, updateUser);
router.put('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

router.delete('/:id', authenticateToken, deleteUser);
router.delete('/', authenticateToken, (res) => {
    res.status(400).json({ message: "No parameter provided" });
});

module.exports = router;