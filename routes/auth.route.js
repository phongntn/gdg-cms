const express = require("express");
const router = express.Router();
const {register, login, logout, refreshAccessToken, forgotPassword, resetPassword} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post("/reset-password/:token", resetPassword);
module.exports = router;