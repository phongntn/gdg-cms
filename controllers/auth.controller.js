require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

const register = async (req, res) => {
    console.log("BODY:", req.body);  // log thử trên Vercel
      if (!req.body.password) {
        return res.status(400).json({ message: "Password is missing" });
    }
    const { username, password, email } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({message: 'User already exists'});

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ username, password: hashedPassword, email });

        const tokens = generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(200).json({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Username does not exist' });
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Wrong password' });
        }

        const tokens = generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save();
        res.json(tokens);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const logout = async (req, res) => {
    try {
        const { username, refreshToken } = req.body;
        const user = await User.findOne({ username, refreshToken });
        if (!user) return res.status(400).json({ message: 'Invalid token' });

        user.refreshToken = null;
        await user.save();

        res.json({ message: 'Logged out' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Kiểm tra refresh token có tồn tại trong DB không
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || decoded.userId !== user._id.toString()) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }

      // Tạo access token mới
      const newAccessToken = jwt.sign(
        {
          userId: user._id,
          username: user.username
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email not found' });

    // Tạo token reset
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
        }
    });

    const mailOptions = {
        to: user.email,
        subject: 'Reset your password',
        text: `Click this link to reset password: http://localhost:3000/reset-password/${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
}

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken
}