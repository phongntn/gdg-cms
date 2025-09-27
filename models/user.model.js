const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        role: {
            type: String,
            default: "Member"
        },
        specialty: {
            type: String
        },
        refreshToken: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    }
)

const User = mongoose.model('User', UserSchema);

module.exports = User;