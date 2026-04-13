const mongoose = require('mongoose');
const Counter = require('./counter.model');

const UserSchema = mongoose.Schema(
    {
        userId: {
            type: Number,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
        },
        role: {
            type: String,
            enum: ['Admin', 'Leader', 'Member'],
            default: 'Member'
        },
        specialty: {
            type: String
        },
        major: {
            type: String
        },
        refreshToken: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret.userId;
                delete ret._id;
                delete ret.__v;
                delete ret.userId;
                return {
                    id: ret.id,
                    username: ret.username,
                    firstName: ret.firstName,
                    lastName: ret.lastName,
                    email: ret.email,
                    role: ret.role,
                    specialty: ret.specialty
                }
            }
        }
    }
)

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = counter.seq;
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;