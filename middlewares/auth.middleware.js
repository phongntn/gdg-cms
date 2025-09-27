const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect: "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        req.user = user; // userId, username đã được ký khi tạo token
        next();
    });
};

module.exports = authenticateToken;
