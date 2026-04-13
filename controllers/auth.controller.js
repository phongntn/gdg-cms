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
    { userId: user._id, username: user.username, role: user.role },
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
    const { username, password, email, firstName, lastName } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({message: 'User already exists'});

        if (username.includes(" ")) {
          return res.status(400).json({ message: "Username not allowed" });
        } 

        if (password.includes(" ")) {
          return res.status(400).json({ message: "Password not allowed" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, email, firstName, lastName });

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
          username: user.username,
          role: user.role
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
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent"
      });
    }

    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(rawResetToken)
      .digest("hex");

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedResetToken,
          resetPasswordExpires: Date.now() + 3600000
        }
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const resetLink = `http://localhost:3000/reset-password/${rawResetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset</h2>
          <p>Hello ${user.username},</p>
          <p>You requested to reset your password.</p>
          <p>Click the link below to continue:</p>
          <p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
          </p>
          <p>This link will expire in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    return res.status(200).json({
      message: "If the email exists, a reset link has been sent"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (password.includes(" ")) {
      return res.status(400).json({ message: "Password not allowed" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
          refreshToken: ""
        }
      }
    );

    return res.status(200).json({
      message: "Password has been reset successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword
}