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